export class Scanner {
  constructor(private source: string) {}

  scan(): Token[] {
    return []
  }
}

export class Token {
  constructor(public lexeme: string) {}
}
