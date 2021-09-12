import { ScanError, Scanner } from '../core/Scanner'
import { Token } from '../core/Token'

describe('Scanner', () => {
  const createScanner = (code: string) => new Scanner(code)
  const lexemes = (tokens: Token[]) => tokens.map((token) => token.lexeme)
  const symbols = (errors: ScanError[]) => errors.map((error) => error.symbol)

  it('should parse single character lexemes', () => {
    // const scanner = createScanner('(){},.-+;*')
    const scanner = createScanner('(){},.-+;*')

    const { tokens, errors } = scanner.scan()

    expect(errors).toBeEmpty()
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
      ''
    ])
  })

  it('should show errors when it finds invalid characters', () => {
    const scanner = createScanner('@#^')

    const { errors } = scanner.scan()

    expect(symbols(errors)).toEqual(['@', '#', '^'])
  })

  it('should parse Lox statements', () => {
    const scanner = createScanner(COMPLEX_CODE)

    const { tokens, errors } = scanner.scan()

    expect(symbols(errors)).toBeEmpty()
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
