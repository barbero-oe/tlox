/*
expression     → equality ;
equality       → comparison ( ( "!=" | "==" ) comparison )* ;
comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
term           → factor ( ( "-" | "+" ) factor )* ;
factor         → unary ( ( "/" | "*" ) unary )* ;
unary          → ( "!" | "-" ) unary
               | primary ;
primary        → NUMBER | STRING | "true" | "false" | "nil"
               | "(" expression ")" ;
*/

import { Expr } from "../core/Expr"
import { Parser } from "../core/Parser"
import { Scanner } from "../core/Scanner"
import { PrinterVisitor } from "../core/Visitor"

describe('Parser should', () => {
  function parse(code: string): string {
    const scanner = new Scanner(code)
    const tokens = scanner.scan().tokens
    const parser = new Parser(tokens)
    const expression: Expr = parser.parse()
    const printer = new PrinterVisitor()
    return expression.accept(printer)
  }

  it.each([
    ['1']
  ])('parse expression', (code: string) => {
    const representation = parse(code)

    expect(representation).toEqual(code)
  })
})