import { Binary, Expr, Grouping, Literal, Unary } from './Expr'

export interface Visitor<T> {
  visitUnary(expr: Unary): T
  visitLiteral(expr: Literal): T
  visitGrouping(expr: Grouping): T
  visitBinary(expr: Binary): T
}

export class PrinterVisitor implements Visitor<string> {
  visitUnary = (expr: Unary): string =>
    this.parenthesize(expr.operator.lexeme, expr.right)

  visitLiteral = (expr: Literal): string => expr.value?.toString() ?? 'nil'

  visitGrouping = (expr: Grouping): string =>
    this.parenthesize('group', expr.expression)

  visitBinary = (expr: Binary): string =>
    this.parenthesize(expr.operator.lexeme, expr.left, expr.right)

  private parenthesize(name: string, ...exprs: Expr[]): string {
    const args = exprs.map((expr) => expr.accept(this)).join(' ')
    return `(${name} ${args})`
  }
}
