// Quicksort - demonstration of recursion

// This TypeScript file contains the implementation of the quicksort algorithm,
// which is also a nice demonstration of a powerful problem-solving technique: recursion.

// If you are new to TypeScript you will also see a powerful type notation to
// describe general functions: generic types.

// Recursion is not only a programming technique, but also a widely used method in mathematics
// to characterize complex structures (which is called inductive method).
// For computer science recursion can be used to break big problems into smaller ones,
// for which a solution can be found in an easier way. 

// In general, the recursion method works as follows to solve a big problem B:
// 1. Find an easy way to break problem B into a series of smaller problems B1,..,Bn,
//    which are all of the same kind as B. n is at least 1, but can also be greater number.
//    The important aspect is, that the breaking operation can be performed without great effort,
//    and if some solutions for B1,..,Bn can found, then these solutions can be combined to
//    build a solution for problem B.
// 2. Continue step 1 for each problem repeatedly until you have a set of problems E,
//    which all can be solved easily.
// 3. Solve all problems in E.
// 4. Going back the break operations in step 2 and combine the solutions Si until you build 
//    the solution S for problem B.
//    
//  Here is a small drawing to illustrate the method with n=2:
//    B                    → S
//    → B1             → S1
//        → B11   → S11     
//        → B12   → S12
//    → B2             → S2
//        → B21   → S21
//        → B22   → S22
//          ⇑ 
//          easy to solve

// Now let's apply the method to find a solution to sort an array.
// Look at the following sorted array.
//   [1,2,3,4,5,6,7]
// The array can be partitioned by its middle element 4:
//   [1,2,3] 4 [5,6,7]
//    A1        A2
// Now we have two smaller sorted arrays with the following property
//    all elements in A1 are smaller than 4
//    all elements in A2 are greater than 4
// We have found a way to characterize a sorted array by means of two smaller
// sorted arrays; this is a recursive definition!
// The easy situation is an array which is empty or with only one element.

// This recursive definition can also be used to sort an array.

// Here is the quicksort algorithm in pseudo code.
// We assume, that the array contains no duplicates to keep it simple.
//   Given an array A and a comparison function "<":
//     if A has less than two elements:
//        return A
//     else 
//       let E be an element in A
//       build two new arrays B and C with: 
//          B contains only elements e of A
//            with e < E
//          C contains only elements e of A
//            with E < e
//       sort B and C with Quicksort (recursive calls) 
//          with results B' and C'
//       return B' + [E] + C'

// This pseudo code can be implemented in TypeScript quiet easily
// because we can apply the higher-order function filter.

// We implement the sorting algorithm for arbitrary arrays with element type E.
// To sort an array, we need also a comparison function cmp with the following
// characteristic:
//    cmp: E * E → int; signature of the function
//                  ⎰  n; with n < 0 if a < b
//    cmp( a, b) = {   0; a = b
//                  ⎱  g; with 0 < g if a > b
// The signature of the comparison function can be translated in TypeScript
// right away:
type cmp_sig<E> = ( a:E, b:E) => number;
// The type definition of cmp_sig contains a type variable E.
// Due to this cmp_sig is called a "generic type".
// So, we are not only working on comparison functions on numbers.
// Any function, which fulfils the characteristic of cmp can be used;
// irrespective of the element type E. 
// E. g. the lexicographic comparison on strings.

// The sort function takes two arguments:
// 1. an array of element type E,
// 2. a comparison function, which operates on the same type E.
// In the following function definition note, that we use a type variable E
// to give the type of the array and the comparison function.
function quicksort <E> ( arr: E[], cmp: cmp_sig<E>): E[]{
    if( arr.length < 2) return arr;
    let el: E = arr[0];
    let smaller: E[] =
        arr.filter(
            (x:E) => { return( cmp( x, el) < 0)}); // x < el
    let greater: E[] =
        arr.filter(
            (x:E) => { return( 0 < cmp( x, el))}); // el < x
    return(
        quicksort( smaller, cmp)
        .concat( [el])
        .concat( quicksort( greater, cmp)));
};

// Let's try it:
let ar: number[] = [];
for( let n = 1; n <= 5; n++){
    // up to 5 random numbers of range 0 to 99 (no duplicates):
    let n: number = Math.floor( Math.random() * 100);
    if( ar.find( (e: number) => { return( e === n)})) continue;
    ar.push( n);
};
console.log( "ar:     " + ar);
console.log( "sorted: " + quicksort( ar, (a:number,b:number) => {return( a - b)}));


