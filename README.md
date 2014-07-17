TypedStruct.js
==============

A simple plugin for Typed Structs in js for reading a binary file.

Create Struct
=============

    structs.add('struct_name',[
      // Var name  -  Type
      [ 'nameofvar' , 'int' ],
      // Array name   - [   Type  - Dimentions ]
      [ 'nameofarray' , [ 'short' , 2 ] ],
      // Matrix name   - [   Type  - Dimentions ]
      [ 'nameofarray' , [ 'short' , 2 , 2 ] ],
    ]);

Basic Types
===========
    
    // Name   bytes
    'byte':   [ 1,    'getInt8' ],
    'Ubyte':  [ 1,    'getUint8' ],
    'char':   [ 1,    'getInt8' ],
    'short':  [ 2,    'getInt16' ],
    'Ushort': [ 2,    'getUint16' ],
    'int':    [ 4,    'getInt32' ],
    'Uint':   [ 4,    'getUint32' ],
    'long':   [ 4,    'getInt32' ],
    'Ulong':  [ 4,    'getUint32' ],
    'float':  [ 4,    'getFloat32' ],
    'double': [ 8,    'getFloat64' ]

Use
====

Coming soon...