class Tuple {
  constructor(...items){
    this.items = items;
    this.length = items.length;
  }

  toString(){
    let str = "{";

    for(let i = 0; i < this.items.length; i++){
      if(i === (this.items.length - 1)){
        str += i.toString();
      }else{
        str += i.toString() + ",";
      }
    }

    return str + "}";
  }
}

function getType(obj){

  if (_list_Q(obj)) {   return 'list'; }
  else if (_tuple_Q(obj)) { return 'tuple'; }
  else if (_nil_Q(obj)) {      return 'nil'; }
  else if (_true_Q(obj)) {     return 'true'; }
  else if (_false_Q(obj)) {    return 'false'; }
  else {
      switch (typeof(obj)) {
        case 'symbol':   return 'atom';
        case 'number':   return Number.isInteger(obj) ? 'integer' : 'float';
        case 'function': return 'function';
        case 'string': return 'string';
        default: throw new Error("Unknown type '" + typeof(obj) + "'");
      }
  }
}


function _equal_Q (a, b) {
    var ota = getType(a), otb = getType(b);
    if (ota !== otb) {
        return false;
    }
    switch (ota) {
    case 'list':
    case 'tuple':
        if (a.length !== b.length) { return false; }
        for (var i=0; i<a.length; i++) {
            if (! _equal_Q(a[i], b[i])) { return false; }
        }
        return true;
    default:
        return a === b;
    }
}

function _nil_Q(a) { return a === null ? true : false; }
function _true_Q(a) { return a === true ? true : false; }
function _false_Q(a) { return a === false ? true : false; }
function _function_Q(obj) { return typeof obj == "function"; }
function _list_Q(obj) { return Array.isArray(obj); }
function _tuple_Q(obj) { return obj instanceof Tuple; }

export {
  Tuple,
  getType,
  _nil_Q,
  _true_Q,
  _false_Q,
  _function_Q,
  _list_Q,
  _tuple_Q
}
