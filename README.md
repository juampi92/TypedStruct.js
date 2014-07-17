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
      [ 'nameofmatrix' , [ 'short' , 2 , 2 ] ],
    ]);

Basic Types
===========
    
    // Name   bytes
    'byte'    1
    'Ubyte'   1
    'char'    1
    'short'   2
    'Ushort'  2
    'int'     4
    'Uint'    4
    'long'    4
    'Ulong'   4
    'float'   4
    'double'  8

Use
====

Create a struct, for example

    structs.add('vector',[
      [ 'x' , 'int' ],
      [ 'y' , 'int' ],
      [ 'z' , 'int' ]
    ]);

Now, given a binary file (arrayBuffer) and a DataView, create an instance.

    var view = DataView(arrayBuffer);

    // Asuming that it's a binary content of one vector
    var vector = structs.create('vector',view,0);

    // Now vector is an array
    console.log(vector[0]); // Should output an object having 3 properties: x,y,z (all integers)

    console.log(vector[1]); // The next byte, after the vector.

To-Do
=====

 - get Sizeof
 - MultiDimension arrays (currently array and matrix)
