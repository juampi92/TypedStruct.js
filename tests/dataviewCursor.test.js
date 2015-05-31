var should = require('should');

var TypedStruct = require('../typedstruct.js');

describe('DataViewCursor', function() {

  var ab = new ArrayBuffer(16);
  var uint8 = new Uint8Array(ab, 0, 4);
  uint8.set([0x1, 0x2, 0x3, 0x4]);
  var uint16 = new Uint16Array(ab, 4, 2);
  uint16.set([0x1111, 0x2222]);
  var uint32 = new Uint32Array(ab, 8, 1);
  uint32.set([0xFFFFFFFF]);

  var dv = new DataView(ab);

  it('should work using the offset property', function() {
    TypedStruct.from(dv, 0).create('byte').should.be.equal(1);
    TypedStruct.from(dv, 1).create('byte').should.be.equal(2);
    TypedStruct.from(dv, 2).create('byte').should.be.equal(3);
    TypedStruct.from(dv, 3).create('byte').should.be.equal(4);
  });

  it('should create a cursor', function() {

    var DataViewCursor = TypedStruct.from(dv, 0);

    DataViewCursor.create('byte').should.be.equal(1);
    DataViewCursor.create('byte').should.be.equal(2);
    DataViewCursor.create('byte').should.be.equal(3);
    DataViewCursor.create('byte').should.be.equal(4);

    DataViewCursor.cursor.should.be.equal(4);

    DataViewCursor.create('Ushort').should.be.equal(4369); // 0x1111
    DataViewCursor.create('Ushort').should.be.equal(8738); // 0x2222

    DataViewCursor.cursor.should.be.equal(8);

    DataViewCursor.create('Uint').should.be.equal(4294967295); // 0xFFFFFFFF
  });

  it('should work the cursor modification', function() {
    var DataViewCursor = TypedStruct.from(dv, 0);

    DataViewCursor.create('byte').should.be.equal(1);
    DataViewCursor.cursor.should.be.equal(1);

    DataViewCursor.setCursor(2).cursor.should.be.equal(2);

    DataViewCursor.incrementCursor(2).cursor.should.be.equal(4);
  });

});