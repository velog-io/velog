import { PrismaClient } from '@packages/database/src/velog-rds/index.mjs'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import prisma from './client'

jest.mock('./client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
  mockReset(stubDbService)
})

export type StubDbService = DeepMockProxy<PrismaClient>

export const stubDbService = prisma as unknown as DeepMockProxy<PrismaClient>
