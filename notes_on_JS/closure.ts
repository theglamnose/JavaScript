
// This is a TypScript file, which shows the nice aspects of using closures.

// Before we define the term "closure", we look at the following code:
let g: number = 2;

function genFun(): () => number {
    let g: number = 1;
    function f(): number{
        return g;
    };
    return f;
};

// I you look at the type annotation in line 7 you notice, that genFun takes no argument
// but returns a function of type "() => number".
// Let's generate a new function with genFun:
let newF: () => number =
    genFun();

// If you invoke newF then an interesting question arises with respect to line 10:
// what value is going to be taken for the variable g?
// There are two possibilities:
//  1. Because f was defined inside of genFun (the same scope), the variable in line 8 is used.
//  2. The function newF is executed on top-level and the scope of genFun is gone,
//     so the global variable in line 5 is used.
// Let's try it:
console.log( " *** genFun: which value of g?");
console.log( newF()); // Result: 1.
// This choice for the variable g is called lexical scoping, because the lexical structure
// of the program during development time is used.
// In some programming languages (e.g. old versions of Perl or Lisp) the global variable in line 5 is used,
// which is called dynamic scoping.

// OK, that's the rule, but what's so special about it?
// If you think a little bit further, you can ask the following question:
// * what, if f is allowed to change variable g?
//   Is the new value of g memorized somewhere?
//   This is a clever question, because one explanation of delivering the value in line 5
//   could be, that the value was just copied inside of the body of f during development time.
// Let's change the definition of our function producer:
function genFun2(): () => number {
    let g: number = 1;
    function f(): number{
        return g++; // change the value of g.
    };
    return f;
};
// We produce a new function and invoke it twice:
let newF2: () => number =
    genFun2();
console.log( " *** genFun2");
console.log( newF2()); // Result: 1.
console.log( newF2()); // Result: 2.

// So the variable g is attached as a real variable to the produced function newF2
// and persists during calls of newF2.
// This attachment of variables to a function, which persists during run-time, is
// called a closure.

// This gives us the possibility to write generator functions, which give
// for each call a new and defined value.
// One might say, that this not so interesting, because you can just define a global
// variable g, which is changed by the function newF2.
// Yes, this is possible, but with lexical scoping the variable g is hidden inside of newF2.
// And moreover, it is possible to define a set of functions, which operate in the same
// closure. The functions are visible to users calls, but the used lexical scope is hidden.

// Here is an example of a prime number generator, which offers two functions:
// 1. prime: return next prime.
// 2. reset: start next invocation with the first prime (2).

type PrimeGen = {
    reset: () => void,
    next: () => number
};

function genPrimeGen(): PrimeGen {
    const firstPrime: number = 2;
    let p: number = firstPrime;
    function reset(): void{
        p = firstPrime;
    };
    function divides( d: number, n: number): boolean{
        // Check, if d divides n.
        return( n % d === 0);
    };
    function isPrime( n: number): boolean{
        // Check, if n is prime.
        for( let d = 2; d * d <= n; d++){
            if( divides( d, n)) return false;
        };
        return true;
    };
    function next(): number{
        const oldP: number = p;
        for( let q = p + 1; true; q++){
            if( isPrime( q)){
                p = q;
                break;
            }
        };
        return oldP;
    };
    return { reset, next};
    // Shorthand for  { reset: reset, next: next}
};

// Set up the prime generator:
let primeGen: PrimeGen = genPrimeGen();

// Only the functions reset() and next() are visible to the outside world:
// @ts-ignore
console.log( primeGen.firstPrime); // Ignore type error: unknown property.
   // Result: undefined.

// Let's try it:
console.log( " *** First 10 prime numbers:");
for( let n = 1; n <= 10; n++){
    console.log( primeGen.next());
};

primeGen.reset();

console.log( " *** First 25 prime numbers:");
for( let n = 1; n <= 25; n++){
    console.log( primeGen.next());
};

    