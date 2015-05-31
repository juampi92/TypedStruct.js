# TypedStruct.js

A simple plugin for Typed Structs in js for reading a binary file.

### Create Struct

```js
TypedStruct.add('struct_name', {
  // Property name : type
  'name_of_property': 'int',
  // Also you could use previously defined structures
  'sub_struct': 'sub_struct_name',
  // Or specify arrays. First you tell it's type, and then it's dimentions (as needed)
  'array_property': [ 'short' , 2 , 2 , ... ],
});
```

### Basic Types
    
```js
  // Name    bytes
  'byte':      1
  'Ubyte':     1
  'char':      1
  'short':     2
  'Ushort':    2
  'int' :      4
  'Uint':      4
  'long':      4
  'Ulong':     4
  'float':     4
  'double':    8
```

### Use

##### Create a struct

```js
 TypedStruct.add('point', {
   'x': 'int',
   'y': 'int',
   'z': 'int'
 });
```

Now, given a binary file (arrayBuffer) and a DataView:

```js
var dataview = DataView(arrayBuffer);

// Asuming that it's a binary content of one vector
var DataViewCursor = TypedStruct.from(dataview);
var point = DataViewCursor.create('point');

// Now the DataViewCursor is increased the size of the
//   point (in this case, each int is 4, so 3x4 = 24)
var cursor = DataViewCursor.cursor;

// Keep creating more structures, and never mind about
//   the cursor, as long as they are in order
var int = DataViewCursor.create('Uint');
```

##### LittleEndian 

Default value is `true`.
  
```js
structs.setLittleEndian(false);
```

##### Use DataView:

```js
var DataViewCursor = TypedStruct.from(dataview, starting_offset); // 0 by default

// Get the cursor position anytime
var cursor = DataViewCursor.cursor; // cursor = 0

 // Set the cursor position anytime
DataViewCursor.setCursor(10); // cursor = 10

// Increment the cursor position anytime
DataViewCursor.incrementCursor(15); // cursor = 15

// The cursor incremets itself when creating structures
DataViewCursor.create('int'); // cursor = 15 + 4 = 19
```

Except for create (which returns the created structure), every DataViewCursor method is chainable.

##### Create Arrays

```js
var DataViewCursor = TypedStruct.from(dataview, offset);

var array = DataViewCursor.create('int', 10);

// Now array is an Array of 10 integers
```

##### Char Support

If you create a char type, the output will be a single character in string format. If you create an array of chars, the result will be a string

### To-Do

 - MultiDimension arrays (currently none)
 - Strings for array of chars