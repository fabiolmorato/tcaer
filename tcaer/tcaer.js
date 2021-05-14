import tokenize from "./tokenize.js";
import parse from "./parse.js";

export function html (...args) {
  const tokens = tokenize(args);
  const root = parse(tokens);

  return root; // for testing purposes
}
