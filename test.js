import Scanner, { contextTypes } from "./scanner/Scanner.js";
import Token, { types as tokenTypes } from "./scanner/Token.js";

const text = build`${123}
  a<div atributo="lal\\"ala">
    <teste>
      <maca exp=${123}>
        <uau atributo="que nao termina o valor" />
        <${build} />
        testando            lalala muito        ${"lalala"}         bacana isso aí                     
      </maca>
    </teste>
  </div>asdasdasd
${123}`;

function build (...args) {
  const [strings, ...parts] = args;
  const r = [];

  for (let i = 0; i < strings.length; i++) {
    r.push(strings[i]);
    if (i < parts.length) r.push(parts[i]);
  }

  return r;
}

const tokens = [];
let context = contextTypes.CHILDREN;

for (let i = 0; i < text.length; i++) {
  if (i % 2 === 0) {
    const scanner = new Scanner(text[i], context);
    tokens.push(...scanner.lex());
    context = scanner.context;
  } else {
    tokens.push(
      new Token(tokenTypes.JS_EXP, text[i])
    );
  }
}

console.log(tokens);