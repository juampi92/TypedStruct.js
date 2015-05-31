var should = require('should');

var TypedStruct = require('../typedstruct.js');

describe('Arrays', function() {

  var ab = new ArrayBuffer(8);
  var uint8 = new Uint8Array(ab, 0, 8);
  uint8.set([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

  var dv = new DataView(ab);

  describe('In the DataViewCursor', function() {
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
  });

  describe('In the Structure', function() {

    it('should work with one dimention array', function() {
      TypedStruct.add('struct_array_onedim', {
        'a': ['byte', 8]
      });
      var DataViewCursor = TypedStruct.from(dv, 0);

      var array = DataViewCursor.create('struct_array_onedim').a;
      array.length.should.be.equal(8);

      array.should.be.eql([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should work with two dimention array', function() {
      TypedStruct.add('struct_array_twodim', {
        'a': ['byte', 2, 4]
      });
      var DataViewCursor = TypedStruct.from(dv, 0);

      var array = DataViewCursor.create('struct_array_twodim').a;
      array.length.should.be.equal(2);

      array.should.be.eql([
        [1, 2, 3, 4],
        [5, 6, 7, 8]
      ]);
    });

    it('should work with three dimention array', function() {
      TypedStruct.add('struct_array_threedim', {
        'a': ['byte', 2, 2, 2]
      });
      var DataViewCursor = TypedStruct.from(dv, 0);

      var array = DataViewCursor.create('struct_array_threedim').a;
      array.length.should.be.equal(2);

      array.should.be.eql([
        [
          [1, 2],
          [3, 4]
        ],
        [
          [5, 6],
          [7, 8]
        ]
      ]);
    });

    it('should work with n dimention array', function() {
      // To DO
    });

    // Do some deep tests using private properties from the library
  });
});