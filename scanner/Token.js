import Enum from "../utils/enum.js";

export const types = Enum.object(
  'LESS_THAN',
  'NAME',
  'EQUAL_SIGN',
  'VALUE',
  'GREATER_THAN',
  'SLASH',
  'TEXT',
  'EOF'
);

export default class Token {
  constructor (type, lexeme) {
    this.type = type;
    this.lexeme = lexeme;
  }
}
