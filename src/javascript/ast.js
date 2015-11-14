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

export function array(elements) {
  return {
    type: "ArrayExpression",
    elements: elements
  }
}
