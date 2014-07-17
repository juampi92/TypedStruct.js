var structs = (function() {
  var structList = {},
    _types = {
      list: {
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
      },
      getSize: function(type){
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
    sizeof: function(struct){
      /*type = this.get(type);
      if ( type === undefined ) return 0;
      else if ( isNum(type) )
        return type;
      else {
        var sum = 0;
        for(var key in type)
          if(type.hasOwnProperty(key))
            sum += this.sizeof(key) * type[key] ;
        return sum;
      }*/
    },
    create: function(struct,view,offset){
      var strct = structList[struct],
        cursor = offset,
        aux = [],
        obj;
      
      if ( !strct ) { // Is basic type
        if ( !Array.isArray(struct) )
          return [ view[_types.getFunc(struct)](cursor,true) , cursor + _types.getSize(struct) ];
        else {
          var type = struct[0];
          obj = [];

          if ( struct[2] === undefined )
            for (var j = 0; j < struct[1]; j++) {
              aux = this.create(type,view,cursor);
              obj[j] = aux[0];
              cursor = aux[1];
            }
          else
            for (var m = 0; m < struct[1]; m++)
              for (var n = 0; n < struct[2]; n++) {
                aux = this.create(type,view,cursor);
                obj[m][n] = aux[0];
                cursor = aux[1];
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