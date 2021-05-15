import Token, { types as tokenTypes } from "./Token.js";
import Enum from "../utils/enum.js";

export const contextTypes = Enum.object(
  'TAG',
  'CHILDREN'
);

export default class Scanner {
  constructor (code, initialContext = contextTypes.CHILDREN) {
    this.code = code;
    this.position = 0;
    this.context = initialContext;
  }

  lex () {
    const tokens = [];
    let token = this.getNextToken();

    while (token.type !== tokenTypes.EOF) {
      tokens.push(token);
      token = this.getNextToken();
    }

    return tokens;
  }

  end () {
    return this.code.length === this.position;
  }

  peek () {
    if (this.code.length === this.position) return null;
    return this.code[this.position];
  }

  peekNext () {
    if (this.code.length === this.position - 1) return null;
    return this.code[this.position + 1];
  }

  advance () {
    return this.code[this.position++];
  }

  match (c) {
    if (this.end()) return false;
    if (this.peek() != c) return false;

    this.position++;
    return true;
  }

  skipWhitespace () {
    for (;;) {
      const c = this.peek();

      switch (c) {
        case '\n': 
          this.advance();
          break;
        
        case ' ':
        case '\t':
        case '\r':
          this.advance();
          break;
        
        default:
          return;
      }
    }
  }

  valueToken () {
    let lexeme = "";
    let c = this.advance();

    do {
      if (this.end()) {
        throw new Error('Expected closing double quotes')
      };

      if (c === '\\') {
        const next = this.peek();
        if (next === '"') {
          lexeme += '"';
          this.advance();
        } else {
          lexeme += c;
        }
      } else {
        lexeme += c;
      }
    } while ((c = this.advance()) !== '"');

    return new Token(tokenTypes.VALUE, lexeme);
  }

  nameToken () {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-1234567890".split('');
    let lexeme = "";
    let c = this.advance();

    if (c === '-') throw new Error('Names can\'t start with "-"')

    while (characters.indexOf(c) > -1) {
      lexeme += c;
      c = this.advance();
    }

    this.position--;

    return new Token(tokenTypes.NAME, lexeme);
  }

  textToken () {
    let lexeme = "";
    let c = this.advance();

    while (c !== '<' && !this.end()) {
      lexeme += c;
      c = this.advance();
    }

    if (this.end()) lexeme += c;

    this.position--;

    return new Token(tokenTypes.TEXT, lexeme);
  }

  getNextToken () {
    const initialPosition = this.position;
    this.skipWhitespace();

    if (this.end()) return new Token(tokenTypes.EOF);

    const c = this.advance();

    if (c === '<') {
      this.context = contextTypes.TAG;

      if (this.peek() === '/') {
        this.advance();
        this.context = contextTypes.TAG;
        return new Token(tokenTypes.CLOSING_TAG, '</');
      }

      return new Token(tokenTypes.LESS_THAN, '<');
    } else if (this.context === contextTypes.CHILDREN) {
      this.position = initialPosition + 1;
    }

    if (c === '=') return new Token(tokenTypes.EQUAL_SIGN, '=');
    if (c === '/') {
      if (this.peek() === '>') {
        this.advance();
        this.context = contextTypes.CHILDREN;
        return new Token(tokenTypes.CLOSING_TAG, '/>');
      }

      return new Token(tokenTypes.SLASH, '/');
    }

    if (c === '>') {
      this.context = contextTypes.CHILDREN;
      return new Token(tokenTypes.GREATER_THAN, '>');
    }

    if (this.context === contextTypes.TAG) {
      switch (c) {
        case '"':
          return this.valueToken();
        default:
          this.position--;
          return this.nameToken();
      }
    } else {
      this.position--;
      return this.textToken();
    }
  }
}
