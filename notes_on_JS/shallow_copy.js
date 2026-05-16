// Last week the term "shallow copy" was mentioned several times und you will
// encounter this term too if you look up JavaScript libraries.

// It is important to know this special kind of copy mechanism,
// because errors based on a wrong understanding of copy methods
// can lead to surprising program behaviour, which is hard to fix.

// JavaScript uses objects a lot and often you want to make a copy of an existing object.
// E. g. think about a default value, which is used while launching a program.
// We could write the following code:

const defaultValue = [{ x:0}];

// The following variable holds the data of the program:
let state; // not initialized yet.

// We launch the program and use the default value.
function launchProgram(){
    state = defaultValue;
};

// Our program can do some work on the state variable:
function work(){
    state[0].x++;
    console.log( state);
}

// Now we give our program the possibility to perform a reset:
// set the state variable back to default values.
function reset(){
    launchProgram();
};

// Let's test if it works:
function test(){
    launchProgram();
    work();
    reset();
    work();
};

console.log( " *** Running test");
test();
// You will see the following:
// [{ x: 1 }],  is OK: 0++ -> 1
// [{ x: 2 }],  *** But what's this? Why was the initialization not working? ***

// Can you find the error?
// The problem lies in line 19:
//    state = defaultValue;
// This assignment does not store a copy of the variable defaultValue in
// the variable state, but only stores a reference of the variable defaultValue.
// We can test this hypothesis:
console.log( " *** state == defaultValue ?");
console.log( state == defaultValue); // -> true. Same reference.

// This means, that every change in the variable state immediately takes effect also
// in the variable defaultValue (in line 24)!
// This is not a shallow copy, it is simply a shared value by two references.
// Please be patient, the shallow copy will come soon.

// Notice, that we declared the variable defaultValue as a const in line 12.
// This only prevents changing the reference stored in the variable defaultValue,
// but not the object referenced by.

// Now we know the reason for the error, we concentrate on making a copy of an object.
// We don't repeat the whole program, but only show here the single assignments.

// We try to fix the bug and make explicitly a copy of the devaultValue.
// To make sure, that we have a new reference, we compare the two variables:

console.log( " *** Copy made with spread");
const defaultValue2 = [{ x:0}];
state = [ ...defaultValue2]; // copy made with the spread syntax.
console.log( state);  // [ { x: 0 } ]
console.log( state == defaultValue2); // -> false.  Two different references.
 
// Now change state:
state[0].x++;
console.log( " *** defaultValue2 unchanged ?");
console.log( defaultValue2); //  [ { x: 1 } ]   Oh no! The default value is changed again.
// Though state and defaultValue2 do not contain the same reference, something went wrong.

// Let's examine the first item of the array in each reference:
console.log( " *** state[0] == defaultValue2[0] ?");
console.log( state[0] == defaultValue2[0]); // true. Same reference.

// Now we get to the point: 
// In line 78 a new array was created (which is OK), but inside of the new
// array only the references of the old array were copied.
// This kind of copy mechanism is called a "shallow copy" and there are other methods,
// which perform no deep copy on arrays also:
//   slice, concat, from.
// So, use these methods with caution.

// To make a real deep copy use structuredClone():

console.log( " *** Copy made with structuredClone():");
const defaultValue3 = [{ x:0}];
state = structuredClone(defaultValue3); 
console.log( state);  // [ { x: 0 } ]
state[0].x++;
console.log( " *** defaultValue3 unchanged ?");
console.log( defaultValue3); //  [ { x: 0 } ]. Now it works!


// Two more examples on shallow copy

// Destructuring ~~~~~~~~~~~~~~~~~~~

console.log( " *** destruct");

const x = { y: { z: 0}};

let { y} = x; // shallow copy

console.log( "y:", y);

console.log( "x:", x);
y.z = 1; // also changes x.
console.log( "y:", y);
console.log( "x:", x);


// Array.push() ~~~~~~~~~~~~~~~~~~~~~

console.log( "\n *** Array.push()");

let a = [];
a.push( x); // shallow copy
console.log( "a:", a);
console.log( "x:", x);
a[0].y = 1; // also changes x.
console.log( "a:", a);
console.log( "x:", x);




