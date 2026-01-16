import validator from 'validator'
import { badRequest } from './http'

export const checkIfIdIsValid = (userId: string) => validator.isUUID(userId)

export const generateInvalidIdResponse = () => {
  return badRequest({
    message: 'O id fornecido não é válido',
  })
}
