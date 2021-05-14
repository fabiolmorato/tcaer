import tokenize from "./tokenize.js";

export function html (...args) {
  const tokens = tokenize(args);
  // todo: parse tokens into ast
  return tokens; // for testing purposes
}

