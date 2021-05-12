import Scanner from "./scanner/Scanner.js";

const scanner = new Scanner(`
  a<div atributo="lal\\"ala">
    <teste>
      <maca>
        <uau atributo="que nao termina o valor" />
        testando            lalala muito                 bacana isso aí                     
      </maca>
    </teste>
  </div>asdasdasd
`);

console.log(scanner.lex());
