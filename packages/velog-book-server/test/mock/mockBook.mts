import { faker } from '@faker-js/faker'

export const getMockPages = (count: number) =>
  Array(count)
    .fill(0)
    .map(() => ({
      title: faker.lorem.text(),
      body: faker.lorem.sentences({ min: 10, max: 1000 }),
    }))

export const getMockBooks = () => Array(100).fill(0).map(getMockPages)
