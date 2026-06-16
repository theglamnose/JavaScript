
// Small demo, which shows the behavior of
//   * JSON.stringify() and
//   * JSON.parse()
// with respect to JavaScript constants.

const obj = {
    hex: 0xFF,
    bin: 0b11111111,
    oct: 0o377,
    dec: 255};
console.log( obj);
  // { hex: 255, bin: 255, oct: 255, dec: 255 }  
console.log( JSON.stringify( obj));
  // {"hex":255,"bin":255,"oct":255,"dec":255}  OK
console.log( JSON.parse( '{"hex":255,"bin":255,"oct":255,"dec":255}'));
  // { hex: 255, bin: 255, oct: 255, dec: 255 }  OK
// console.log( JSON.parse( '{"hex":0xFF,"bin":0b11111111,"oct":0o377,"dec":255}'));
  //                                 ^ parse error.  Not OK.
console.log( JSON.parse( '{"hex":"0xFF","bin":"0b11111111","oct":"0o377","dec":255}'));
  // { hex: '0xFF', bin: '0b11111111', oct: '0o377', dec: 255 }  it's OK, but not all are numbers.

console.log( " ~~~ NaN");  
const nan = { n: NaN};
console.log( nan);
  // { n: NaN }  
console.log( JSON.stringify( nan));
  // {"n":null}  not OK, because null and NaN are treated differently in numerical expressions:
console.log( 2 + NaN);   // NaN
console.log( 2 + null);  // 2
  // console.log( JSON.parse( '{"n":NaN}'));
  //                                ^ syntax error.

console.log( " ~~~ Infinity");  
const inf = { i: Infinity};  
console.log( inf);
  // { i: Infinity }
console.log( JSON.stringify( inf));
  // {"i":null} not OK, because Infinity and null are treated differently in numerical expressions:
console.log( 2 + Infinity);   // Infinity
console.log( 2 + null);       // 2
  // console.log( JSON.parse( '{"i":Infinity}'));
  //                                ^ syntax error.


console.log( " ~~~ null");
const null_value = { n: null};
console.log( null_value);
  // { n: null }  
console.log( JSON.stringify( null_value));
  // {"n":null}  OK
console.log( JSON.parse( '{"n":null}'));  
  // { n: null }  OK
    
console.log( " ~~~ undefined");
const undef_value = { u: undefined};
console.log( undef_value);
  // { u: undefined }  
console.log( JSON.stringify( undef_value));  
  // {}  not OK
  // console.log( JSON.parse( '{"i":undefined}'));
  //                                ^ syntax error.


console.log( " ~~~ Boolean");
const bool = { t: true, f: false};
console.log( bool);
  // { t: true, f: false }
console.log( JSON.stringify( bool));
  // {"t":true,"f":false}  OK
console.log( JSON.parse( '{"t":true,"f":false}'));    
  // { t: true, f: false } OK

