import { Router } from 'express'
import { routeAdapter } from '../infrastructure/http/adapters/route-adapter'
import { middlewareAdapter } from '../infrastructure/http/adapters/middleware-adapter'
import {
  makeSignupUserController,
  makeSignInController,
  makeGetUserByIdController,
  makeGetUsersExceptCurrentUserController,
  makeDeleteUserController,
  makeUpdateUserController,
} from '../infrastructure/factories'
import { makeAuthenticationMiddleware } from '../infrastructure/factories/middleware-factory'

export const router = Router()

router.post('/auth/sign-up', routeAdapter(makeSignupUserController()))
router.post('/auth/sign-in', routeAdapter(makeSignInController()))
router.get(
  '/user',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeGetUserByIdController())
)

router.get(
  '/users/exclude-current',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeGetUsersExceptCurrentUserController())
)

router.delete(
  '/user',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeDeleteUserController())
)

router.patch(
  '/user',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeUpdateUserController())
)
