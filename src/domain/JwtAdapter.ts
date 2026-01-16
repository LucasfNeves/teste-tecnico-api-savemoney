import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export interface JwtAdapter {
  sign(payload: object, expiresIn: string): string
}

export class JwtAdapterImpl implements JwtAdapter {
  sign(payload: object, expiresIn: string): string {
    if (!env.jwtSecret) {
      throw new Error('Segredo JWT não está definido')
    }
    return jwt.sign(
      payload,
      env.jwtSecret as string,
      { expiresIn } as jwt.SignOptions
    )
  }
}
