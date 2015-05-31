var should = require('should');

var TypedStruct = require('../typedstruct.js');

describe('UserTyped Structures', function() {

  TypedStruct.add('point', {
    z: 'int',
    y: 'int',
    x: 'int'
  });

  describe('Add Simple UserTyped Struct', function() {

    it('should have added the structure', function() {
      TypedStruct._structs.should.have.property('point');
      TypedStruct._getStruct('point').should.be.an.instanceOf(Object);
    });

    it('should instanciate the struct property', function() {
      var ab = new ArrayBuffer(3 * 4);
      var int32 = new Int32Array(ab, 0, 3);
      int32.set([0x1, 0x2, 0x3]);

      var dv = new DataView(ab);

      var struct = TypedStruct.from(dv, 0).create('point');

      struct.should.be.eql({
        z: 1,
        y: 2,
        x: 3
      });
    });
  });

  describe('Add UserTyped Struct that uses another UserTyped Struct', function() {

    TypedStruct.add('line', {
      start: 'point',
      end: 'point'
    });

    it('should have added the structure', function() {
      TypedStruct._structs.should.have.property('line');
      TypedStruct._structs.should.have.property('point');
      TypedStruct._getStruct('line').should.be.an.instanceOf(Object);
    });

    it('should instanciate the struct property', function() {
      var ab = new ArrayBuffer(6 * 4);
      var int32 = new Int32Array(ab, 0, 6);
      int32.set([0x1, 0x2, 0x3, 0x4, 0x5, 0x6]);

      var dv = new DataView(ab);

      var struct = TypedStruct.from(dv, 0).create('line');
      struct.should.have.properties('start', 'end');
      struct.start.should.be.eql({
        z: 1,
        y: 2,
        x: 3
      });
      struct.end.should.be.eql({
        x: 6,
        y: 5,
        z: 4
      });

    });
  });

})