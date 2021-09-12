import { TokenType } from './TokenType'
import { Token, Literal } from './Token'

export class Scanner {
  private line = 1
  private current = 0
  private start = this.current
  private readonly tokens: Token[] = []
  private readonly singleTokens = new Map<string, TokenType>([
    ['(', TokenType.LEFT_PAREN],
    [')', TokenType.RIGHT_PAREN],
    ['{', TokenType.LEFT_BRACE],
    ['}', TokenType.RIGHT_BRACE],
    [',', TokenType.COMMA],
    ['.', TokenType.DOT],
    ['-', TokenType.MINUS],
    ['+', TokenType.PLUS],
    [';', TokenType.SEMICOLON],
    ['*', TokenType.STAR],
  ])

  constructor(private readonly source: string) {}

  scan(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current
      this.scanToken()
    }
    this.addToken(TokenType.EOF)
    return this.tokens
  }

  private scanToken() {
    const character = this.advance()
    const token = this.singleTokens.get(character)
    if (token !== undefined) {
      this.addToken(token)
    }
  }

  private addToken(type: TokenType, literal: Literal = null) {
    const text = this.source.substring(this.start, this.current)
    this.tokens.push(new Token(type, text, literal, this.line))
  }

  private isAtEnd = (): boolean => this.current > this.source.length

  private advance(): string {
    return this.source[this.current++]
  }
}
