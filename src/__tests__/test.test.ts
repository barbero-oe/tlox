import { ScanError, Scanner } from '../core/Scanner'
import { Token } from '../core/Token'
import { TokenType } from '../core/TokenType'

describe('Scanner', () => {
  const createScanner = (code: string) => new Scanner(code)
  const lexemes = (tokens: Token[]) => tokens.map((token) => token.lexeme)
  const literals = (tokens: Token[]) => tokens.map((token) => token.literal)
  const types = (tokens: Token[]) => tokens.map((token) => token.type)
  const symbols = (errors: ScanError[]) => errors.map((error) => error.symbol)
  const lines = (errors: ScanError[]) => errors.map((error) => error.line)
  const messages = (errors: ScanError[]) => errors.map((error) => error.message)

  it('should parse single character lexemes', () => {
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
      '',
    ])
  })

  it('should show errors when it finds invalid characters', () => {
    const scanner = createScanner('@#^')

    const { errors } = scanner.scan()

    expect(symbols(errors)).toEqual(['@', '#', '^'])
  })

  it('should ignore whitespace', () => {
    const scanner = createScanner(' * \t * \n * \r')

    const { tokens, errors } = scanner.scan()

    expect(symbols(errors)).toBeEmpty()
    expect(lexemes(tokens)).toEqual(['*', '*', '*', ''])
  })

  it('should keep track of lines', () => {
    const scanner = createScanner('@\n@')

    const { errors } = scanner.scan()

    expect(lines(errors)).toEqual([1, 2])
  })

  it('should handle multi-character lexemes', () => {
    const scanner = createScanner('= == < <= > >= ! !=')

    const { tokens } = scanner.scan()

    expect(lexemes(tokens)).toEqual([
      '=',
      '==',
      '<',
      '<=',
      '>',
      '>=',
      '!',
      '!=',
      '',
    ])
  })

  it('should detect slash symbol', () => {
    const scanner = createScanner('/')

    const { tokens, errors } = scanner.scan()

    expect(symbols(errors)).toBeEmpty()
    expect(lexemes(tokens)).toEqual(['/', ''])
  })

  it('should detect single line comments', () => {
    const scanner = createScanner('// a comment\n@')

    const { tokens, errors } = scanner.scan()

    expect(lines(errors)).toEqual([2])
    expect(lexemes(tokens)).toEqual([''])
  })

  it('should detect single line comment at the end of file', () => {
    const scanner = createScanner('// a comment')

    const { tokens, errors } = scanner.scan()

    expect(symbols(errors)).toBeEmpty()
    expect(lexemes(tokens)).toEqual([''])
  })

  it('should detect empty comment at the end of file', () => {
    const scanner = createScanner('//')

    const { tokens, errors } = scanner.scan()

    expect(symbols(errors)).toBeEmpty()
    expect(lexemes(tokens)).toEqual([''])
  })

  it('should detect strings', () => {
    const scanner = createScanner('"a string"')

    const { tokens, errors } = scanner.scan()

    expect(symbols(errors)).toBeEmpty()
    expect(lexemes(tokens)).toEqual(['"a string"', ''])
    expect(literals(tokens)).toEqual(['a string', null])
  })

  it('should support multiline strings', () => {
    const scanner = createScanner('"a\nstring"@')

    const { tokens, errors } = scanner.scan()

    expect(lines(errors)).toEqual([2])
    expect(lexemes(tokens)).toEqual(['"a\nstring"', ''])
    expect(literals(tokens)).toEqual(['a\nstring', null])
  })

  it('should detect unfinished strings', () => {
    const scanner = createScanner('"an unfinished string')

    const { tokens, errors } = scanner.scan()

    expect(lines(errors)).toEqual([1])
    expect(messages(errors)).toEqual(['Unterminated string.'])
    expect(lexemes(tokens)).toEqual([''])
    expect(literals(tokens)).toEqual([null])
  })

  it('should detect numbers', () => {
    const scanner = createScanner('423\n23.33')

    const { tokens, errors } = scanner.scan()

    expect(lines(errors)).toBeEmpty()
    expect(lexemes(tokens)).toEqual(['423', '23.33', ''])
    expect(literals(tokens)).toEqual([423, 23.33, null])
  })

  it('should detect identifiers', () => {
    const scanner = createScanner('hello world_4')

    const { tokens, errors } = scanner.scan()

    expect(lines(errors)).toBeEmpty()
    expect(lexemes(tokens)).toEqual(['hello', 'world_4', ''])
  })

  it('should detect reserved identifiers', () => {
    const scanner = createScanner('hello class if fun world')

    const { tokens, errors } = scanner.scan()

    expect(lines(errors)).toBeEmpty()
    expect(types(tokens)).toEqual([
      TokenType.IDENTIFIER,
      TokenType.CLASS,
      TokenType.IF,
      TokenType.FUN,
      TokenType.IDENTIFIER,
      TokenType.EOF,
    ])
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
        print 13.14;

        // single line comment
        var outside = 523;

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
    '"Eggs a-fryin\'!"',
    ';',
    '}',
    'serve',
    '(',
    'who',
    ')',
    '{',
    'print',
    '"Enjoy your breakfast, "',
    '+',
    'who',
    '+',
    '"."',
    ';',
    'print',
    '13.14',
    ';',
    'var',
    'outside',
    '=',
    '523',
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
