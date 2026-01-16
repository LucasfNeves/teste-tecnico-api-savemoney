import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../src/shared/utils/errors'
import { IRequest } from '../../src/application/controller/interfaces/IController'
import {
  GetUsersExceptCurrentUserUseCase,
  GetUsersExceptCurrentUserUseCaseResponse,
} from '../../src/application/usecase/user/get-users-except-current-user'
import { GetUsersExceptCurrentUserController } from '../../src/application/controller/user/get-users-except-current-user-controller'

type GetUsersExceptCurrentUserUseCaseExecute = (
  currentUserId: string
) => Promise<GetUsersExceptCurrentUserUseCaseResponse[]>

describe('GetUsersExceptCurrentUserController', () => {
  let getUsersExceptCurrentUserUseCaseMock: jest.Mocked<GetUsersExceptCurrentUserUseCase>
  let controller: GetUsersExceptCurrentUserController

  const makeUserData = (
    overrides: { id?: string } = {}
  ): GetUsersExceptCurrentUserUseCaseResponse => {
    return {
      id: overrides.id ?? faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString(),
    }
  }

  beforeEach(() => {
    getUsersExceptCurrentUserUseCaseMock = {
      execute: jest
        .fn<GetUsersExceptCurrentUserUseCaseExecute>()
        .mockResolvedValue([makeUserData(), makeUserData()]),
    } as unknown as jest.Mocked<GetUsersExceptCurrentUserUseCase>

    controller = new GetUsersExceptCurrentUserController(
      getUsersExceptCurrentUserUseCaseMock
    )
  })

  it('should return 401 when userId is not provided in metadata', async () => {
    const request: IRequest = {
      body: {},
      metadata: {},
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({ errorMessage: 'Token de acesso inválido' })
  })

  it('should return 200 with user data when users exist', async () => {
    const userId = 'valid-user-id'
    const userData = makeUserData({ id: userId })

    getUsersExceptCurrentUserUseCaseMock.execute.mockResolvedValueOnce([
      userData,
    ])

    const request: IRequest = {
      body: {},
      metadata: { id: userId },
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([userData])
    expect(getUsersExceptCurrentUserUseCaseMock.execute).toHaveBeenCalledWith(
      userId
    )
    expect(getUsersExceptCurrentUserUseCaseMock.execute).toHaveBeenCalledTimes(
      1
    )
  })

  it('should return 401 when user is not found', async () => {
    const userId = 'non-existent-id'

    getUsersExceptCurrentUserUseCaseMock.execute.mockRejectedValueOnce(
      new UserNotFoundError()
    )

    const request: IRequest = {
      body: {},
      metadata: { id: userId },
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({ errorMessage: 'Usuário não encontrado' })
  })

  it('should return 500 when an unexpected error occurs', async () => {
    const userId = 'valid-user-id'

    getUsersExceptCurrentUserUseCaseMock.execute.mockRejectedValueOnce(
      new Error('Database error')
    )

    const request: IRequest = {
      body: {},
      metadata: { id: userId },
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual({ errorMessage: 'Erro interno do servidor' })
  })

  it('should call use case with correct userId from metadata', async () => {
    const userId = 'test-user-id'
    const userData = makeUserData({ id: userId })

    getUsersExceptCurrentUserUseCaseMock.execute.mockResolvedValueOnce([
      userData,
    ])

    const request: IRequest = {
      body: {},
      metadata: { id: userId },
    }

    await controller.handle(request)

    expect(getUsersExceptCurrentUserUseCaseMock.execute).toHaveBeenCalledWith(
      userId
    )
    expect(getUsersExceptCurrentUserUseCaseMock.execute).toHaveBeenCalledTimes(
      1
    )
  })
})
