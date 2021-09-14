import { LiteralValue, Token } from './Token'
import { Visitor } from './Visitor'

export abstract class Expr {
  abstract accept<T>(visitor: Visitor<T>): T
}

export class Binary extends Expr {
  constructor(
    readonly left: Expr,
    readonly operator: Token,
    readonly right: Expr
  ) {
    super()
  }

  readonly accept = <T>(visitor: Visitor<T>): T => visitor.visitBinary(this)
}

export class Grouping extends Expr {
  constructor(readonly expression: Expr) {
    super()
  }

  readonly accept = <T>(visitor: Visitor<T>): T => visitor.visitGrouping(this)
}

export class Literal extends Expr {
  constructor(readonly value: LiteralValue) {
    super()
  }

  readonly accept = <T>(visitor: Visitor<T>): T => visitor.visitLiteral(this)
}

export class Unary extends Expr {
  constructor(readonly operator: Token, readonly right: Expr) {
    super()
  }

  readonly accept = <T>(visitor: Visitor<T>): T => visitor.visitUnary(this)
}
