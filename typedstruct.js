var structs = (function() {
  var structList = {},
    _types = {
      list: {
        // Initialize basic formats
        'byte':   [ 1, 'getInt8' ],
        'Ubyte':  [ 1, 'getUint8' ],
        'char':   [ 1, 'getUint8' ],
        'short':  [ 2, 'getInt16' ],
        'Ushort': [ 2, 'getUint16' ],
        'int':    [ 4, 'getInt32' ],
        'Uint':   [ 4, 'getUint32' ],
        'long':   [ 4, 'getInt32' ],
        'Ulong':  [ 4, 'getUint32' ],
        'float':  [ 4, 'getFloat32' ],
        'double': [ 8, 'getFloat64' ]
      },
      getSize: function(type){
        if ( !this.list[type] ) throw("Type " + type + " does not exist");
        return this.list[type][0];
      },
      getFunc: function(type){
        return this.list[type][1];
      }
    };

// Functions

  // isArray polyfill
  if(!Array.isArray) {
    Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }

  // Structure
  return {
    add: function(struct,obj){
      structList[struct] = obj;
    },
    sizeOf: function(struct){
      var strct = structList[struct], sum = 0;
      
      if ( !strct ) { // Is basic type
        if ( !Array.isArray(struct) )
          return _types.getSize(struct);
        else {
          var type = struct[0];

          sum = this.sizeOf(type) * struct[1];
          if ( struct[2] !== undefined ) sum *= struct[2];
          return sum;
        }
      } else {
        var obj = {};
        
        for (var i = 0, max_i = strct.length; i < max_i; i++)
          sum += this.sizeOf(strct[i][1]);
        return sum;
      }
    },
    create: function(struct,view,offset){
      var strct = structList[struct],
        cursor = offset,
        aux = [],
        obj;
      
      if ( !strct ) { // Is basic type
        if ( !Array.isArray(struct) ) {
          var out = view[_types.getFunc(struct)](cursor,true);
          if ( struct == 'char' ) out = String.fromCharCode(out);
          return [ out , cursor + _types.getSize(struct) ];
        } else {
          var type = struct[0];
          obj = [];

          if ( struct[2] === undefined )
            for (var j = 0; j < struct[1]; j++) {
              aux = this.create(type,view,cursor);
              obj[j] = aux[0];
              cursor = aux[1];
            }
          else
            for (var m = 0; m < struct[1]; m++) {
              obj[m] = [];
              for (var n = 0; n < struct[2]; n++) {
                aux = this.create(type,view,cursor);
                obj[m][n] = aux[0];
                cursor = aux[1];
              }
            }
          return [ obj , cursor ];
        }
      } else {
        obj = {};
        for (var i = 0, max_i = strct.length; i < max_i; i++) {
          aux = this.create(strct[i][1],view,cursor);
          obj[strct[i][0]] = aux[0];
          cursor = aux[1];
        }
      return [ obj , cursor ];
      }
    }
  };
})();

if(typeof(exports) !== 'undefined') {
    exports = structs;
}