export class UserAlreadyExists extends Error {
  constructor() {
    super('Usuário já existe')
    this.name = 'UserAlreadyExists'
  }
}
