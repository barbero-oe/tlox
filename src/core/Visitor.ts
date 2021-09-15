import { Binary, Grouping, Literal, Unary } from './Expr'

export interface Visitor<T> {
  visitUnary(expr: Unary): T
  visitLiteral(expr: Literal): T
  visitGrouping(expr: Grouping): T
  visitBinary(expr: Binary): T
}

export class PrinterVisitor implements Visitor<string> {
  visitUnary(expr: Unary): string {
    const operator = expr.operator.lexeme
    const right = expr.right.accept(this)
    return `(${operator} ${right})`
  }

  visitLiteral(expr: Literal): string {
    return expr.value?.toString() ?? 'nil'
  }

  visitGrouping(expr: Grouping): string {
    const group = expr.expression.accept(this)
    return `(group ${group})`
  }

  visitBinary(expr: Binary): string {
    const left = expr.left.accept(this)
    const operator = expr.operator.lexeme
    const right = expr.right.accept(this)
    return `(${operator} ${left} ${right})`
  }
}
