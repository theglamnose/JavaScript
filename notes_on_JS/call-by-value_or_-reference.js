// Call-by-value or call-by-reference in JavaScript?

// If you make any changes to a parameter inside a function declaration, there are two different ways of handling it:
//   Call-by-value: the change of the parameter does not affect the value of the variable given in the function call.
//      This means, that only the value of the parameter is used.
//   Call-by-reference: the change of the parameter does affect the value of the variable given in the function call.
//      This means, that a reference of the parameter is used.

// JavaScript uses both concepts depending of the parameter type:
//   Call-by-value is used for simple types (integer, boolean, string, ...)
//   Call-by-reference is used for objects (But not always! Get ready for some surprises.).

// Some examples.
//   If you want to swap two variables, you might try the following code:
function swap( a, b) { // a and b of any type.
    let c = a;
    a = b;
    b = c; // a
};

// But this does not work, because call-by-value is used on simple types (integer):
let x = 0;
let y = 1;
swap( x, y);
console.log( "x:", x, ", y:", y); // Result x: 0, y: 1.

// Even if we wrap aound an object construct, nothing happens:
let u = { i:0};
let v = { i:1};
swap( u, v);
console.log( "u:", u, ", v:", v); // Result u:{i:0}, v:{i:1}
// The reason is, that we access the objects as a single value.
// In this case call-by-value is used again.

// So: what can we do?? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// But we can implement a swap function, if we use slot values inside the objects:
function swap_i( a, b) { // a and b of type {i:integer}
    let i = a.i;
    a.i = b.i;
    b.i = i; // a.i
};
let p = { i:0};
let q = { i:1};
swap_i( p, q);
console.log( "p:", p, ", q:", q); // Result p:{i:1}, q:{i:0}
// Now it works, but we have many braces.

// Btw: the slot access has to be used inside the swap function.
// So this won't work:
swap( p.i, q.i);
console.log( "p:", p, ", q:", q); // Result p:{i:1}, q:{i:0}

// It is better programming style to use only one object wrapper around the two parameters to be swapped:
function swap_obj( x) { // x is of type {a,b:integer}
    let i = x.a;
    x.a = x.b;
    x.b = i; // x.a
};
let ab = { a:0, b:1};
swap_obj( ab);
console.log( ab); // Result: { a: 1, b: 0 }

// But wait: we know, that an array is just an object with integers as slot names.
// So we can get rid of the slot names 'a' and 'b' by using an array:
function swap_arr( a){
    let i = a[ 0];
    a[ 0] = a[ 1];
    a[ 1] = i; // a[ 0]
};
let arr = [ 0, 1];
swap_arr( arr);
console.log( arr); // Result: [ 1, 0]
// So we can pass any number of variables to a function by using an array,
// so that each variable can be changed by a call-by-reference.

