import bcrypt from 'bcrypt'
import { BCRYPT_SALT_ROUNDS } from '../../config/constant'
import { HashAdapter } from '../../domain/HashAdapter'

export class BcryptHashAdapter implements HashAdapter {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, BCRYPT_SALT_ROUNDS)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash)
  }
}
