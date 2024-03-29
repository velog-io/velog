import { PrismaClient } from '@prisma/velog-rds/client'
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
