/*

LANGUAGE IMPLEMENTED

element -> ("<" name (name "=" value)* ">" (element)* "<" "/" name ">" )
         | ("<" name (name "=" value)* "/" ">")
         | (text);

value -> """ (character)* """;
name -> (letter | "-" | "_") (character)*;
text -> (character)*;

*/
import Token, { types as tokenTypes } from "./Token.js";
import Enum from "../utils/enum.js";

const contextTypes = Enum.object(
  'TAG',
  'CHILDREN'
);

export default class Scanner {
  constructor (code) {
    this.code = code;
    this.position = 0;
    this.context = contextTypes.CHILDREN;
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

  peekPrevious () {
    if (this.position === 0) return null;
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

  nameToken() {
    const characters = "abcdefghijklmnopqrstuvwxyz-".split('');
    let lexeme = "";
    let c = this.advance();

    while (characters.indexOf(c) > -1) {
      lexeme += c;
      c = this.advance();
    }

    this.position--;

    return new Token(tokenTypes.NAME, lexeme);
  }

  textToken() {
    const whitespaceCharacters = ' \n\t\r'.split('');
    let lexeme = "";
    let afterWhitespace = false;
    let c = this.advance();

    while (c !== '<') {
      if (afterWhitespace && whitespaceCharacters.indexOf(c) > -1) {
        if (whitespaceCharacters.indexOf(this.peekNext()) === -1) afterWhitespace = false;
      } else {
        lexeme += c;
        if (whitespaceCharacters.indexOf(c) > -1) afterWhitespace = true;
        else afterWhitespace = false;
      }

      c = this.advance();
    }

    this.position--;

    lexeme = lexeme.split(" ").filter(p => p.length > 0).join(" ");

    return new Token(tokenTypes.TEXT, lexeme);
  }

  getNextToken () {
    this.skipWhitespace();

    if (this.end()) return new Token(tokenTypes.EOF);

    const c = this.advance();

    if (c === '<') {
      this.context = contextTypes.TAG;
      return new Token(tokenTypes.LESS_THAN, '<');
    }

    if (c === '=') return new Token(tokenTypes.EQUAL_SIGN, '=');
    if (c === '/') return new Token(tokenTypes.SLASH, '/');

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
