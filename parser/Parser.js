import { types as tokenTypes } from "../scanner/Token.js";
import Enum from "../utils/enum.js";

export const nodeTypes = Enum.object(
  'ROOT',
  'TAG',
  'TEXT',
  'JS'
);

export default class Parser {
  constructor (tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  parse () {
    const root = {
      type: nodeTypes.ROOT,
      children: []
    };

    while (!this.end()) {
      root.children.push(this.getNextNode());
    }

    return root;
  }

  end () {
    return this.position >= this.tokens.length;
  }

  peek () {
    if (this.end()) return null;
    return this.tokens[this.position];
  }

  peekNext () {
    if (this.position === this.tokens.length - 1) return null;
    return this.tokens[this.position + 1];
  }

  advance () {
    if (this.end()) return null;
    return this.tokens[this.position++];
  }

  match (...types) {
    const type = this.peek().type;
    return types.indexOf(type) !== -1;
  }

  expect (...types) {
    if (!this.match(...types)) throw new Error(`Expected one of the following tokens: ${types.join(', ')} but got ${this.peek().type} ${this.peek().lexeme}`);
  }

  getTagProps () {
    const props = {};

    while (this.match(tokenTypes.NAME)) {
      const token = this.advance();
      const name = token.lexeme;
      
      props[name] = true;
      
      if (this.advance().type === tokenTypes.EQUAL_SIGN) {
        this.expect(tokenTypes.VALUE, tokenTypes.JS_EXP);
        props[name] = this.advance().lexeme;
      } else {
        this.position--;
      }
    }

    return props;
  }

  getTagChildren (tag) {
    const children = [];

    while (this.match(tokenTypes.LESS_THAN, tokenTypes.TEXT, tokenTypes.JS_EXP)) {
      children.push(this.getNextNode());
    }

    this.expect(tokenTypes.CLOSING_TAG);
    this.advance();

    this.expect(tokenTypes.NAME);
    const name = this.advance();

    if (name.lexeme !== tag.lexeme) throw new Error('Closing tag differs from last open!');

    this.expect(tokenTypes.GREATER_THAN);
    this.advance();

    return children;
  }

  tagNode () {
    this.advance(); // consumes <
    this.expect(tokenTypes.NAME, tokenTypes.JS_EXP);

    const tag = this.advance();
    const children = [];
    const props = this.getTagProps();

    this.expect(tokenTypes.CLOSING_TAG, tokenTypes.GREATER_THAN);

    // not a self-closing tag
    if (this.match(tokenTypes.GREATER_THAN)) {
      this.advance(); // consumes >
      children.push(...this.getTagChildren(tag));
    } else {
      this.advance(); // consumes />
    }

    return {
      type: nodeTypes.TAG,
      name: tag.lexeme,
      props,
      children
    };
  }

  textNode () {
    const token = this.advance();

    return {
      type: nodeTypes.TEXT,
      value: token.lexeme
    };
  }

  getNextNode () {
    if (this.match(tokenTypes.LESS_THAN)) {
      return this.tagNode();
    } else {
      return this.textNode();
    }
  }
}
