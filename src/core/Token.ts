import { TokenType } from './TokenType'

export type LiteralValue = string | number | null

export class Token {
  constructor(
    readonly type: TokenType,
    readonly lexeme: string,
    readonly literal: LiteralValue,
    readonly line: number
  ) {}
}
