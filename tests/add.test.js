var should = require('should');

var TypedStruct = require('../typedstruct.js');

describe('Add', function() {

  TypedStruct.add('point', {
    x: 'int',
    y: 'int',
    z: 'int'
  });

  it('should have added the structure', function() {
    TypedStruct._structs.should.have.property('point');
    TypedStruct._getStruct('point').should.be.an.instanceOf(Object);
  });

  it('should be a valid structure', function() {
    /*var intStruct = TypedStruct._getStruct('int'),
      pointStruct = TypedStruct._getStruct('point'),
      intSize = TypedStruct.sizeOf('int');

      console.log('a', intSize);

    should(intSize).be.equal(2);
    TypedStruct.getSize('point').should.be.equal()*/

    //Object.keys(pointStruct).guide.should.be.eql(['x', 'y', 'z']); // The order matthers
    //Object.keys(pointStruct).guide.should.not.be.eql(['y', 'x', 'z']); // The order matthers
  });
});