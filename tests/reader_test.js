"use strict"

const reader = require('../lib/reader');
const types = require('../lib/types');
const expect = require('chai').expect;

describe('reader', function() {
  it('read numbers', function() {
    expect(reader.read_str('12345')).to.equal(12345);
  });

  it('read strings', function() {
    expect(reader.read_str('"hello"')).to.equal("hello");
  });

  it('read symbols', function() {
    expect(reader.read_str(':yolo')).to.equal(Symbol.for("yolo"));
    expect(reader.read_str(':^')).to.equal(Symbol.for("^"));
    expect(reader.read_str('Hello.Ghost')).to.equal(Symbol.for("Hello.Ghost"));
  });

  it('read nil', function() {
    expect(reader.read_str('nil')).to.equal(null);
  });

  it('read booleans', function() {
    expect(reader.read_str('true')).to.equal(true);
    expect(reader.read_str('false')).to.equal(false);
  });

  it('read list', function() {
    expect(reader.read_str('[1, 2, 3]')).to.deep.equal([1, 2, 3]);
  });

  it('read tuple', function() {
    expect(reader.read_str('{ 1, 2, 3 }')).to.deep.equal(new types.Tuple(1, 2, 3));
  });
});
