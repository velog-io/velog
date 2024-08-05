import { faker } from '@faker-js/faker'
import { UtilsService } from '@lib/utils/UtilsService.mjs'
import { container } from 'tsyringe'

const utils = container.resolve(UtilsService)

export const getMockPages = (count: number) =>
  Array(count)
    .fill(0)
    .map((_, index) => {
      if (index === 0) {
        const code = utils.randomString(8)
        return {
          title: 'Introduction',
          index: index,
          type: 'page',
          code,
          url_slug: `/${utils.escapeForUrl('Introduction')}-${code}`,
          parent_id: null,
          body: `# Introduction_${index}
          - ${faker.lorem.paragraph(2)}
          - ${faker.lorem.paragraph(1)}
          - [${faker.lorem.words(2)}](${faker.internet.url()})
              \`\`\`js filename="demo.js" {4} copy
              import { useState } from 'react'
              
              export const Counter = () => {
                const [count, setCount] = useState(0)
                return (
                  <div>
                    <button onClick={() => setCount(count + 1)} className={styles.counter}>
                      Clicked {count} times
                    </button>
                  </div>
                )
              }
              \`\`\`
          ![](${faker.image.url()})
          `.replaceAll('      ', ''),
        }
      }

      if (index === 2) {
        const code = utils.randomString(8)
        return {
          title: 'Getting Started',
          index: index,
          body: '',
          type: 'separator',
          parent_id: null,
          code,
          url_slug: `/${utils.escapeForUrl('Getting Started')}-${code}`,
        }
      }

      if (index === 6) {
        const code = utils.randomString(8)
        return {
          title: 'API Reference',
          index: index,
          body: '',
          type: 'separator',
          parent_id: null,
          code: code,
          url_slug: `/${utils.escapeForUrl('API Reference')}-${code}`,
        }
      }

      const title = faker.lorem.sentence({ min: 1, max: 3 })
      const code = utils.randomString(8)
      return {
        title,
        index: index,
        type: index > 9 ? 'page' : 'folder',
        code: code,
        url_slug: `/${utils.escapeForUrl(title).toLocaleLowerCase()}-${code}`,
        parent_id: null,
        body: `# ${title}_${index}
        - ${faker.lorem.paragraph(2)}
        - ${faker.lorem.paragraph(1)}
        - [${faker.lorem.words(2)}](${faker.internet.url()})
        
        ## ${faker.company.catchPhrase()}
        - ${faker.lorem.paragraph(1)}
        - ${faker.lorem.paragraph(2)}
  
        ## ${faker.company.catchPhrase()}
        - ${faker.lorem.paragraph(3)}
        - ${faker.lorem.paragraph(1)}
  
        ### ${faker.company.catchPhrase()}
        - ${faker.lorem.paragraph(3)}
        - ${faker.lorem.paragraph(1)}
  
        # ${faker.company.catchPhrase()}
        - ${faker.lorem.paragraph(1)}
        - ${faker.lorem.paragraph(2)}
  
        ## ${faker.company.catchPhrase()}
        - ${faker.lorem.paragraph(3)}
        - ${faker.lorem.paragraph(1)}
  
        ### ${faker.company.catchPhrase()}
        - ${faker.lorem.paragraph(3)}
        - ${faker.lorem.paragraph(1)}
        
        ${faker.lorem.paragraphs(2)}

      `.replaceAll('      ', ''),
      }
    })

export const getMockBooks = () => Array(100).fill(0).map(getMockPages)
