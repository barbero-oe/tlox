import { Expr, Literal } from './Expr'
import { Token } from './Token'

export class Parser {
  private current = 0

  constructor(private tokens: Token[]) {}

  parse(): Expr {
    return this.primary()
  }

  private primary() {
    return new Literal(this.peek().literal)
  }

  private peek(): Token {
    const token = this.tokens[this.current]
    if (!token) throw new Error('end')
    return token
  }
}
