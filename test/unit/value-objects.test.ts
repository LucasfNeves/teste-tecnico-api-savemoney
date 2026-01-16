import { describe, it, expect } from '@jest/globals'
import {
  Email,
  Name,
  Password,
  Telephone,
} from '../../src/domain/value-objects'

describe('Value Objects Validation', () => {
  describe('Email', () => {
    it('should create a valid email', () => {
      const email = Email.create('  test@example.com  ')
      expect(email.getValue()).toBe('test@example.com')
    })

    it('should throw error when email is empty', () => {
      expect(() => Email.create('')).toThrow('E-mail é obrigatório')
      expect(() => Email.create('   ')).toThrow('E-mail é obrigatório')
    })

    it('should throw error when email is invalid', () => {
      expect(() => Email.create('invalid-email')).toThrow(
        'Please provide a valid e-mail'
      )
      expect(() => Email.create('test@')).toThrow(
        'Please provide a valid e-mail'
      )
      expect(() => Email.create('@example.com')).toThrow(
        'Please provide a valid e-mail'
      )
    })
  })

  describe('Name', () => {
    it('should create a valid name', () => {
      const name = Name.create('  John Doe  ')
      expect(name.getValue()).toBe('John Doe')
    })

    it('should throw error when name is empty', () => {
      expect(() => Name.create('')).toThrow('Nome é obrigatório')
      expect(() => Name.create('   ')).toThrow('Nome é obrigatório')
    })

    it('should throw error when name is too short', () => {
      expect(() => Name.create('A')).toThrow(
        'O nome deve ter pelo menos 2 caracteres'
      )
    })
  })

  describe('Password', () => {
    it('should create a valid password', () => {
      const password = Password.create('  secret123  ')
      expect(password.getValue()).toBe('secret123')
    })

    it('should throw error when password is empty', () => {
      expect(() => Password.create('')).toThrow('Senha é obrigatória')
      expect(() => Password.create('   ')).toThrow('Senha é obrigatória')
    })

    it('should throw error when password is too short', () => {
      expect(() => Password.create('12345')).toThrow(
        'A senha deve ter pelo menos 6 caracteres'
      )
    })
  })

  describe('Telephone', () => {
    it('should create a valid telephone with 9 digits', () => {
      const telephone = Telephone.create(987654321, 11)
      expect(telephone.getNumber()).toBe(987654321)
      expect(telephone.getAreaCode()).toBe(11)
      expect(telephone.getValue()).toEqual({
        number: 987654321,
        area_code: 11,
      })
    })

    it('should create a valid telephone with 8 digits', () => {
      const telephone = Telephone.create(12345678, 21)
      expect(telephone.getNumber()).toBe(12345678)
      expect(telephone.getAreaCode()).toBe(21)
    })

    it('should throw error when number is not an integer', () => {
      expect(() => Telephone.create(123.45, 11)).toThrow(
        'Número de telefone deve ser um inteiro positivo'
      )
    })

    it('should throw error when number is not positive', () => {
      expect(() => Telephone.create(-987654321, 11)).toThrow(
        'Número de telefone deve ser um inteiro positivo'
      )
      expect(() => Telephone.create(0, 11)).toThrow(
        'Número de telefone deve ser um inteiro positivo'
      )
    })

    it('should throw error when number has less than 8 digits', () => {
      expect(() => Telephone.create(1234567, 11)).toThrow(
        'Número de telefone deve ter exatamente 8 ou 9 dígitos'
      )
    })

    it('should throw error when number has more than 9 digits', () => {
      expect(() => Telephone.create(9876543210, 11)).toThrow(
        'Número de telefone deve ter exatamente 8 ou 9 dígitos'
      )
    })

    it('should throw error when area code is not an integer', () => {
      expect(() => Telephone.create(987654321, 11.5)).toThrow(
        'Código de área deve ser um inteiro positivo'
      )
    })

    it('should throw error when area code is not positive', () => {
      expect(() => Telephone.create(987654321, -11)).toThrow(
        'Código de área deve ser um inteiro positivo'
      )
      expect(() => Telephone.create(987654321, 0)).toThrow(
        'Código de área deve ser um inteiro positivo'
      )
    })

    it('should throw error when area code does not have exactly 2 digits', () => {
      expect(() => Telephone.create(987654321, 1)).toThrow(
        'Código de área deve ter exatamente 2 dígitos'
      )
      expect(() => Telephone.create(987654321, 111)).toThrow(
        'Código de área deve ter exatamente 2 dígitos'
      )
    })
  })
})
