import Scanner from "./scanner/Scanner.js";

const scanner = new Scanner(`
  <div>
    <teste>
      <maca>
        <pirulito />
        testando            lalala muito                 bacana isso aí                     
      </maca>
    </teste>
  </div>
`);

console.log(scanner.lex());
