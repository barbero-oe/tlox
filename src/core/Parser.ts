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
    if (this.match(TokenType.TRUE)) return new Literal(true)
    if (this.match(TokenType.FALSE)) return new Literal(false)
    return new Literal(this.peek().literal)
  }

  private match(...args: TokenType[]): boolean {
    if (args.includes(this.peek().type)) {
      this.advance()
      return true
    }
    return false
  }

  private advance = () => this.current++

  private peek(): Token {
    const token = this.tokens[this.current]
    if (!token) throw new Error('end')
    return token
  }
}
