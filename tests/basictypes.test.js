var should = require('should');

var TypedStruct = require('../typedstruct.js');

describe('Basic Types', function() {

  it('should have been added', function() {
    TypedStruct._structs.should.have.properties('byte', 'Ubyte', 'char', 'short', 'Ushort', 'int', 'Uint', 'long', 'Ulong', 'float', 'double');
  });

  it('should have the right sizes', function() {
    TypedStruct._getStruct('byte').size.should.be.eql(1);
    TypedStruct._getStruct('Ubyte').size.should.be.eql(1);
    TypedStruct._getStruct('char').size.should.be.eql(1);
    TypedStruct._getStruct('short').size.should.be.eql(2);
    TypedStruct._getStruct('Ushort').size.should.be.eql(2);
    TypedStruct._getStruct('int').size.should.be.eql(4);
    TypedStruct._getStruct('Uint').size.should.be.eql(4);
    TypedStruct._getStruct('long').size.should.be.eql(4);
    TypedStruct._getStruct('Ulong').size.should.be.eql(4);
    TypedStruct._getStruct('float').size.should.be.eql(4);
    TypedStruct._getStruct('double').size.should.be.eql(8);
  });

  it('should create the right structure for a byte', function() {
    var ab = new ArrayBuffer(4);
    var int8 = new Int8Array(ab, 0, 4);
    int8.set([0x10, 0x0F, 0xFF, 0xA8]); // 16 , 15 , -1, -88

    var dv = new DataView(ab);

    for (var i = 0; i < 4; i++) {
      TypedStruct.from(dv, i).create('byte').should.be.equal(int8[i]);
    };
  });

  it('should create the right structure for a Ubyte', function() {
    var ab = new ArrayBuffer(4);
    var uint8 = new Uint8Array(ab, 0, 4);
    uint8.set([0x10, 0x0F, 0xFF, 0xA8]); // 16 , 15 , 255, 168

    var dv = new DataView(ab);

    for (var i = 0; i < 4; i++) {
      TypedStruct.from(dv, i).create('Ubyte').should.be.equal(uint8[i]);
    };
  });

  it('should create the right structure for a char', function() {
    var ab = new ArrayBuffer(4);
    var uint8 = new Uint8Array(ab, 0, 4);
    uint8.set([0x4E, 0x69, 0x63, 0x65]); // Nice
    var string = ['N', 'i', 'c', 'e'];

    var dv = new DataView(ab);

    for (var i = 0; i < 4; i++) {
      TypedStruct.from(dv, i).create('char').should.be.equal(string[i]);
    };
  });

  it('should create the right structure for a short', function() {
    var ab = new ArrayBuffer(8);
    var int16 = new Int16Array(ab, 0, 2);
    int16.set([0x0110, 0xFFF0]); // 272, -16

    var dv = new DataView(ab);

    for (var i = 0; i < 2; i++) {
      TypedStruct.from(dv, i * 2).create('short').should.be.equal(int16[i]);
    };
  });

  it('should create the right structure for a Ushort', function() {
    var ab = new ArrayBuffer(4);
    var uint16 = new Uint16Array(ab, 0, 2);
    uint16.set([0x0110, 0xFFF0]); // 272, 65520

    var dv = new DataView(ab);

    for (var i = 0; i < 2; i++) {
      TypedStruct.from(dv, i * 2).create('Ushort').should.be.equal(uint16[i]);
    };
  });

  it('should create the right structure for a int and long', function() {
    var ab = new ArrayBuffer(8);
    var int32 = new Int32Array(ab, 0, 2);
    int32.set([0x011FF8400, 0xFFF0FF]);

    var dv = new DataView(ab);

    for (var i = 0; i < 2; i++) {
      TypedStruct.from(dv, i * 4).create('int').should.be.equal(int32[i]);
      TypedStruct.from(dv, i * 4).create('long').should.be.equal(int32[i]);
    };
  });

  it('should create the right structure for a Uint and Ulong', function() {
    var ab = new ArrayBuffer(8);
    var uint32 = new Uint32Array(ab, 0, 2);
    uint32.set([0x011FF8400, 0xFFF0FF]);

    var dv = new DataView(ab);

    for (var i = 0; i < 2; i++) {
      TypedStruct.from(dv, i * 4).create('Uint').should.be.equal(uint32[i]);
      TypedStruct.from(dv, i * 4).create('Ulong').should.be.equal(uint32[i]);
    };
  });


  it('should create the right structure for a float', function() {
    var ab = new ArrayBuffer(8);
    var float32 = new Float32Array(ab, 0, 2);
    float32.set([0x011FF8400, 0xFFF0FF]);

    var dv = new DataView(ab);

    for (var i = 0; i < 2; i++) {
      TypedStruct.from(dv, i * 4).create('float').should.be.equal(float32[i]);
    };
  });

  it('should create the right structure for a double', function() {
    var ab = new ArrayBuffer(16);
    var float32 = new Float64Array(ab, 0, 2);
    float32.set([0x011FF8400011FF8400, 0xFFF0FFFFF0FF]);

    var dv = new DataView(ab);

    for (var i = 0; i < 2; i++) {
      TypedStruct.from(dv, i * 8).create('double').should.be.equal(float32[i]);
    };
  });
});