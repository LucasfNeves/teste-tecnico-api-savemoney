import { ValidationError } from '../../shared/utils/errors'

export class Name {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(name: string): Name {
    if (!name) {
      throw new ValidationError('Nome é obrigatório')
    }

    const trimmedName = name.trim()

    if (!trimmedName) {
      throw new ValidationError('Nome é obrigatório')
    }

    if (trimmedName.length < 2) {
      throw new ValidationError('O nome deve ter pelo menos 2 caracteres')
    }

    return new Name(trimmedName)
  }

  getValue(): string {
    return this.value
  }

  toString(): string {
    return this.value
  }
}
