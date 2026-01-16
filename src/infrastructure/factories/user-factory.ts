import { SignInController } from '../../application/controller/sign-in'
import { SignupController } from '../../application/controller/sign-up'
import { DeleteUserController } from '../../application/controller/user/delete-user-controller'
import { GetUserByIdController } from '../../application/controller/user/get-user-by-id-controller'
import { GetUsersExceptCurrentUserController } from '../../application/controller/user/get-users-except-current-user-controller'
import { UpdateUserController } from '../../application/controller/user/update-user-controller'
import { SignInUseCase } from '../../application/usecase/sign-in'
import { SignupUseCase } from '../../application/usecase/sign-up'
import { DeleteUserUseCase } from '../../application/usecase/user/delete-user'
import { GetUserByIdUseCase } from '../../application/usecase/user/get-user-by-id'
import { GetUsersExceptCurrentUserUseCase } from '../../application/usecase/user/get-users-except-current-user'
import { UpdateUserUseCase } from '../../application/usecase/user/update-user'
import { JwtAdapterImpl } from '../../domain/JwtAdapter'
import { BcryptHashAdapter } from '../adapters/BcryptHashAdapter'
import { SequelizeUsersRepository } from '../repository/sequelize/sequelize-users-repository'

export const makeSignupUserController = () => {
  const usersRepository = new SequelizeUsersRepository()

  const signupUserUseCase = new SignupUseCase(usersRepository)

  const signupUserController = new SignupController(signupUserUseCase)

  return signupUserController
}

export const makeSignInController = () => {
  const usersRepository = new SequelizeUsersRepository()
  const jwtAdapter = new JwtAdapterImpl()

  const signInUseCase = new SignInUseCase(usersRepository, jwtAdapter)

  const signInController = new SignInController(signInUseCase)

  return signInController
}

export const makeGetUserByIdController = () => {
  const usersRepository = new SequelizeUsersRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(usersRepository)
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

  return getUserByIdController
}

export const makeGetUsersExceptCurrentUserController = () => {
  const usersRepository = new SequelizeUsersRepository()
  const getUsersExceptCurrentUserUseCase = new GetUsersExceptCurrentUserUseCase(
    usersRepository
  )
  const getUsersExceptCurrentUserController =
    new GetUsersExceptCurrentUserController(getUsersExceptCurrentUserUseCase)

  return getUsersExceptCurrentUserController
}

export const makeDeleteUserController = () => {
  const usersRepository = new SequelizeUsersRepository()
  const deleteUserUseCase = new DeleteUserUseCase(usersRepository)
  const deleteUserController = new DeleteUserController(deleteUserUseCase)

  return deleteUserController
}

export const makeUpdateUserController = () => {
  const usersRepository = new SequelizeUsersRepository()
  const hashAdapter = new BcryptHashAdapter()
  const updateUserUseCase = new UpdateUserUseCase(usersRepository, hashAdapter)
  const updateUserController = new UpdateUserController(updateUserUseCase)

  return updateUserController
}
