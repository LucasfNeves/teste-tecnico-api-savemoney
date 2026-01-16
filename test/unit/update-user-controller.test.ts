import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { faker } from '@faker-js/faker'
import { UserNotFoundError, ValidationError } from '../../src/shared/utils/errors'
import { IRequest } from '../../src/application/controller/interfaces/IController'
import { UpdateUserUseCase } from '../../src/application/usecase/user/update-user'
import { UpdateUserController } from '../../src/application/controller/user/update-user-controller'

type UpdateUserUseCaseExecute = (
  userId: string,
  data: unknown
) => Promise<{
  id: string
  name: string
  email: string
}>

describe('UpdateUserController', () => {
  let updateUserUseCaseMock: jest.Mocked<UpdateUserUseCase>
  let controller: UpdateUserController

  beforeEach(() => {
    updateUserUseCaseMock = {
      execute: jest.fn<UpdateUserUseCaseExecute>().mockResolvedValue({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
      }),
    } as unknown as jest.Mocked<UpdateUserUseCase>

    controller = new UpdateUserController(updateUserUseCaseMock)
  })

  it('should return 404 when userId is not provided in metadata', async () => {
    const request: IRequest = {
      body: { name: 'New Name' },
      metadata: {},
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual({ errorMessage: 'Usuário não encontrado' })
  })

  it('should return 400 when userId format is invalid', async () => {
    const request: IRequest = {
      body: { name: 'New Name' },
      metadata: { id: 'invalid-uuid-format' },
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      errorMessage: 'Formato de ID de usuário inválido',
    })
  })

  it('should return 400 when no valid fields are provided', async () => {
    const userId = faker.string.uuid()

    updateUserUseCaseMock.execute.mockRejectedValueOnce(
      new Error('Nenhum campo válido para atualização foi fornecido.')
    )

    const request: IRequest = {
      body: { id: 'e9' },
      metadata: { id: userId },
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      errorMessage: 'Nenhum campo válido para atualização foi fornecido.',
    })
  })

  it('should return 400 when body is empty', async () => {
    const userId = faker.string.uuid()

    updateUserUseCaseMock.execute.mockRejectedValueOnce(
      new Error('Nenhum campo válido para atualização foi fornecido.')
    )

    const request: IRequest = {
      body: {},
      metadata: { id: userId },
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      errorMessage: 'Nenhum campo válido para atualização foi fornecido.',
    })
  })

  it('should return 200 when user is successfully updated', async () => {
    const userId = faker.string.uuid()
    const updatedData = {
      id: userId,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      telephones: [{ number: 987654321, area_code: 11 }],
    }

    updateUserUseCaseMock.execute.mockResolvedValueOnce(updatedData)

    const request: IRequest = {
      body: { name: updatedData.name },
      metadata: { id: userId },
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(updatedData)
    expect(updateUserUseCaseMock.execute).toHaveBeenCalledWith(userId, {
      name: updatedData.name,
    })
    expect(updateUserUseCaseMock.execute).toHaveBeenCalledTimes(1)
  })

  it('should return 404 when user is not found', async () => {
    const userId = faker.string.uuid()

    updateUserUseCaseMock.execute.mockRejectedValueOnce(
      new UserNotFoundError('Usuário não encontrado')
    )

    const request: IRequest = {
      body: { name: 'New Name' },
      metadata: { id: userId },
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual({ errorMessage: 'Usuário não encontrado' })
  })

  it('should return 400 when ValidationError occurs', async () => {
    const userId = faker.string.uuid()

    updateUserUseCaseMock.execute.mockRejectedValueOnce(
      new ValidationError('Email inválido')
    )

    const request: IRequest = {
      body: { email: 'invalid-email' },
      metadata: { id: userId },
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ errorMessage: 'Email inválido' })
  })

  it('should return 400 when an unexpected error occurs', async () => {
    const userId = faker.string.uuid()

    updateUserUseCaseMock.execute.mockRejectedValueOnce(
      new Error('Database error')
    )

    const request: IRequest = {
      body: { name: 'New Name' },
      metadata: { id: userId },
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ errorMessage: 'Database error' })
  })
})
