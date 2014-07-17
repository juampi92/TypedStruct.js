var structs = (function() {
  var structList = {},
    types = {
      // Initialize basic formats
      'byte':   [ 1, 'getInt8' ],
      'Ubyte':  [ 1, 'getUint8' ],
      'char':   [ 1, 'getInt8' ],
      'short':  [ 2, 'getInt16' ],
      'Ushort': [ 2, 'getUint16' ],
      'int':    [ 4, 'getInt32' ],
      'Uint':   [ 4, 'getUint32' ],
      'long':   [ 4, 'getInt32' ],
      'Ulong':  [ 4, 'getUint32' ],
      'float':  [ 4, 'getFloat32' ],
      'double': [ 8, 'getFloat64' ]
    };

  return {
    add: function(struct,obj){
      structList[struct] = obj;
    },
    sizeof: function(struct){
      // Working on it
    },
    create: function(struct,view,offset){
      // Working on it
    }
  };
})();

if(typeof(exports) !== 'undefined') {
    exports = structs;
}