import { UserNotFoundError } from '../../../shared/utils/errors'
import { IController, IRequest, IResponse } from '../interfaces/IController'
import { ok, serverError, unauthorized } from '../helpers/http'
import { GetUsersExceptCurrentUserUseCase } from '../../usecase/user/get-users-except-current-user'

export class GetUsersExceptCurrentUserController implements IController {
  constructor(
    private readonly getUsersExceptCurrentUserUseCase: GetUsersExceptCurrentUserUseCase
  ) {}

  async handle(request: IRequest): Promise<IResponse> {
    try {
      const userId = request.metadata?.id as string

      if (!userId) {
        return unauthorized({ errorMessage: 'Token de acesso inválido' })
      }

      const users = await this.getUsersExceptCurrentUserUseCase.execute(userId)

      return ok(users)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return unauthorized({ errorMessage: 'Usuário não encontrado' })
      }

      return serverError()
    }
  }
}
