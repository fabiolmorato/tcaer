import Enum from "../utils/enum.js";

export const types = Enum.object(
  'LESS_THAN',
  'CLOSING_TAG',
  'NAME',
  'EQUAL_SIGN',
  'VALUE',
  'GREATER_THAN',
  'SLASH',
  'TEXT',
  'EOF',
  'JS_EXP'
);

export default class Token {
  constructor (type, lexeme) {
    this.type = type;
    this.lexeme = lexeme;
  }
}
