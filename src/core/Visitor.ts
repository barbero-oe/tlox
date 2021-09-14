import { Binary, Grouping, Literal, Unary } from './Expr'

export interface Visitor<T> {
  visitUnary(expr: Unary): T
  visitLiteral(expr: Literal): T
  visitGrouping(expr: Grouping): T
  visitBinary(expr: Binary): T
}
