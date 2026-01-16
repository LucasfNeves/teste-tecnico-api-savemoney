import { badRequest, ok, serverError, userNotFound } from '../helpers/http'
import { IController, IRequest, IResponse } from '../interfaces/IController'
import {
  UserNotFoundError,
  ValidationError,
} from '../../../shared/utils/errors'
import { UpdateUserUseCase } from '../../usecase/user/update-user'
import { checkIfIdIsValid } from '../helpers/validations'

export class UpdateUserController implements IController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  async handle({ body, metadata }: IRequest): Promise<IResponse> {
    try {
      const userId = metadata?.id as string

      if (!userId) {
        return userNotFound({ errorMessage: 'Usuário não encontrado' })
      }

      const verifyUserId = checkIfIdIsValid(userId)

      if (!verifyUserId) {
        return badRequest({ errorMessage: 'Formato de ID de usuário inválido' })
      }

      const updatedUser = await this.updateUserUseCase.execute(userId, body)

      return ok(updatedUser)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFound({ errorMessage: error.message })
      }

      if (error instanceof ValidationError) {
        return badRequest({ errorMessage: error.message })
      }

      if (error instanceof Error) {
        return badRequest({ errorMessage: error.message })
      }

      return serverError()
    }
  }
}
