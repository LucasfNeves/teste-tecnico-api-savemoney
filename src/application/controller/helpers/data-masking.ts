import { TelephoneType } from '../../../shared/utils/types'

export interface IDataMaskingService {
  maskName(name: string): string
  maskEmail(email: string): string
  maskTelephone(telephone: TelephoneType): string
}

export class DataMaskingService implements IDataMaskingService {
  maskName(name: string): string {
    const parts = name.trim().split(/\s+/)

    if (parts.length === 0) return ''

    const firstName = parts[0]

    const maskedRest = parts
      .slice(1)
      .map((part) => part.charAt(0).toUpperCase() + '.')
      .join(' ')

    return `${firstName} ${maskedRest}`.trim()
  }

  maskEmail(email: string): string {
    const [user, domain] = email.split('@')

    if (!user || !domain) return email

    const [domainName, extension] = domain.split('.')

    const maskedUser =
      user.length > 2
        ? user.substring(0, 2) + '***'
        : user.substring(0, 1) + '***'

    const maskedDomain =
      domainName.length > 2
        ? domainName.substring(0, 2) + '***'
        : domainName.substring(0, 1) + '***'

    return `${maskedUser}@${maskedDomain}.${extension}`
  }

  maskTelephone(telephone: TelephoneType): string {
    const numberStr = telephone.number.toString()
    const lastFour = numberStr.slice(-4)
    const maskedPart = '*'.repeat(numberStr.length - 4)

    return `(${telephone.area_code}) ${
      maskedPart.slice(0, -4) || '*****'
    }-${lastFour}`
  }
}
