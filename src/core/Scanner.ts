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
  private readonly reservedWords = new Map<string, TokenType>([
    ['and', TokenType.AND],
    ['class', TokenType.CLASS],
    ['else', TokenType.ELSE],
    ['false', TokenType.FALSE],
    ['for', TokenType.FOR],
    ['fun', TokenType.FUN],
    ['if', TokenType.IF],
    ['nil', TokenType.NIL],
    ['or', TokenType.OR],
    ['print', TokenType.PRINT],
    ['return', TokenType.RETURN],
    ['super', TokenType.SUPER],
    ['this', TokenType.THIS],
    ['true', TokenType.TRUE],
    ['var', TokenType.VAR],
    ['while', TokenType.WHILE],
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
      case '"':
        this.consumeString()
        break
      default:
        if (this.isDigit(character)) this.consumeNumber()
        else if (this.isAlpha(character)) this.consumeIdentifier()
        else this.report(this.line, 'Unexpected character.', character)
        break
    }
  }

  private isAlpha = (character: string): boolean =>
    (character >= 'a' && character <= 'z') ||
    (character >= 'A' && character <= 'Z') ||
    character == '_'

  private isAlphaNumeric = (character: string): boolean =>
    this.isAlpha(character) || this.isDigit(character)

  private consumeIdentifier() {
    while (this.isAlphaNumeric(this.peek()) && !this.isAtEnd()) this.advance()
    const text = this.source.substring(this.start, this.current)
    const type = this.reservedWords.get(text)
    this.addToken(type ? type : TokenType.IDENTIFIER)
  }

  private addToken(type: TokenType, literal: Literal = null) {
    const text = this.source.substring(this.start, this.current)
    this.tokens.push(new Token(type, text, literal, this.line))
  }

  private isAtEnd = (): boolean => this.current >= this.source.length

  private advance(): string {
    return this.source.charAt(this.current++)
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0'
    return this.source.charAt(this.current)
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return '\0'
    return this.source.charAt(this.current + 1)
  }

  private match(character: string): boolean {
    if (this.isAtEnd()) return false
    if (this.source[this.current] !== character) return false
    this.current++
    return true
  }

  private report(line: number, message: string, symbol: string) {
    const error = new ScanError(line, message, symbol)
    return this.errors.push(error)
  }

  private consumeComment() {
    while (this.peek() !== '\n' && !this.isAtEnd()) this.advance()
  }

  private consumeString() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++
      this.advance()
    }
    if (this.isAtEnd()) {
      const value = this.source.substring(this.start, this.current - 1)
      this.report(this.line, 'Unterminated string.', value)
      return
    }
    this.advance()
    const value = this.source.substring(this.start + 1, this.current - 1)
    this.addToken(TokenType.STRING, value)
  }

  private isDigit = (character: string) => character >= '0' && character <= '9'

  private consumeNumber() {
    while (this.isDigit(this.peek())) this.advance()
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      this.advance()
      while (this.isDigit(this.peek())) this.advance()
    }
    const value = this.source.substring(this.start, this.current)
    const literal = parseFloat(value)
    this.addToken(TokenType.NUMBER, literal)
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
