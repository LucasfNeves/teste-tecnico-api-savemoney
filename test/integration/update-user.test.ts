import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { describe, it, expect, beforeEach } from '@jest/globals'
import { BCRYPT_SALT_ROUNDS } from '../../src/config/constant'
import { InMemoryUsersRepository } from '../../src/infrastructure/repository/inMemory/in-memory-users-repository'
import { UpdateUserUseCase } from '../../src/application/usecase/user/update-user'
import { UserNotFoundError, UserAlreadyExists } from '../../src/shared/utils/errors'
import { BcryptHashAdapter } from '../../src/infrastructure/adapters/BcryptHashAdapter'

describe('UpdateUserUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let hashAdapter: BcryptHashAdapter
  let updateUserUseCase: UpdateUserUseCase

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

    return { id: user.id, email, name }
  }

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    hashAdapter = new BcryptHashAdapter()
    updateUserUseCase = new UpdateUserUseCase(usersRepository, hashAdapter)
  })

  it.each([
    { field: 'name' as const, value: () => faker.person.fullName() },
    { field: 'email' as const, value: () => faker.internet.email() },
    { field: 'telephones' as const, value: () => [{ number: 123456789, area_code: 21 }] },
  ])('should update user $field successfully', async ({ field, value }) => {
    const user = await createUser()
    const newValue = value()

    const updatedUser = await updateUserUseCase.execute(user.id, {
      [field]: newValue,
    })

    expect(updatedUser).toBeDefined()
    expect(updatedUser.id).toBe(user.id)
    expect(updatedUser[field]).toEqual(newValue)
  })

  it('should update password successfully', async () => {
    const user = await createUser()
    const newPassword = faker.internet.password({ length: 10 })

    const updatedUser = await updateUserUseCase.execute(user.id, {
      password: newPassword,
    })

    expect(updatedUser).toBeDefined()
    expect(updatedUser.id).toBe(user.id)
  })

  it('should update multiple fields at once', async () => {
    const user = await createUser()
    const newName = faker.person.fullName()
    const newEmail = faker.internet.email()
    const newTelephones = [{ number: 111222333, area_code: 31 }]

    const updatedUser = await updateUserUseCase.execute(user.id, {
      name: newName,
      email: newEmail,
      telephones: newTelephones,
    })

    expect(updatedUser.name).toBe(newName)
    expect(updatedUser.email).toBe(newEmail)
    expect(updatedUser.telephones).toEqual(newTelephones)
  })

  it('should keep unchanged fields when updating', async () => {
    const user = await createUser()
    const newName = faker.person.fullName()

    const updatedUser = await updateUserUseCase.execute(user.id, {
      name: newName,
    })

    expect(updatedUser.name).toBe(newName)
    expect(updatedUser.email).toBe(user.email)
  })

  it('should throw UserNotFoundError when user does not exist', async () => {
    const nonExistentId = faker.string.uuid()

    await expect(
      updateUserUseCase.execute(nonExistentId, { name: 'New Name' })
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should throw UserAlreadyExists when email is already in use by another user', async () => {
    const user1 = await createUser()
    const user2 = await createUser()

    await expect(
      updateUserUseCase.execute(user1.id, { email: user2.email })
    ).rejects.toBeInstanceOf(UserAlreadyExists)
  })

  it('should allow updating to same email', async () => {
    const user = await createUser()

    const updatedUser = await updateUserUseCase.execute(user.id, {
      email: user.email,
    })

    expect(updatedUser.email).toBe(user.email)
  })

  it('should throw error when no valid fields are provided', async () => {
    const user = await createUser()

    await expect(
      updateUserUseCase.execute(user.id, {})
    ).rejects.toThrow('Nenhum campo válido para atualização foi fornecido.')
  })

  it('should throw error when only id field is provided', async () => {
    const user = await createUser()

    await expect(
      updateUserUseCase.execute(user.id, { id: 'e9' } as any)
    ).rejects.toThrow('Nenhum campo válido para atualização foi fornecido.')
  })
})
