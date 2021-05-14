import Parser from "../parser/Parser.js";

export default function parse (tokens) {
  const parser = new Parser(tokens);
  return parser.parse();
}
