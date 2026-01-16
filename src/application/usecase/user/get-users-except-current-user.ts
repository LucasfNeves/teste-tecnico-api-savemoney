import { UsersRepository } from '../../../infrastructure/repository/interfaces'
import { UserNotFoundError } from '../../../shared/utils/errors'

export interface GetUsersExceptCurrentUserUseCaseResponse {
  id: string
  name: string
  email: string
  created_at: string | undefined
  updated_at: string | undefined
}

export class GetUsersExceptCurrentUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(
    currentUserId: string
  ): Promise<GetUsersExceptCurrentUserUseCaseResponse[]> {
    const currentUser = await this.usersRepository.findById(currentUserId)

    if (!currentUser) {
      throw new UserNotFoundError(`Usuário com ID ${currentUserId} não encontrado`)
    }
    const users = await this.usersRepository.findAllUsers()

    const filteredUsers = users.filter((user) => user.id !== currentUserId)

    return filteredUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    }))
  }
}
