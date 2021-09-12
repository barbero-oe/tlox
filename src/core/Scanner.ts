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
  private readonly errors: ScanError[] = []

  constructor(private readonly source: string) {}

  scan(): ScanResult {
    while (!this.isAtEnd()) {
      this.start = this.current
      this.scanToken()
    }
    this.tokens.push(new Token(TokenType.EOF, '', null, this.line))
    return { tokens: this.tokens, errors: this.errors }
  }

  private scanToken() {
    const character = this.advance()
    const token = this.singleTokens.get(character)
    if (token !== undefined) {
      this.addToken(token)
      return
    }
    switch (character) {
      case ' ':
      case '\t':
      case '\r':
        break
      case '\n':
        this.line++
        break
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS)
        break
      case '>':
        this.addToken(
          this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER
        )
        break
      case '!':
        this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG)
        break
      case '=':
        this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL)
        break
      case '/':
        if (this.match('/')) this.consumeComment()
        else this.addToken(TokenType.SLASH)
        break
      default:
        this.error(this.line, 'Unexpected character.', character)
        break
    }
  }

  private addToken(type: TokenType, literal: Literal = null) {
    const text = this.source.substring(this.start, this.current)
    this.tokens.push(new Token(type, text, literal, this.line))
  }

  private isAtEnd = (): boolean => this.current >= this.source.length

  private advance(): string {
    return this.source[this.current++]
  }

  private peek(): string {
    return this.source[this.current]
  }

  private match(character: string): boolean {
    if (this.isAtEnd()) return false
    if (this.source[this.current] !== character) return false
    this.current++
    return true
  }

  private error(line: number, message: string, symbol: string) {
    const error = new ScanError(line, message, symbol)
    return this.errors.push(error)
  }

  private consumeComment() {
    while (this.peek() !== '\n' && !this.isAtEnd()) this.advance()
  }
}

export type ScanResult = {
  tokens: Token[]
  errors: ScanError[]
}

export class ScanError {
  constructor(
    readonly line: number,
    readonly message: string,
    readonly symbol: string
  ) {}
}
