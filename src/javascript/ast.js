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

export function binary(operator, left, right) {
  return {
    type: "BinaryExpression",
    operator: operator,
    left: left,
    right: right
  }
}

export function _call(callee, args) {
  return {
    type: "CallExpression",
    callee: callee,
    arguments: args
  }
}

export function _new(callee, args) {
  return {
    type: "NewExpression",
    callee: callee,
    arguments: args
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

export function member(object, property, computed = false) {
  return {
    type: "MemberExpression",
    object: object,
    property: property,
    computed: computed
  }
}

export function block(statements) {
  return {
    type: "BlockStatement",
    body: statements
  }
}
