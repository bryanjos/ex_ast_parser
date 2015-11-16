import { readline } from './readline';
import * as reader from './reader';
import * as printer from './printer';
import * as types from './types';
import * as code from './lib/code';
import { new_env, env_set, env_get } from './lib/env';
import * as js from './javascript/ast';

// read
function READ(str) {
    return reader.read_str(str);
}

// eval
function EVAL(ast, env){
  return code.eval_quoted(ast, env)
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

const REP = (str) => PRINT(
  EVAL(
    READ(str),
    repl_env
  )
);

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
