import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../src/shared/utils/errors'
import { IRequest } from '../../src/application/controller/interfaces/IController'
import { DeleteUserUseCase } from '../../src/application/usecase/user/delete-user'
import { DeleteUserController } from '../../src/application/controller/user/delete-user-controller'

type DeleteUserUseCaseExecute = (userId: string) => Promise<{
  user: {
    id: string
    name: string
  } | null
}>

describe('DeleteUserController', () => {
  let deleteUserUseCaseMock: jest.Mocked<DeleteUserUseCase>
  let controller: DeleteUserController

  beforeEach(() => {
    deleteUserUseCaseMock = {
      execute: jest.fn<DeleteUserUseCaseExecute>().mockResolvedValue({
        user: {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
        },
      }),
    } as unknown as jest.Mocked<DeleteUserUseCase>

    controller = new DeleteUserController(deleteUserUseCaseMock)
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

  it('should return 400 when userId format is invalid', async () => {
    const request: IRequest = {
      body: {},
      metadata: { id: 'invalid-uuid-format' },
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ errorMessage: 'Formato de ID de usuário inválido' })
  })

  it('should return 200 when user is successfully deleted', async () => {
    const userId = faker.string.uuid()
    const userName = faker.person.fullName()

    deleteUserUseCaseMock.execute.mockResolvedValueOnce({
      user: {
        id: userId,
        name: userName,
      },
    })

    const request: IRequest = {
      body: {},
      metadata: { id: userId },
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ id: userId, name: userName })
    expect(deleteUserUseCaseMock.execute).toHaveBeenCalledWith(userId)
    expect(deleteUserUseCaseMock.execute).toHaveBeenCalledTimes(1)
  })

  it('should return 404 when user is not found', async () => {
    const userId = faker.string.uuid()

    deleteUserUseCaseMock.execute.mockRejectedValueOnce(new UserNotFoundError())

    const request: IRequest = {
      body: {},
      metadata: { id: userId },
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual({ errorMessage: 'Usuário não encontrado' })
  })

  it('should return 500 when an unexpected error occurs', async () => {
    const userId = faker.string.uuid()

    deleteUserUseCaseMock.execute.mockRejectedValueOnce(
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
})
