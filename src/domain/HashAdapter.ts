export interface HashAdapter {
  hash(value: string): Promise<string>
  compare(value: string, hash: string): Promise<boolean>
}
