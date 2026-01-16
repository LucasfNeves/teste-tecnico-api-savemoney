export class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    super(`O e-mail ${email} fornecido já está em uso`)
    this.name = 'EmailAlreadyInUseError'
  }
}
