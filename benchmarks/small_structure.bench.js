var TypedStruct = require('../typedstruct.js');
var jParser = require('jParser');


// Create the Data

var ab = new ArrayBuffer(8 * 4);
var int32 = new Int32Array(ab, 0, 8);
int32.set([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

var dataview = new DataView(ab);

// Creating the structure

// - TypedStruct
TypedStruct.add('simple_structure', {
  x: 'int',
  y: 'int',
  z: 'int'
});
var dataViewCursor = TypedStruct.from(dataview);

// - jParser
var parser = new jParser(ab, {
  'simple_structure': {
    x: 'uint32',
    y: 'uint32',
    z: 'uint32'
  }
});

// Tests:
var roundsArr = [1000, 5000, 10000, 20000],
  rounds;

console.log('*** Simple Structure Test ****');

for (var y = 0; y < roundsArr.length; y++) {
  rounds = roundsArr[y];
  console.log();
  console.log(' == ' + rounds + ' rounds == ');

  console.time('Rounds: ' + rounds + ': jParser');
  for (var i = 0; i < rounds; i++) {
    parser.seek(0);
    parser.parse('simple_structure');
  }
  console.timeEnd('Rounds: ' + rounds + ': jParser');

  console.time('Rounds: ' + rounds + ': TypedStruct');
  for (var i = 0; i < rounds; i++) {
    dataViewCursor.setCursor(0);
    dataViewCursor.create('simple_structure');
  }
  console.timeEnd('Rounds: ' + rounds + ': TypedStruct');


}