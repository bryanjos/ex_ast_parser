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
  else if (_atom_Q(obj)) {    return 'atom'; }
  else if (_integer_Q(obj)) {    return 'integer'; }
  else if (_float_Q(obj)) {    return 'float'; }
  else if (_function_Q(obj)) {    return 'function'; }
  else if (_string_Q(obj)) {    return 'string'; }
  else if (_map_Q(obj)) {    return 'map'; }

  throw new Error("Unknown type '" + typeof(obj) + "'");
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

function _boolean_Q(obj) { return typeof obj == "boolean"; }
function _function_Q(obj) { return typeof obj == "function"; }
function _list_Q(obj) { return Array.isArray(obj); }
function _tuple_Q(obj) { return obj instanceof Tuple; }
function _atom_Q(obj) { return typeof obj == "symbol"; }
function _string_Q(obj) { return typeof obj == "string"; }
function _integer_Q(obj) { return Number.isInteger(obj); }
function _float_Q(obj) { return typeof obj == "number" && !Number.isInteger(obj); }
function _map_Q(obj) { return typeof obj == "object" }

export {
  Tuple,
  getType,
  _nil_Q,
  _true_Q,
  _false_Q,
  _function_Q,
  _list_Q,
  _tuple_Q,
  _atom_Q,
  _boolean_Q,
  _string_Q,
  _integer_Q,
  _float_Q,
  _map_Q
}
