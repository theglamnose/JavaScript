// Currying - some hot aspects of JavaScript

// If you have used a functional progamming language as for example ML or Lisp
// you may be familiar with a function transformation called currying and uncurrying.
// Though JaVaScript is not a pure functional programming language, it supports these transformations.

// Let's look at an example:
const l = [ 1, 2, 3];

// We define two functions, where each one takes a number n and returns a string
// of length n.
function multA( n) {
    // return "a..a" with length n
    let mc = "";
    for( let i = 1; i <= n; i++){
        mc += "a";
    };
    return mc;
};

function multB( n) {
    // return "b..b" with length n
    let mc = "";
    for( let i = 1; i <= n; i++){
        mc += "b";
    };
    return mc;
};

// Let's test the functions:
console.log( " ** multA and multB");
console.log( l.map( multA));
console.log( l.map( multB));
console.log( "~~~~~\n");

// We can generalize and define a function, which does the work of the two functions multA and multB:
function multChar( c, n) {
    // return "<c>..<c>" with length n
    let mc = "";
    for( let i = 1; i <= n; i++){
        mc += c;
    };
    return mc;
};

// We can use multChar to generate the two string arrays:
console.log( " ** multChar");
console.log( l.map( i => multChar( "a",i)));
console.log( l.map( i => multChar( "b",i)));
console.log( "~~~~~\n");

// It would be nice to get rid of the parameter i, but something like the following is not allowed:
//    l.map( multChar( "b",_)); 

// But we can construct a function, which consumes one argument after another, and
// at each consumption returns a new function.
// Let's wrap a new function "multCharCurry" around the old "multChar":
console.log( " *** multCharCurry");

const multCharCurry =
    c =>
        n =>
            multChar( c, n);

// The application of "multCharCurry" looks a little be nasty with all the braces,
// but it returns the same result as the "multChar":
console.log( multCharCurry("m")(2));   // Result: "mm", OK.

// Now we come to the advantage of the weird looking function "multCharCurry".
// We can apply "multCharCurry" to only one argument (a character c) and get a function,
// which returns strings of a given length filled with character c:
const multM = multCharCurry("m");
console.log( multM(2));   // Result: "mm", OK.

// And now we can use multCharCurry in the map call to the list l without the parameter i:
console.log( l.map( multCharCurry( "a"))); // no 'i' needed anymore.
console.log( "~~~~~\n");

// The function "multCharCurry" is called the curry version of "multChar".

// This works quiet good, but we had to define a second function "multCharCurry".
// It would be nice to curry a function on the fly during method invocation.
// And in fact this is possible in JavaScript.

console.log( " *** Curry function");

// We define a general curry function "Curry", which takes a function f
// as an argument and returns the curried version of f:
function Curry( f){
    return (
        x => y => f( x, y));
};

// Let's try it with "multChar":
console.log( l.map( Curry( multChar)("a")));
    // no 'i' needed anymore.
    // no extra definition of multCharCurry needed.
console.log( "~~~~~\n");

// We can do the transfomation of currying also the other way around:
// given a function, which takes its arguments one by one, we transform it
// to a function, which requires all its arguments in one tuple.

console.log( " *** Uncurry function");

function Uncurry( f){
    return (
        ( x, y) => f(x)(y)
    );
};
// Let's test it with the function "multCharCurry":
console.log( Uncurry( multCharCurry)("x",3)); // Result: "xxx".

console.log( " *** Finished.");




