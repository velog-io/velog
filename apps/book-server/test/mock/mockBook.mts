import { faker } from '@faker-js/faker'
import { UtilsService } from '@lib/utils/UtilsService.mjs'
import { container } from 'tsyringe'

const utils = container.resolve(UtilsService)

export const getMockPages = (count: number) =>
  Array(count)
    .fill(0)
    .map((_, index) => {
      if (index === 0) {
        return {
          title: 'Introduction',
          index: index,
          type: 'page',
          code: utils.randomString(8),
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
        return {
          title: 'Getting Started',
          index: index,
          body: '',
          type: 'separator',
          code: utils.randomString(8),
        }
      }

      if (index === 6) {
        return {
          title: 'API Reference',
          index: index,
          body: '',
          type: 'separator',
          code: utils.randomString(8),
        }
      }
      const title = faker.company.catchPhrase()
      return {
        title,
        index: index,
        type: 'page',
        code: utils.randomString(8),
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
