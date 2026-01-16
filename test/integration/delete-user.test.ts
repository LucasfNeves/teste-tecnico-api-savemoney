import { faker } from '@faker-js/faker'
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { InMemoryUsersRepository } from '../../src/infrastructure/repository/inMemory/in-memory-users-repository'
import { UserNotFoundError } from '../../src/shared/utils/errors'
import { BCRYPT_SALT_ROUNDS } from '../../src/config/constant'
import bcrypt from 'bcrypt'
import { DeleteUserUseCase } from '../../src/application/usecase/user/delete-user'

describe('DeleteUserUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let deleteUserUseCase: DeleteUserUseCase

  const createUser = async () => {
    const email = faker.internet.email()
    const name = faker.person.fullName()
    const password = faker.internet.password({ length: 10 })
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

    const user = await usersRepository.create({
      name,
      email,
      password: hashedPassword,
      telephones: [{ number: 987654321, area_code: 11 }],
    })

    return { id: user.id, name }
  }

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    deleteUserUseCase = new DeleteUserUseCase(usersRepository)
  })
  it('should delete user by id successfully', async () => {
    const { id, name } = await createUser()

    const result = await deleteUserUseCase.execute(id)

    expect(result.user).toEqual(
      expect.objectContaining({
        id,
        name,
      })
    )
  })

  it('should throw UserNotFoundError when user does not exist', async () => {
    const nonExistentId = 'non-existent-id'

    await expect(
      deleteUserUseCase.execute(nonExistentId)
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should throw error when repository fails', async () => {
    const { id } = await createUser()
    jest
      .spyOn(usersRepository, 'findById')
      .mockRejectedValueOnce(new Error('Database connection failed'))

    await expect(deleteUserUseCase.execute(id)).rejects.toThrow(
      'Database connection failed'
    )
  })
})
