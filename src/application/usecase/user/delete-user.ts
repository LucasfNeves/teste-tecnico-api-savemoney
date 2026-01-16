import { UsersRepository } from '../../../infrastructure/repository/interfaces'
import { UserNotFoundError } from '../../../shared/utils/errors'

interface DeleteUserResponse {
  user: {
    id: string
    name: string
  } | null
}

export class DeleteUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<DeleteUserResponse> {
    const currentUser = await this.usersRepository.findById(userId)

    if (!currentUser) {
      throw new UserNotFoundError(`Usuário com ID ${userId} não encontrado`)
    }

    const user = await this.usersRepository.delete(userId)
    return { user }
  }
}
