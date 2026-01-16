import User from '../../database/models/User'
import {
  UsersRepository,
  UserCreationInput,
  UserPublicData,
} from '../interfaces'
import { TelephoneType } from '../../../shared/utils/types'

type UserJsonData = {
  id: string
  name: string
  email: string
  telephones: TelephoneType[]
  created_at: string
  updated_at: string
}

export class SequelizeUsersRepository implements UsersRepository {
  async findAllUsers(): Promise<Array<Omit<UserPublicData, 'telephones'>>> {
    const users = await User.findAll()

    return users.map((user) => {
      const { id, name, email, created_at, updated_at } =
        user.toJSON() as unknown as UserJsonData

      return {
        id,
        name,
        email,
        createdAt: created_at,
        updatedAt: updated_at,
      }
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({
      where: { email },
    })
    return user
  }

  async create(data: UserCreationInput): Promise<User> {
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      telephones: data.telephones || [],
    })
    return user
  }

  async findById(userId: string): Promise<UserPublicData | null> {
    const user = await User.findByPk(userId)

    if (!user) {
      return null
    }

    const { id, name, email, telephones, created_at, updated_at } =
      user.toJSON() as unknown as UserJsonData

    return {
      id,
      name,
      email,
      telephones,
      createdAt: created_at,
      updatedAt: updated_at,
    }
  }

  async delete(userId: string): Promise<{ id: string; name: string } | null> {
    const user = await User.findByPk(userId)

    if (!user) {
      return null
    }

    const { id, name } = user.toJSON() as unknown as UserJsonData

    await user.destroy()

    return { id, name }
  }

  async update(
    userId: string,
    data: Partial<UserCreationInput>
  ): Promise<UserPublicData> {
    const [affectedCount, affectedRows] = await User.update(data, {
      where: { id: userId },
      returning: true,
      individualHooks: true,
    })

    if (affectedCount === 0 || !affectedRows || affectedRows.length === 0) {
      throw new Error('Usuário não encontrado ou não foi atualizado')
    }

    const updatedUser = affectedRows[0]
    const { id, name, email, telephones, created_at, updated_at } =
      updatedUser.toJSON() as unknown as UserJsonData

    return {
      id,
      name,
      email,
      telephones,
      createdAt: created_at,
      updatedAt: updated_at,
    }
  }
}
