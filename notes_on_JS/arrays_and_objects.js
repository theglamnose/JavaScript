// Arrays and objects are the same.
// The only difference is the restriction of the set of key values for arrays (0,1,..).

// You can simulate an array with an object:
let x = { '0':"a", '1':"b"};
console.log( x);
// To get access to the elements use square brackets:
console.log( x[ '0']); // result: a.
console.log( x[ 0]);   // result: a.
// The dot notation does not work here:
// console.log( x.'0'); // result: syntax error.
// console.log( x.0);   // result: syntax error.

// It seams, that strings are used as key values for objects,
// because the empty string can be used as an key value:
let a = { '':"no name"};
console.log( a);
console.log( a[ '']); // result: 'no name'.
// Also reserved words can be used as key values:
let b = { while:0, if:1, object:2, null:3, undefined:4};
console.log( b);
console.log( b.object); // result: 2.
console.log( b.null);   // result: 3.


// Otherwise around an array is an object, which uses integers as key values.
// But this means, that there can be holes in the key list:
let y = [];
y[ 1] = "a";
console.log( y[ 0]); // result: undefined.
console.log( y);     // result: list with a hole at position 0.
// The interesting thing is, that you can treat an array as an object
// with ARBITRARY key values:
let z = [];
z[ "oh_god"] = "yes?";
console.log( z);
// Because this array does not use numbers as key values,
// its length is 0, but at the same time it's not empty.
console.log( z.length); // result: 0.



