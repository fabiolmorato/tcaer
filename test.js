import Scanner from "./scanner/Scanner.js";

const scanner = new Scanner(`
  a<div atributo="lal\\"ala">
    <teste>
      <maca>
        <uau />
        testando            lalala muito                 bacana isso aí                     
      </maca>
    </teste>
  </div>
`);

console.log(scanner.lex());
