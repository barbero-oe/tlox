import { Binary, Expr, Literal, Unary } from './Expr'
import { Token } from './Token'
import { TokenType } from './TokenType'

export class Parser {
  private current = 0

  constructor(private tokens: Token[]) {}

  parse(): Expr {
    return this.expression()
  }

  private expression(): Expr {
    return this.equality()
  }

  private equality(): Expr {
    let left = this.comparison()
    while (this.match(TokenType.EQUAL_EQUAL, TokenType.BANG_EQUAL)) {
      const operator = this.previous()
      const right = this.comparison()
      left = new Binary(left, operator, right)
    }
    return left
  }

  private comparison(): Expr {
    let left = this.term()
    while (
      this.match(
        TokenType.LESS,
        TokenType.GREATER,
        TokenType.LESS_EQUAL,
        TokenType.GREATER_EQUAL
      )
    ) {
      const operator = this.previous()
      const right = this.factor()
      left = new Binary(left, operator, right)
    }
    return left
  }

  private term(): Expr {
    let left = this.factor()
    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous()
      const right = this.factor()
      left = new Binary(left, operator, right)
    }
    return left
  }

  private factor(): Expr {
    let left = this.unary()
    while (this.match(TokenType.STAR, TokenType.SLASH)) {
      const operator = this.previous()
      const right = this.unary()
      left = new Binary(left, operator, right)
    }
    return left
  }

  private unary(): Expr {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator = this.previous()
      const right = this.unary()
      return new Unary(operator, right)
    }
    return this.primary()
  }

  private primary(): Expr {
    if (
      this.match(
        TokenType.TRUE,
        TokenType.FALSE,
        TokenType.NUMBER,
        TokenType.NIL
      )
    ) {
      return new Literal(this.previous().literal)
    }
    throw new Error("you shouldn't be here")
  }

  private match(...args: TokenType[]): boolean {
    if (args.includes(this.peek().type)) {
      this.advance()
      return true
    }
    return false
  }

  private advance() {
    this.current++
  }

  private peek = (): Token =>
    this.assertNotNull(this.tokens[this.current], 'you are out of bound')

  private previous = (): Token =>
    this.assertNotNull(
      this.tokens[this.current - 1],
      'you are at least two steps out of bound'
    )

  private assertNotNull<T>(value: T | null | undefined, error: string): T {
    if (value === null || value === undefined)
      throw new Error(`AssertionError: ${error}`)
    return value
  }
}
