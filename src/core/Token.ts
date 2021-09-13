import { TokenType } from './TokenType'

export type Literal = string | number | null

export class Token {
  constructor(
    readonly type: TokenType,
    readonly lexeme: string,
    readonly literal: Literal,
    readonly line: number
  ) {}
}
