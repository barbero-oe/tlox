import { Scanner, Token } from "../core/Scanner"

describe('Scanner', () => {
  const createScanner = (code: string) => new Scanner(code)

  it('should parse Lox statements', () => {
    const scanner = createScanner(COMPLEX_CODE)

    const tokens: Token[] = scanner.scan()

    const lexemes: string[] = tokens.map((token) => token.lexeme)
    expect(lexemes).toEqual(TOKENS)
  })

  const COMPLEX_CODE = `
    class Breakfast {
      cook() {
        print "Eggs a-fryin'!";
      }

      serve(who) {
        print "Enjoy your breakfast, " + who + ".";

        // single line comment
        var outside = "outside";

        /*
        multi line comment
        */
        fun inner() {
          print outside;
        }

        /* multi line comment
        with /* inner comments */
        for fun */
        return inner;
      }
    }`

  const TOKENS = [
    'class',
    'Breakfast',
    '{',
    'cook',
    '(',
    ')',
    '{',
    'print',
    "Eggs a-fryin'!",
    ';',
    '}',
    'serve',
    '(',
    'who',
    ')',
    '{',
    'print',
    'Enjoy your breakfast, ',
    '+',
    'who',
    '+',
    '.',
    ';',
    'var',
    'outside',
    '=',
    'outside',
    ';',
    'fun',
    'inner',
    '(',
    ')',
    '{',
    'print',
    'outside',
    ';',
    '}',
    'return',
    'inner',
    ';',
    '}',
    '}',
  ]
})
