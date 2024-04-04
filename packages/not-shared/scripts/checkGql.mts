import 'reflect-metadata'
import path from 'path'
import fs from 'fs'

class Runner {
  whiteList!: string[]
  constructor(whiteList: string[]) {
    this.whiteList = whiteList
  }
  public async run() {
    const cwd = process.cwd()
    const target: Record<string, Target> = {
      client: {
        v3: {
          ext: 'gql',
          path: path.resolve(cwd, '../velog-web/src/graphql'),
        },
        v2: {
          ext: 'ts',
          path: path.resolve(cwd, '../../../velog-v2/velog-client/src/lib/graphql'),
          exclude: ['types.d.ts'],
        },
      },
      server: {
        v3: {
          ext: 'gql',
          path: path.resolve(cwd, '../velog-server/src/graphql'),
        },
        v2: {
          ext: 'ts',
          path: path.resolve(cwd, '../../../velog-v2/velog-server/src/graphql'),
        },
      },
    }
    this.validateTargetPath(target)
    this.setWhiteList(target.server)

    Object.keys(target.client)
      .map((key) => target.client[key])
      .forEach(({ ext, path }) => {
        if (ext === 'gql') {
          const keys = this.extractKeysFromGql(path)
          this.validateKey(keys)
          return
        }
        if (ext === 'ts') {
          const keys = this.extractKeyFromTs(path)
          this.validateKey(keys)
          return
        }
        throw new Error(`Not allow extname: ${ext}`)
      })

    console.log('Checked all gql file keys')
  }
  private extractKeyFromTs(dirpath: string) {
    const keys = new Set<string>()
    fs.readdirSync(dirpath)
      .filter((file) => path.extname(file) === '.ts')
      .forEach((file) => {
        const text = fs.readFileSync(`${dirpath}/${file}`, {
          encoding: 'utf-8',
        })
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
  private extractKeysFromGql(dirpath: string) {
    const keys = new Set<string>()
    fs.readdirSync(dirpath)
      .filter((file) => path.extname(file) === '.gql')
      .forEach((file) => {
        const query = fs.readFileSync(`${dirpath}/${file}`, {
          encoding: 'utf-8',
        })
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
    const schemaPath = path.resolve(process.cwd(), './prisma/velog-rds/schema.prisma')

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
  private validateTargetPath(target: Record<string, Target>) {
    const validatePath = Object.values(target)
      .map((type) => Object.keys(type).map((key) => (type as any)[key].path))
      .flat()
      .map((path) => fs.existsSync(path))

    if (!validatePath.every) {
      throw new Error(
        'Path not found, maybe wrong velog v2 folders, please check if v2 folder is the same as "velog-v2"',
      )
    }
  }
  private validateKey(keys: string[]) {
    const columnNames = this.readDatabaseColumn()
    keys.map((key) => {
      if (!columnNames.includes(key) && !this.whiteList.includes(key)) {
        console.log(`"${key}", Not found key in columns and resolver query or mutation`)
      }
    })
  }

  private setWhiteList(target: Target) {
    const whiteList = new Set<string>()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.keys(target)
      .map((key) => target[key])
      .map(({ ext, path }) => {
        if (ext === 'gql') {
          const keys = this.extractKeyFromGqlForWhiteList(path)
          for (const key of keys) {
            whiteList.add(key)
          }
        }

        if (ext === 'ts') {
          const keys = this.extractKeyFromTsForWhiteList(path)
          for (const key of keys) {
            whiteList.add(key)
          }
        }
      })
    this.whiteList = this.whiteList.concat(Array.from(whiteList))
  }
  private extractKeyFromGqlForWhiteList(dirpath: string) {
    const keys = new Set<string>()
    fs.readdirSync(dirpath)
      .filter((file) => path.extname(file) === '.gql')
      .forEach((file) => {
        const query = fs.readFileSync(`${dirpath}/${file}`, {
          encoding: 'utf-8',
        })
        // 모든 type 정의 추출 (type Query와 type Mutation 제외)
        const typeDefs = query.match(/type\s+(?!Query|Mutation)(\w+)\s*{[^}]*}/g)
        if (typeDefs) {
          typeDefs.forEach((typeDef) => {
            // 각 type 정의 내부의 블록을 추출
            const blocks = typeDef.match(/{[^{}]+}/g)
            if (blocks) {
              blocks.forEach((block) => {
                // 각 블록 내부의 내용을 줄별로 분리
                block.split(/[\r\n]+/).forEach((line) => {
                  // 콜론 앞의 단어를 필드 이름으로 추출
                  const match = line.match(/^\s*(\w+)/)
                  if (match) {
                    keys.add(match[1])
                  }
                })
              })
            }
          })
        }
      })

    return Array.from(keys)
  }
  private extractKeyFromTsForWhiteList(dirpath: string) {
    const keys = new Set<string>()
    fs.readdirSync(dirpath)
      .filter((file) => path.extname(file) === '.ts')
      .forEach((file) => {
        const query = fs.readFileSync(`${dirpath}/${file}`, {
          encoding: 'utf-8',
        })
        const typeDefs = query.match(/type\s+(?!Query|Mutation)(\w+)\s*{[^}]*}/g)

        if (typeDefs) {
          typeDefs.forEach((typeDef) => {
            // 각 type 정의 내부의 블록을 추출
            const blocks = typeDef.match(/{[^{}]+}/g)
            if (blocks) {
              blocks.forEach((block) => {
                // 각 블록 내부의 내용을 줄별로 분리
                block.split(/[\r\n]+/).forEach((line) => {
                  // 콜론 앞의 단어를 필드 이름으로 추출
                  const match = line.match(/^\s*(\w+)/)
                  if (match) {
                    keys.add(match[1])
                  }
                })
              })
            }
          })
        }
      })

    return Array.from(keys)
  }
}

;(function () {
  const defaultWhiteList = whiteList()
  const runner = new Runner(defaultWhiteList)
  runner.run()
})()

type TargetInfo = {
  ext: 'gql' | 'ts'
  path: string
  exclude?: string[]
}

type Target = Record<string, TargetInfo>

function whiteList() {
  return [
    'isLogged',
    'logout',
    'unregisterToken',
    'acceptIntegration',
    'readAllNotifications',
    'removeAllNotifications',
    'updateNotNoticeNotification',
  ]
}
