var should = require('should');

var TypedStruct = require('../typedstruct.js');

describe('Arrays', function() {

  var ab = new ArrayBuffer(8);
  var uint8 = new Uint8Array(ab, 0, 8);
  uint8.set([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

  var dv = new DataView(ab);

  it('should return an array when creating', function() {
    var array = TypedStruct.from(dv, 0).create('byte', 8);
    array.should.be.an.instanceOf(Array);

    array.length.should.be.equal(8);
    array.should.be.eql([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('should return an array when creating using cursor', function() {
    var DataViewCursor = TypedStruct.from(dv, 0);

    DataViewCursor.create('byte', 3).should.be.eql([1, 2, 3]);
    DataViewCursor.cursor.should.be.equal(3);

    DataViewCursor.create('byte', 5).should.be.eql([4, 5, 6, 7, 8]);
    DataViewCursor.cursor.should.be.equal(8);
  });

  // Missing Array Testing of types (multidimentional)

});