import { randomUUID } from 'crypto'
import User from '../../database/models/User'
import {
  UsersRepository,
  UserCreationInput,
  UserPublicData,
} from '../interfaces'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findAllUsers(): Promise<Omit<UserPublicData, 'telephones'>[]> {
    return this.items.map((user) => {
      const userJson = user.toJSON() as unknown as {
        created_at: string
        updated_at: string
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: userJson.created_at,
        updatedAt: userJson.updated_at,
      }
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email)
    return user || null
  }

  async create(data: UserCreationInput): Promise<User> {
    const now = new Date()
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      telephones: data.telephones || [],
      createdAt: now,
      updatedAt: now,
      toJSON: () => ({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        telephones: user.telephones,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      }),
    } as User

    this.items.push(user)
    return user
  }

  async findById(userId: string): Promise<UserPublicData | null> {
    const user = this.items.find((user) => user.id === userId)

    if (!user) {
      return null
    }

    const userJson = user.toJSON() as unknown as {
      created_at: string
      updated_at: string
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      telephones: user.telephones,
      createdAt: userJson.created_at,
      updatedAt: userJson.updated_at,
    }
  }

  async delete(userId: string): Promise<{ id: string; name: string } | null> {
    const userIndex = this.items.findIndex((user) => user.id === userId)

    if (userIndex === -1) {
      return null
    }

    const [deletedUser] = this.items.splice(userIndex, 1)

    return {
      id: deletedUser.id,
      name: deletedUser.name,
    }
  }

  async update(
    userId: string,
    data: Partial<UserCreationInput>
  ): Promise<UserPublicData | null> {
    const userIndex = this.items.findIndex((user) => user.id === userId)

    if (userIndex === -1) {
      return null
    }

    const user = this.items[userIndex]
    const now = new Date()

    this.items[userIndex] = {
      ...user,
      name: data.name ?? user.name,
      email: data.email ?? user.email,
      password: data.password ?? user.password,
      telephones: data.telephones ?? user.telephones,
      updatedAt: now,
      toJSON: () => ({
        id: user.id,
        name: data.name ?? user.name,
        email: data.email ?? user.email,
        password: data.password ?? user.password,
        telephones: data.telephones ?? user.telephones,
        created_at: user.toJSON().createdAt,
        updated_at: now.toISOString(),
      }),
    } as User

    return this.findById(userId)
  }
}
