import { faker } from '@faker-js/faker'
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { InMemoryUsersRepository } from '../../src/infrastructure/repository/inMemory/in-memory-users-repository'
import { UserNotFoundError } from '../../src/shared/utils/errors'
import { BCRYPT_SALT_ROUNDS } from '../../src/config/constant'
import { GetUsersExceptCurrentUserUseCase } from '../../src/application/usecase/user/get-users-except-current-user'
import bcrypt from 'bcrypt'

describe('GetUsersExceptCurrentUserUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let getUsersExceptCurrentUserUseCase: GetUsersExceptCurrentUserUseCase

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

    return { id: user.id, email }
  }

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    getUsersExceptCurrentUserUseCase = new GetUsersExceptCurrentUserUseCase(
      usersRepository
    )
  })
  it('should get users successfully except current user', async () => {
    const currentUser = await createUser()
    const otherUser1 = await createUser()
    const otherUser2 = await createUser()

    const result = await getUsersExceptCurrentUserUseCase.execute(
      currentUser.id
    )

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: otherUser1.id }),
        expect.objectContaining({ id: otherUser2.id }),
      ])
    )
  })

  it('should return empty array if current user is the only user', async () => {
    const currentUser = await createUser()
    const result = await getUsersExceptCurrentUserUseCase.execute(
      currentUser.id
    )

    expect(result).toEqual([])
  })

  it('should throw UserNotFoundError if current user does not exist', async () => {
    await expect(
      getUsersExceptCurrentUserUseCase.execute('non-existing-id')
    ).rejects.toThrow(UserNotFoundError)
  })
  it('should return only id, name, email, created_at and updated_at', async () => {
    const currentUser = await createUser()
    await createUser()

    const result = await getUsersExceptCurrentUserUseCase.execute(
      currentUser.id
    )

    const user = result[0]
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('name')
    expect(user).toHaveProperty('email')
    expect(user).toHaveProperty('created_at')
    expect(user).toHaveProperty('updated_at')
    expect(user).not.toHaveProperty('telephones')
    expect(user).not.toHaveProperty('password')
  })
})
