import { assert } from 'chai';
import { typeOf } from '../src/typeof';

describe('typeOf', () => {
  it('should return the type of a string as \'string\'', () => {
    const type = typeOf('string');

    assert.equal(type, 'string');
  });

  it('should return the type of a number as \'number\'', () => {
    const type = typeOf(0);

    assert.equal(type, 'number');
  });

  it('should return the type of a bool as \'bool\'', () => {
    const type = typeOf(false);

    assert.equal(type, 'boolean');
  });

  it('should return the type of a object as \'object\'', () => {
    const type = typeOf({ abc: 'abc' });

    assert.equal(type, 'object');
  });

  it('should return the type of a array as \'array\'', () => {
    const type = typeOf(['a']);

    assert.equal(type, 'array');
  });

  it('should return the type of a promise as \'promise\'', () => {
    const type = typeOf((async () => { })());

    assert.equal(type, 'promise');
  });

  it('should return the type of a null as \'null\'', () => {
    const type = typeOf(null);

    assert.equal(type, 'null');
  });

  it('should return the type of a undefined as \'undefined\'', () => {
    const type = typeOf(undefined);

    assert.equal(type, 'undefined');
  });

  it('should return the type of a NaN as \'nan\'', () => {
    const type = typeOf(NaN);

    assert.equal(type, 'nan');
  });

  it('should return the type of a symbol as \'symbol\'', () => {
    const type = typeOf(Symbol('test'));

    assert.equal(type, 'symbol');
  });

  it('should return the type of a BigInt as \'bigint\'', () => {
    const type = typeOf(BigInt('0x1fffffffffffff'));

    assert.equal(type, 'bigint');
  });
});
