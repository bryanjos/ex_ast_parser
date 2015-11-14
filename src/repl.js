import { readline } from './readline';
import * as reader from './reader';
import * as printer from './printer';
import * as types from './types';
import { new_env, env_set, env_get } from './env'
import * as js from './javascript/ast';

// read
function READ(str) {
    return reader.read_str(str);
}

// eval
function translate_ast(ast, env) {
  if (types._list_Q(ast)) {
    return ast.map(function(a) { return EVAL(a, env); });
  } else if (types._tuple_Q(ast)) {
    const items = ast.items.map(function(a) { return EVAL(a, env); });
    return new types.Tuple(...items);
  } else {
    return ast;
  }
}

function add_unquote_splicing(params){
  let new_params = [];

  for(let i = 0; i < params.length; i++){
    if(params[i] instanceof types.Tuple
      && params[i].length === 2
      && params[i].items[0] === Symbol.for("unquote_splicing_eval")){
        new_params = new_params.concat(params[i].items[1]);
      }else{
        new_params.push(params[i]);
      }
  }

  return new_params;
}

function quote(quoted, options, env){
  if(types._list_Q(quoted)){

    let ps = quoted.map( (item) => quote(item, options, env) );
    return add_unquote_splicing(ps);

  }else if(types._tuple_Q(quoted) && quoted.length == 2) {
    return new types.Tuple(
      quote(quoted.items[0], options, env),
      quote(quoted.items[1], options, env)
    );

  }else if(!types._tuple_Q(quoted)){
    return quoted;
  }

  const [func, context, params] = quoted.items;

  if(func === Symbol.for("unquote")){
    return TRANSLATE(params[0], env)
  }else if(func === Symbol.for("unquote_splicing")){
    return new types.Tuple(Symbol.for("unquote_splicing_eval"), TRANSLATE(params[0], env));
  }else{
    let ps = params.map( (item) => quote(item, options, env) );
    ps = add_unquote_splicing(ps);
    return new types.Tuple(func, context, ps);
  }
}

function _TRANSLATE(ast, env) {
    if (!types._tuple_Q(ast) || (types._tuple_Q(ast) && ast.length == 2)) {
        return translate_ast(ast, env);
    }

    // apply tuple
    const el = translate_ast(ast, env);
    const [f, context, params] = el.items;

    switch(f){
      case Symbol.for("quote"):
        const doblock = params[0][0].items[1];
        const options = params[0].slice(1);

        const quoted = quote(doblock, options, env);

        if(quoted.length === 1){
          return quoted[0];
        }else{
          return quoted;
        }
      default:
        const func = env_get(env, f);
        return func(...params);
    }
}

function TRANSLATE(ast, env) {
    const result = _TRANSLATE(ast, env);
    return (typeof result !== "undefined") ? result : null;
}

// print
function PRINT(exp) {
    return printer._pr_str(exp, true);
}

function EVAL(jsAST){
  return jsAST
}

// repl
let repl_env = new_env();
env_set(repl_env, Symbol.for('+'), function(a,b){return a + b;});
env_set(repl_env, Symbol.for('-'), function(a,b){return a - b;});
env_set(repl_env, Symbol.for('*'), function(a,b){return a * b;});
env_set(repl_env, Symbol.for('/'), function(a,b){return a / b;});

const REP = (str) => PRINT(
  EVAL(
    TRANSLATE(
      READ(str),
      repl_env
    )
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
