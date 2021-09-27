import { Expr, Literal } from './Expr'
import { Token } from './Token'
import { TokenType } from './TokenType'

export class Parser {
  private current = 0

  constructor(private tokens: Token[]) {}

  parse(): Expr {
    return this.primary()
  }

  private primary(): Expr {
    if (this.match(TokenType.TRUE, TokenType.FALSE))
      return new Literal(this.previous().literal)
    return new Literal(this.peek().literal)
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
