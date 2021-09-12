import { TokenType } from './TokenType'

export type Literal = string | number | null

export class Token {
  constructor(
    private readonly type: TokenType,
    public readonly lexeme: string,
    private readonly literal: Literal,
    private readonly line: number
  ) {}
}
