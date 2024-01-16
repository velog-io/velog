import { faker } from '@faker-js/faker'

export type MockUserWithProfileType = (typeof mockUserWithProfile)[0]
export const mockUserWithProfile = [
  {
    username: 'velopert',
    email: 'velopert@chafgames.com',
    is_certified: true,
    profile: {
      display_name: 'velopert',
      short_bio: 'CEO @ Chaf Inc. 사용자들이 좋아하는 프로덕트를 만듭니다.',
      thumbnail:
        'https://velog.velcdn.com/images/velopert/profile/ccab49cd-098c-4bb4-87dd-38044a403b61/17202261.png',
    },
  },
  {
    username: 'carrick',
    email: 'carrick@chafgames.com',
    is_certified: true,
    profile: {
      display_name: 'carrick',
      short_bio: 'TypeScript developer',
      thumbnail: null,
    },
  },
  {
    username: 'riverKey',
    email: 'river.key93@gmail.com',
    is_certified: true,
    profile: {
      display_name: 'key',
      short_bio: 'Frontend Developer',
      thumbnail: null,
    },
  },
]

export const getMockUserWithProfile = (count = 100) => {
  for (let i = 0; i < count; i++) {
    mockUserWithProfile.push({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      is_certified: faker.datatype.boolean(),
      profile: {
        display_name: faker.internet.displayName(),
        short_bio: faker.lorem.sentence({ min: 0, max: 100 }),
        thumbnail: faker.image.avatar(),
      },
    })
  }

  return mockUserWithProfile
}
