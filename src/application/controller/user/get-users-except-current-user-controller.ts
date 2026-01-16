import { UserNotFoundError } from '../../../shared/utils/errors'
import { IController, IRequest, IResponse } from '../interfaces/IController'
import { ok, serverError, unauthorized } from '../helpers/http'
import { GetUsersExceptCurrentUserUseCase } from '../../usecase/user/get-users-except-current-user'
import { DataMaskingService } from '../helpers/data-masking'

export class GetUsersExceptCurrentUserController implements IController {
  constructor(
    private readonly getUsersExceptCurrentUserUseCase: GetUsersExceptCurrentUserUseCase,
    private readonly dataMaskingService: DataMaskingService
  ) {}

  async handle(request: IRequest): Promise<IResponse> {
    try {
      const userId = request.metadata?.id as string

      if (!userId) {
        return unauthorized({ errorMessage: 'Token de acesso inválido' })
      }

      const users = await this.getUsersExceptCurrentUserUseCase.execute(userId)

      const maskedUsers = users.map((user) => ({
        id: user.id,
        name: this.dataMaskingService.maskName(user.name),
        email: this.dataMaskingService.maskEmail(user.email),
      }))

      return ok(maskedUsers)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return unauthorized({ errorMessage: 'Usuário não encontrado' })
      }

      return serverError()
    }
  }
}
