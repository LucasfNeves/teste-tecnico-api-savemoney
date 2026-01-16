import { Email, Name, Password, Telephone } from '../../../domain/value-objects'
import {
  UsersRepository,
  UserPublicData,
  UserCreationInput,
} from '../../../infrastructure/repository/interfaces'
import {
  UserAlreadyExists,
  UserNotFoundError,
} from '../../../shared/utils/errors'
import { HashAdapter } from '../../../domain/HashAdapter'

interface UpdateUserInput {
  name?: string
  email?: string
  password?: string
  telephones?: Array<{ number: number; area_code: number }>
}

export class UpdateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashAdapter: HashAdapter
  ) {}

  async execute(
    userId: string,
    data: UpdateUserInput
  ): Promise<UserPublicData> {
    this.validateHasFieldsToUpdate(data)
    await this.validateUserExists(userId)

    const updateData = await this.buildUpdateData(userId, data)

    const updatedUser = await this.usersRepository.update(userId, updateData)

    if (!updatedUser) {
      throw new Error('Falha ao atualizar usuário')
    }

    return updatedUser
  }

  private validateHasFieldsToUpdate(data: UpdateUserInput): void {
    const hasFields = Object.keys(data).some(
      (key) => key !== 'id' && data[key as keyof UpdateUserInput] !== undefined
    )

    if (!hasFields) {
      throw new Error('Nenhum campo válido para atualização foi fornecido.')
    }
  }

  private async validateUserExists(userId: string): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError('Usuário não encontrado')
    }
  }

  private async buildUpdateData(
    userId: string,
    data: UpdateUserInput
  ): Promise<Partial<UserCreationInput>> {
    const updateData: Partial<UserCreationInput> = {}

    if (data.name) {
      updateData.name = Name.create(data.name).getValue()
    }

    if (data.email) {
      updateData.email = await this.validateAndGetEmail(userId, data.email)
    }

    if (data.password) {
      updateData.password = await this.hashPassword(data.password)
    }

    if (data.telephones) {
      updateData.telephones = Telephone.createMany(data.telephones).map((t) =>
        t.getValue()
      )
    }

    return updateData
  }

  private async validateAndGetEmail(
    userId: string,
    email: string
  ): Promise<string> {
    const emailVO = Email.create(email)
    const userWithSameEmail = await this.usersRepository.findByEmail(
      emailVO.getValue()
    )

    if (userWithSameEmail && userWithSameEmail.id !== userId) {
      throw new UserAlreadyExists()
    }

    return emailVO.getValue()
  }

  private async hashPassword(password: string): Promise<string> {
    const passwordVO = Password.create(password)
    return this.hashAdapter.hash(passwordVO.getValue())
  }
}
