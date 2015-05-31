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
 *    TypedStruct.from(DataView, offset).create('structure_name', amount = 1);
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
       * @propery _structs
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

  var Struct = function(guide, native) {
    this.size = 0;
    this.guide = null;

    this.build(guide, native);
  };

  Struct.prototype.build = function(guide, native) {
    // Check if it's a native type
    if (native) {

      // Take the size from the guide
      this.size = guide.size;
      // If it's a char, pay spetial attention
      if (guide.type === 'char') {
        this.guide = this._nativeChar; // Check problems with this context
      } else {
        this.guide = DataViewProto[guide.type];
      }
      this.create = this._native;

      // Or if it's a user made structure
    } else {

      var cursor;
      this.guide = {};

      for (var prop in guide) {
        if (guide.hasOwnProperty(prop)) {
          cursor = TypedStruct._getStruct(guide[prop]);
          this.guide[prop] = cursor;
          this.size += cursor.size;
        }
      }
      this.create = this._create;
    }
  };

  Struct.prototype._create = function(dataViewCursor) {
    var guide = this.guide,
      out = {};
    for (var key in guide) {
      if (guide.hasOwnProperty(key)) {
        out[key] = guide[key](dataViewCursor);
      }
    }
    return out;
  };

  Struct.prototype._native = function(dataViewCursor) {
    var out = this.guide.call(dataViewCursor.dataView, dataViewCursor.cursor, TypedStruct._littleEndian);
    dataViewCursor.incrementCursor(this.size);
    return out;
  };

  Struct.prototype._nativeChar = function(cursor, littleEndian) {
    var out = DataViewInt8.call(this, cursor, littleEndian);
    if (out === 0) {
      return '';
    } else {
      return String.fromCharCode(out);
    }
  };

  Struct.prototype.factory = function() {
    var func = this.create.bind(this);
    func.size = this.size;
    return func;
  };


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

    for (var type in basicTypes) {
      if (basicTypes.hasOwnProperty(type)) {
        TypedStruct.add(type, basicTypes[type], true);
      }
    }
  })(TypedStruct);

  return TypedStruct;
}));