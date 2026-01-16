import { UserNotFoundError } from '../../../shared/utils/errors'
import { IController, IRequest, IResponse } from '../interfaces/IController'
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
  userNotFound,
} from '../helpers/http'
import { DeleteUserUseCase } from '../../usecase/user/delete-user'
import { checkIfIdIsValid } from '../helpers/validations'

export class DeleteUserController implements IController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

  async handle(request: IRequest): Promise<IResponse> {
    try {
      const userId = request.metadata?.id as string

      if (!userId) {
        return unauthorized({ errorMessage: 'Token de acesso inválido' })
      }

      const verifyUserId = checkIfIdIsValid(userId)

      if (!verifyUserId) {
        return badRequest({ errorMessage: 'Formato de ID de usuário inválido' })
      }

      const { user } = await this.deleteUserUseCase.execute(userId)

      return ok(user)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFound({ errorMessage: 'Usuário não encontrado' })
      }

      return serverError()
    }
  }
}
