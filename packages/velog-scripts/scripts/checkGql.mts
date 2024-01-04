import 'reflect-metadata'
import path from 'path'
import fs from 'fs'

class Runner {
  resolver!: string[]
  constructor(resolver: string[]) {
    this.resolver = resolver
  }
  public async run() {
    this.validateTargetPath()

    Object.entries(this.target)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([_, { ext, path }]) => {
        if (ext === 'gql') {
          const keys = this.readGqlFileKeys(path)
          this.validateKey(keys)
        }

        if (ext === 'ts') {
          const keys = this.readTsFileKeys(path)
          this.validateKey(keys)
        }

        throw new Error(`Not allow extname: ${ext}`)
      })

    console.log('Checked all gql file keys')
  }
  private readTsFileKeys(dirpath: string) {
    const keys = new Set<string>()
    fs.readdirSync(dirpath)
      .filter((file) => path.extname(file) === '.ts')
      .forEach((file) => {
        const text = fs.readFileSync(`${dirpath}/${file}`, { encoding: 'utf-8' })
        // gql 태그로 정의된 쿼리들만 추출
        const gqlQueries = text.match(/gql`([\s\S]*?)`/gm)

        if (gqlQueries) {
          gqlQueries.forEach((query) => {
            // 쿼리 내부의 블록을 추출
            const blocks = query.match(/{[^{}]+}/g)
            if (blocks) {
              blocks.forEach((block) => {
                // 각 블록 내부의 내용을 공백으로 분리
                block.split(/\s+/).forEach((word) => {
                  // 중괄호, 특수 문자, 쿼리 변수 등을 제외하고 key 값만 추가
                  if (!word.match(/[{}()@:]/) && word !== '' && !word.includes('$')) {
                    keys.add(word)
                  }
                })
              })
            }
          })
        }
      })
    // Set을 배열로 변환하여 반환
    return Array.from(keys)
  }
  private readGqlFileKeys(dirpath: string) {
    const keys = new Set<string>()
    fs.readdirSync(dirpath)
      .filter((file) => path.extname(file) === '.gql')
      .forEach((file) => {
        const query = fs.readFileSync(`${dirpath}/${file}`, { encoding: 'utf-8' })
        const blocks = query.match(/{[^{}]+}/g)
        if (blocks) {
          blocks.forEach((block) => {
            block.split(/\s+/).forEach((word) => {
              if (!word.match(/[{}()@:]/) && word !== '') {
                keys.add(word)
              }
            })
          })
        }
      })
    return Array.from(keys)
  }
  private readDatabaseColumn(): string[] {
    const schemaPath = path.resolve(process.cwd(), './prisma/schema.prisma')

    if (!fs.existsSync(schemaPath)) {
      throw new Error('Could not find prisma schema, please try "pnpm prisma:copy"')
    }

    const schemaText = fs.readFileSync(schemaPath, { encoding: 'utf-8' })
    const columnNames = new Set<string>()

    // 모델 정의 내의 각 줄을 순회
    const lines = schemaText.split('\n').filter(Boolean)
    lines.forEach((line) => {
      // 라인이 공백이 아니고 '@'로 시작하지 않으면 컬럼 이름으로 간주
      if (line.trim() === '') return
      if (['[', ']', '{', '}', '='].map((k) => line.includes(k)).some((d) => !!d)) return
      if (line.includes('@@')) return
      const column = line.trim().split(' ')[0]
      columnNames.add(column)
    })
    return Array.from(columnNames)
  }
  private get target() {
    const cwd = process.cwd()
    const target: Record<string, Target> = {
      v3Web: {
        ext: 'gql',
        path: path.resolve(cwd, '../velog-web/src/graphql'),
      },
      v3Server: {
        ext: 'gql',
        path: path.resolve(cwd, '../velog-server/src/graphql'),
      },
      v2Client: {
        ext: 'ts',
        path: path.resolve(cwd, '../../../velog-v2/velog-client/src/lib/graphql'),
        exclude: ['types.d.ts'],
      },
      v2Server: {
        ext: 'ts',
        path: path.resolve(cwd, '../../../velog-v2/velog-server/src/graphql'),
      },
    }
    return target
  }
  private validateTargetPath() {
    const validatePath = Object.keys(this.target).map((key) =>
      this.checkPathExists(this.target[key].path),
    )

    if (!validatePath.every) {
      throw new Error(
        'Path not found, maybe wrong velog v2 folders, please check if v2 folder is the same as "velog-v2"',
      )
    }
  }
  private checkPathExists(path: string) {
    return fs.existsSync(path)
  }
  private validateKey(keys: string[]) {
    const columnNames = this.readDatabaseColumn()
    keys.map((key) => {
      if (!columnNames.includes(key) && !this.resolver.includes(key)) {
        console.log(`"${key}", Not found key in columns and resolver query or mutation`)
      }
    })
  }
}

;(function () {
  const resolver = getResolver()
  const runner = new Runner(resolver)
  runner.run()
})()

type Target = {
  ext: 'gql' | 'ts'
  path: string
  exclude?: string[]
}

function getResolver(): string[] {
  return [
    'registered',
    'profile_links',
    'posts_count',
    'unregisterToken',
    'logout',
    'comments_count',
    'liked',
    'count',
    'day',
    'acceptIntegration',
    'is_followed',
  ]
}
