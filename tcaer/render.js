import { nodeTypes } from "../parser/Parser.js"

export default function render (root, element) {
  const elements = nodeListToElements(root.children);
  
  for (const child of elements) {
    element.appendChild(child);
  }
}

function nodeListToElements (nodeList) {
  const elements = [];

  for (const node of nodeList) {
    if (node.type === nodeTypes.TAG) {
      elements.push(...tagNode(node));
    } else {
      elements.push(textNode(node));
    }
  }

  return elements;
}

function textNode (node) {
  if (['number', 'string'].indexOf(typeof node.value) === -1) {
    throw new Error(`Currently only numbers and strings are supported to interpolate inside html children context! Type ${typeof node.value} not supported`);
  }

  const element = document.createTextNode(node.value);
  return element;
}

function tagNode (node) {
  if (typeof node.name === 'string') {
    return elementNode(node);
  } else if (typeof node.name === 'function') {
    return componentNode(node);
  } else {
    throw new Error(`Expected tag name to be string or function, but got ${typeof node.name}`);
  }
}

function componentNode (node) {
  const func = node.name;
  const tree = func(node.props);
  return nodeListToElements(tree.children);
}

function elementNode (node) {
  const element = document.createElement(node.name);

  for (const prop in node.props) {
    element.setAttribute(prop, node.props[prop]);
  }

  const children = nodeListToElements(node.children);

  for (const child of children) {
    element.appendChild(child);
  }

  return [element];
}
