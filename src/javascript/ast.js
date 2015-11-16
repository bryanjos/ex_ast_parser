/* @flow */
import escodegen from "escodegen";

export function generate(ast){
  return escodegen.generate(ast);
}

export function evaluate(code){
  return eval(code);
}

export function literal(value) {
  return {
    type: "Literal",
    value: value
  }
}

export function identifier(name) {
  return {
    type: "Identifier",
    name: name
  }
}

export function call(callee, args) {
  return {
    type: "CallExpression",
    callee: callee,
    arguments: arguments
  }
}

export function _new(callee, args) {
  return {
    type: "NewExpression",
    callee: callee,
    arguments: arguments
  }
}

export function array(elements) {
  return {
    type: "ArrayExpression",
    elements: elements
  }
}

export function tuple(elements) {
  return _new(identifier("Tuple"), elements);
}

export function symbol(description) {
  return _call(identifier("Symbol"), [description]);
}
