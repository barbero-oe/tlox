import { Scanner, Token } from '../core/Scanner'

describe('Scanner', () => {
  const createScanner = (code: string) => new Scanner(code)
  const lexemes = (tokens: Token[]): string[] =>
    tokens.map((token) => token.lexeme)

  it('should parse single character lexemes', () => {
    // const scanner = createScanner('(){},.-+;*')
    const scanner = createScanner('(){},.-+;*')

    const tokens: Token[] = scanner.scan()

    expect(lexemes(tokens)).toEqual([
      '(',
      ')',
      '{',
      '}',
      ',',
      '.',
      '-',
      '+',
      ';',
      '*',
      '',
    ])
  })

  it('should parse Lox statements', () => {
    const scanner = createScanner(COMPLEX_CODE)

    const tokens: Token[] = scanner.scan()

    expect(lexemes(tokens)).toEqual(TOKENS)
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
    '',
  ]
})
