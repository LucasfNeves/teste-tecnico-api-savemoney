import { ValidationError } from '../../shared/utils/errors'

export class Telephone {
  private constructor(
    private readonly number: number,
    private readonly areaCode: number
  ) {}

  static create(number: number | string, areaCode: number | string): Telephone {
    const parsedNumber = this.parseNumber(number)
    const parsedAreaCode = this.parseNumber(areaCode)

    this.validate(parsedNumber, parsedAreaCode)
    return new Telephone(parsedNumber, parsedAreaCode)
  }

  static createMany(
    telephones: Array<{ number: number | string; area_code: number | string }>
  ): Telephone[] {
    if (!telephones || !Array.isArray(telephones) || telephones.length === 0) {
      throw new ValidationError('Pelo menos um telefone é obrigatório')
    }

    return telephones.map((tel) => this.create(tel.number, tel.area_code))
  }

  private static parseNumber(value: number | string): number {
    if (typeof value === 'number') {
      return value
    }

    if (typeof value === 'string') {
      const parsed = parseInt(value, 10)
      if (isNaN(parsed)) {
        throw new ValidationError('Número de telefone deve conter apenas dígitos')
      }
      return parsed
    }

    throw new ValidationError('Número de telefone deve ser um número ou string')
  }

  private static validate(number: number, areaCode: number): void {
    if (number === undefined || number === null || isNaN(number)) {
      throw new ValidationError('Número de telefone é obrigatório')
    }

    if (areaCode === undefined || areaCode === null || isNaN(areaCode)) {
      throw new ValidationError('Código de área é obrigatório')
    }

    if (!Number.isInteger(number) || number <= 0) {
      throw new ValidationError('Número de telefone deve ser um inteiro positivo')
    }

    if (!Number.isInteger(areaCode) || areaCode <= 0) {
      throw new ValidationError('Código de área deve ser um inteiro positivo')
    }

    const numberStr = number.toString()
    if (numberStr.length !== 8 && numberStr.length !== 9) {
      throw new ValidationError('Número de telefone deve ter exatamente 8 ou 9 dígitos')
    }

    const areaCodeStr = areaCode.toString()
    if (areaCodeStr.length !== 2) {
      throw new ValidationError('Código de área deve ter exatamente 2 dígitos')
    }
  }

  getNumber(): number {
    return this.number
  }

  getAreaCode(): number {
    return this.areaCode
  }

  getValue(): { number: number; area_code: number } {
    return {
      number: this.number,
      area_code: this.areaCode,
    }
  }
}
