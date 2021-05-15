import tokenize from "./tokenize.js";
import parse from "./parse.js";
import render from "./render.js";

export function html (...args) {
  const tokens = tokenize(args);
  const root = parse(tokens);

  return root; // for testing purposes
}

export {
  render
};
