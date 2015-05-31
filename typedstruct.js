/**
 * TypedStruct.js
 *
 *  Create C-like structs using javascript's ArrayBuffers and DataView.
 *  Transform bytes into meaningful structures.
 *
 *  HOW TO:
 *
 *  ----- Add Structure -----
 *    TypedStruct.add('structure_name', {
 *      'x': 'int',
 *      'y': 'int',
 *      'z': 'int'
 *    });
 *
 *  ----- Create Structure -----
 *    TypedStruct.from(DataView, offset = 0).create('structure_name', amount = 1);
 *
 */

(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.typedStruct = factory()
}(this, function() {
  'use strict';

  /**
   * Cache methods
   */
  var DataViewProto = DataView.prototype,
    DataViewInt8 = DataViewProto.getInt8,

    /**
     * ===== TypedStruct =====
     */

    /**
     * @class TypedStruct
     */
    TypedStruct = {
      /**
       * @property _littleEndian
       * @type {Boolean}
       * @default true
       */
      _littleEndian: true,
      /**
       * @method setLittleEndian
       * @param {Boolean} value
       */
      setLittleEndian: function(val) {
        this._littleEndian = val;
      },

      /**
       * Holds all the processed structs
       * @property _structs
       * @type {Object}
       */
      _structs: {},
      /**
       * @method _getStruct
       * @return {Struct}
       * @private
       */
      _getStruct: function(name) {
        var struct = this._structs[name];
        if (!struct) {
          throw ("TypedStruct: type '" + name + "' does not exist");
        }
        return struct;
      },
      /**
       * @method add
       * @param {String} name Name of struct
       * @param {Object} guide Guide for making the type
       * @param {Boolean} native If the struct is javascript native or a user made
       */
      add: function(name, guide, native) {
        if (this._structs[name]) {
          console.info('TypedStruct: you are adding the same structure: ' + name);
        }

        this._structs[name] = this._createStructure(guide, native);
      },

      /**
       * @method sizeOf
       * @param  {String} name Name of existing struct
       * @return {Number} Size of sruct in bytes
       */
      sizeOf: function(name) {
        return this._getStruct(name).size;
      },

      /**
       * Creates a DataViewCursor
       * @method from
       * @param  {DataView} dataView the DataView
       * @param  {Numeric} offset Start from
       * @return {DataViewCursor}
       */
      from: function(dataView, offset) {
        return new DataViewCursor(dataView, offset);
      },

      /**
       * @method _createStructure
       * @param {Object} guide
       * @param {Boolean} native If the struct is javascript native or a user made
       * @return {Function} Function that creates it's structures
       */
      _createStructure: function(guide, native) {
        var struct = new Struct(guide, native);
        return struct.factory();
      }

    };

  /**
   * ===== Struct =====
   */

  /**
   * @class Struct
   *
   * @constructor
   * @param {Object} guide Object specifying properties with it's types
   * @param {Boolean} native If the Struct is a native type or usermade
   */
  var Struct = function(guide, native) {
    this.size = 0;
    this.guide = null;

    this.build(guide, native);
  };

  /**
   * Calculates types, optimizes guide objects
   * using the structs for each property, and
   * creates native elements using DataViews methods
   * @method build
   * @param  {Object} guide
   * @param  {Boolean} native
   */
  Struct.prototype.build = function(guide, native) {
    // Check if it's a native type
    if (native) {

      // Take the size from the guide
      this.size = guide.size;
      // If it's a char, pay special attention
      if (guide.type === 'char') {
        this.guide = this._nativeChar; // Check problems with this context
      } else {
        this.guide = DataViewProto[guide.type];
      }
      this.create = this._native;

      // Or if it's a user made structure
    } else {

      this.guide = {};

      var prop,
        cursor,
        i = 0,
        keys = Object.keys(guide),
        klen = keys.length;
      for (; i < klen; i++) {
        prop = keys[i];
        cursor = this._getStructure(guide[prop]);
        this.guide[prop] = cursor;
        this.size += cursor.size;
      }
      this.create = this._create;
    }
  };

  /**
   * Tells if it's a structure, or an Array and returns it's generative Structure
   * @method _getStructure
   * @param  {String | Array} propertyGuide
   * @return {Function}
   */
  Struct.prototype._getStructure = function(propertyGuide) {
    var prop;
    if (typeof propertyGuide === 'string') {
      prop = TypedStruct._getStruct(propertyGuide);
    } else {
      prop = this._generateArray.apply(this, propertyGuide);
      prop.size = this._arraySize(propertyGuide);
    }
    return prop;
  };

  /**
   *
   * Optimized for up to 3 dimension arrays
   * @method _generateArray
   * @param  {String} type
   * @param  {Numeric} x
   * @param  {Numeric} y
   * @param  {Numeric} z
   * @return {Function}
   */
  Struct.prototype._generateArray = function(type, x, y, z) {
    var struct = TypedStruct._getStruct(type),
      argslen = arguments.length - 1;

    switch (argslen) {
      case 1:
        return this._arrays[1].bind(this, struct, x);
      case 2:
        return this._arrays[2].bind(this, struct, x, y);
      case 3:
        return this._arrays[3].bind(this, struct, x, y, z);
      default:
        return this._arrays.other.bind(this, struct, Array.prototype.slice.call(arguments, 1));
    }
  };

  /**
   * Calculates the byte size of the array
   * @method _arraySize
   * @param  {Array} properties
   * @return {Numeric}
   */
  Struct.prototype._arraySize = function(properties) {
    var type = TypedStruct._getStruct(properties[0]),
      sum = type.size * properties[i];
    for (var i = 2, len = properties.length; i < len; i++) {
      sum *= properties[i];
    }
    return sum;
  };

  /**
   * Optimized array-generative structures for 1, 2 and 3 dimentions
   * @property _arrays
   * @type {Object}
   */
  Struct.prototype._arrays = {
    '1': function(structure, x, dataViewCursor) {
      var out = [];
      for (var _x = 0; _x < x; _x++) {
        out[_x] = structure(dataViewCursor);
      }
      return out;
    },
    '2': function(structure, x, y, dataViewCursor) {
      var out = [],
        cursor,
        _x, _y;
      for (_x = 0; _x < x; _x++) {
        out[_x] = [];
        cursor = out[_x];
        for (_y = 0; _y < y; _y++) {
          cursor[_y] = structure(dataViewCursor);
        }
      }
      return out;
    },
    '3': function(structure, x, y, z, dataViewCursor) {
      var out = [],
        cursorx, cursory,
        _x, _y, _z;
      for (_x = 0; _x < x; _x++) {
        out[_x] = [];
        cursorx = out[_x];
        for (_y = 0; _y < y; _y++) {
          cursorx[_y] = [];
          cursory = cursorx[_y];
          for (_z = 0; _z < z; _z++) {
            cursory[_z] = structure(dataViewCursor);
          }
        }
      }
      return out;
    },
    'other': function(structure, dim, dataViewCursor) {
      // To Do
    },

  };

  /**
   * This method optimizes the DataView call for native types.
   * Returns a native struct and also increments the cursor for the DataView
   * @method _native
   * @param  {DataViewCursor} dataViewCursor
   * @return {Native Struct}
   * @private
   */
  Struct.prototype._native = function(dataViewCursor) {
    var out = this.guide.call(dataViewCursor.dataView, dataViewCursor.cursor, TypedStruct._littleEndian);
    dataViewCursor.incrementCursor(this.size);
    return out;
  };

  /**
   * Native method used for creating chars. This method is used as a DataView method, so this means the DataView
   * @method _nativeChar
   * @param  {Numeric} cursor
   * @param  {Boolean} littleEndian
   * @return {String}
   */
  Struct.prototype._nativeChar = function(cursor, littleEndian) {
    var out = DataViewInt8.call(this, cursor, littleEndian);
    if (out === 0) {
      return '';
    } else {
      return String.fromCharCode(out);
    }
  };

  /**
   * This method creates the structure using the optimized guide and the DataView to extract de binaries.
   * It's never showed. It's bindined using the factory as the constructor for the struct
   * @method _create
   * @param  {DataViewCursor} dataViewCursor
   * @return {Object} Returns the built structure
   * @private
   */
  Struct.prototype._create = function(dataViewCursor) {
    var guide = this.guide,
      out = {},
      prop;

    for (var i = 0, keys = Object.keys(guide), klen = keys.length; i < klen; i++) {
      prop = keys[i];
      out[prop] = guide[prop](dataViewCursor);
    }
    return out;
  };

  /**
   * This creates the struct in it's function way with it's size as public (no closure)
   * @method factory
   * @return {Function}
   */
  Struct.prototype.factory = function() {
    var func = this.create.bind(this);
    func.size = this.size;
    return func;
  };

  /**
   * ===== DataViewCursor =====
   */

  /**
   * @class DataViewCursor
   * @param {[type]} dataView [description]
   * @param {[type]} offset   [description]
   */
  var DataViewCursor = function(dataView, offset) {
    this.dataView = dataView;
    this.cursor = offset || 0;
  };

  /**
   * @method setCursor
   * @param {Numeric} val New position
   * @chainable
   */
  DataViewCursor.prototype.setCursor = function(val) {
    this.cursor = val;
    return this;
  };

  /**
   * @method incrementCursor
   * @param {Numeric} val Amount to increment
   * @chainable
   */
  DataViewCursor.prototype.incrementCursor = function(val) {
    this.cursor += val;
    return this;
  };

  /**
   * @method create
   * @param  {String} name Struct name
   * @param  {Number} amount [Optional] if greater than one, creates an array
   * @return {Object | Array} Struct, or array of Structs
   */
  DataViewCursor.prototype.create = function(name, amount) {
    var struct = TypedStruct._structs[name],
      output;

    // If there's amount, the function must return an array
    if (amount && amount > 1) {
      output = [];
      while (amount--) {
        output.push(struct(this));
      }
      return output;
    } else {
      return struct(this);
    }
  };


  // First run, convert basic types into structs
  (function(TypedStruct) {
    /**
     * Has the basic types of ArrayBuffer
     * @property basics
     * @type {Object}
     * @private
     */
    var basicTypes = {
      'byte': {
        size: 1,
        type: 'getInt8'
      },
      'Ubyte': {
        size: 1,
        type: 'getUint8'
      },
      'char': {
        size: 1,
        type: 'char' // it's really a getUint8
      },
      'short': {
        size: 2,
        type: 'getInt16'
      },
      'Ushort': {
        size: 2,
        type: 'getUint16'
      },
      'int': {
        size: 4,
        type: 'getInt32'
      },
      'Uint': {
        size: 4,
        type: 'getUint32'
      },
      'long': {
        size: 4,
        type: 'getInt32'
      },
      'Ulong': {
        size: 4,
        type: 'getUint32'
      },
      'float': {
        size: 4,
        type: 'getFloat32'
      },
      'double': {
        size: 8,
        type: 'getFloat64'
      }
    };

    for (var prop, i = 0, keys = Object.keys(basicTypes), klen = keys.length; i < klen; i++) {
      prop = keys[i];
      TypedStruct.add(prop, basicTypes[prop], true);
    }
  })(TypedStruct);

  return TypedStruct;
}));