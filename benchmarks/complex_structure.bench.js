var TypedStruct = require('../typedstruct.js');
var jParser = require('jParser');
var fs = require('fs');

// Tests:
function run(parser, dataViewCursor) {
  console.log('*** Complex Structure Test ****');

  console.time('jParser');
  console.log(parser.parse('file'));
  console.timeEnd('jParser');

  console.time('TypedStruct');
  dataViewCursor.create('file');
  console.timeEnd('TypedStruct');
}


fs.readFile('./benchmarks/file', function(err, buffer) {
  if (err)
    return;

  var parser = new jParser(buffer, {
    file: {}
  });

  TypedStruct.add('file', {});
  var dataViewCursor = TypedStruct.from(new DataView(new ArrayBuffer(buffer)));

  run(parser, dataViewCursor);
});