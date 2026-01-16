import { ValidationError } from '../../shared/utils/errors'

export class Password {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(password: string): Password {
    if (!password) {
      throw new ValidationError('Senha é obrigatória')
    }

    const trimmedPassword = password.trim()

    if (!trimmedPassword) {
      throw new ValidationError('Senha é obrigatória')
    }

    if (trimmedPassword.length < 6) {
      throw new ValidationError('A senha deve ter pelo menos 6 caracteres')
    }

    return new Password(trimmedPassword)
  }

  getValue(): string {
    return this.value
  }

  toString(): string {
    return this.value
  }
}
