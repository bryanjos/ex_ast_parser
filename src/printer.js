import * as types from './types';

function println(...args) {
  console.log.apply(console, args);
};


function _pr_str(obj, print_readably) {
    if (typeof print_readably === 'undefined') { print_readably = true; }
    var _r = print_readably;
    var ot = types.getType(obj);
    switch (ot) {
    case 'list':
        var ret = obj.map(function(e) { return _pr_str(e,_r); });
        return "[" + ret.join(', ') + "]";
    case 'tuple':
        var ret = obj.items.map(function(e) { return _pr_str(e,_r); });
        return "{" + ret.join(', ') + "}";
    case 'string':
        if (_r) {
            return '"' + obj.replace(/\\/g, "\\\\")
                .replace(/"/g, '\\"')
                .replace(/\n/g, "\\n") + '"'; // string
        } else {
            return obj;
        }
    case 'atom':
        return ':' + Symbol.keyFor(obj);
    case 'nil':
        return "nil";
    default:
        return obj.toString();
    }
}

export {
  _pr_str,
  println
}
