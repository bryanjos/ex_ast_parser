"use strict"

import * as types from './types';

function Reader(tokens) {
    this.tokens = tokens.map(function (a) { return a; });
    this.position = 0;
}

Reader.prototype.next = function() { return this.tokens[this.position++]; }
Reader.prototype.peek = function() { return this.tokens[this.position]; }

function tokenize(str) {
    let re = /[\s,]*(:{}|:%{}|:<<>>|:%|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)/g;
    let results = [];
    let match;

    while ((match = re.exec(str)[1]) != '') {
        if (match[0] === ';') { continue; }
        results.push(match);
    }

    return results;
}

function read_atom (reader) {
    let token = reader.next();

    if (token.match(/^-?[0-9]+$/)) {
        return parseInt(token, 10)        // integer
    } else if (token.match(/^-?[0-9][0-9.]*$/)) {
        return parseFloat(token, 10);     // float
    } else if (token[0] === "\"") {
        return token.slice(1, token.length-1)
            .replace(/\\"/g, '"')
            .replace(/\\n/g, "\n")
            .replace(/\\\\/g, "\\"); // string
    } else if (token[0] === ":") {
        return  Symbol.for(token.slice(1)); //atom
    } else if (token === "nil") {
        return null;
    } else if (token === "true") {
        return true;
    } else if (token === "false") {
        return false;
    } else {
        return Symbol.for(token); //atom
    }
}

function read_list(reader, start, end) {
    start = start || '[';
    end = end || ']';
    let ast = [];
    let token = reader.next();
    if (token !== start) {
        throw new Error("expected '" + start + "'");
    }
    while ((token = reader.peek()) !== end) {
        if (!token) {
            throw new Error("expected '" + end + "', got EOF");
        }
        ast.push(read_form(reader));
    }
    reader.next();
    return ast;
}

function read_tuple(reader) {
    let lst = read_list(reader, '{', '}');
    return new types.Tuple(...lst);
}


function read_form(reader) {
    let token = reader.peek();
    switch (token) {
    // reader macros/transforms

    // list
    case ']': throw new Error("unexpected ']'");
    case '[': return read_list(reader);

    // tuple
    case '}': throw new Error("unexpected '}'");
    case '{': return read_tuple(reader);

    // atom
    default:  return read_atom(reader);
    }
}

class BlankException{
  constructor(msg){
    this.msg = msg;
  }
}

function read_str(str) {
    let tokens = tokenize(str);
    if (tokens.length === 0) { throw new BlankException(); }
    return read_form(new Reader(tokens))
}

export {
  Reader,
  BlankException,
  tokenize,
  read_form,
  read_str
}
