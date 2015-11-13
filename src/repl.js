import { readline } from './readline';
import * as reader from './reader';
import * as printer from './printer';
import * as types from './types';
import { new_env, env_set, env_get } from './env'

// read
function READ(str) {
    return reader.read_str(str);
}

// eval
function eval_ast(ast, env) {
  if (types._list_Q(ast)) {
    return ast.map(function(a) { return EVAL(a, env); });
  } else if (types._tuple_Q(ast)) {
    const items = ast.items.map(function(a) { return EVAL(a, env); });
    return new types.Tuple(...items);
  } else {
    return ast;
  }
}

function _EVAL(ast, env) {
    if (!types._tuple_Q(ast) || (types._tuple_Q(ast) && ast.length == 2)) {
        return eval_ast(ast, env);
    }

    // apply tuple
    const el = eval_ast(ast, env);
    const [f, context, params] = el.items;

    switch(f){
      case Symbol.for("{}"):
        return new types.Tuple(...params);
      default:
        const func = env_get(env, f);
        return func(...params);
    }
}

function EVAL(ast, env) {
    const result = _EVAL(ast, env);
    return (typeof result !== "undefined") ? result : null;
}

// print
function PRINT(exp) {
    return printer._pr_str(exp, true);
}

// repl
let repl_env = new_env();
env_set(repl_env, Symbol.for('+'), function(a,b){return a + b;});
env_set(repl_env, Symbol.for('-'), function(a,b){return a - b;});
env_set(repl_env, Symbol.for('*'), function(a,b){return a * b;});
env_set(repl_env, Symbol.for('/'), function(a,b){return a / b;});

const REP = (str) => PRINT(EVAL(READ(str), repl_env));

// repl loop
while (true) {
    let line = readline('user> ')
    if (line == null) break;
    if (line == ":q") break;
    try {
        if (line) { console.log(REP(line)); }
    } catch (exc) {
        if (exc instanceof reader.BlankException) { continue; }
        if (exc.stack) { console.log(exc.stack); }
        else           { console.log(`Error: ${exc}`); }
    }
}
