import Scanner, { contextTypes } from "../scanner/Scanner.js";
import Token, { types as tokenTypes } from "../scanner/Token.js";

export default function tokenize ([strings, ...parts]) {
  const finalTokens = [];
  let i = 0;
  let context = contextTypes.CHILDREN;

  for (let i = 0; i < strings.length; i++) {
    const code = strings[i];
    const scanner = new Scanner(code, context);

    const tokens = scanner.lex();
    finalTokens.push(...tokens);

    if (i < parts.length) {
      const value = parts[i];
      const token = new Token(tokenTypes.JS_EXP, value);

      finalTokens.push(token);
    }

    context = scanner.context;
  }

  return finalTokens;
}
