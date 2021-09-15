import { Binary, Expr, Grouping, Literal, Unary } from '../core/Expr'
import { LiteralValue, Token } from '../core/Token'
import { TokenType } from '../core/TokenType'
import { PrinterVisitor } from '../core/Visitor'

describe('PrinterVisitor should', () => {
  const minus = (expr: Expr) =>
    new Unary(new Token(TokenType.MINUS, '-', null, 1), expr)
  const mul = (left: Expr, right: Expr) =>
    new Binary(left, new Token(TokenType.STAR, '*', null, 1), right)
  const plus = (left: Expr, right: Expr) =>
    new Binary(left, new Token(TokenType.PLUS, '+', null, 1), right)
  const lit = (lit: LiteralValue) => new Literal(lit)
  const group = (expr: Expr) => new Grouping(expr)

  it.each([
    [minus(lit(5)), '(- 5)'],
    [minus(lit(null)), '(- nil)'],
    [mul(lit(3), lit(4)), '(* 3 4)'],
    [
      plus(mul(lit(3), lit(4)), minus(lit('hello world'))),
      '(+ (* 3 4) (- hello world))',
    ],
    [group(mul(lit(3), lit(4))), '(group (* 3 4))'],
  ])('print an expression', (expr: Expr, expected: string) => {
    const visitor = new PrinterVisitor()

    const result = expr.accept(visitor)

    expect(result).toEqual(expected)
  })
})
