// TypeScript code for the board

const debug: boolean = false;

export const emptyStrArray: string[] = [] as string[];

const first_arr_index: number = 0;
const newline: string = "\n";

// Positions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const min_row: number = 0;
const max_row: number = 7;    

const min_col: number = 0;
const max_col: number = 7;

function from_to( a: number, b: number): number[]{
    let ab: number[] = [];
    for( let n = a; n <= b; n++){
        ab.push( n);
    };
    return ab;
};

const all_rn: number[] = from_to( min_row, max_row);
const all_cn: number[] = from_to( min_col, max_col);

export type pos_t = { row: number, col: number};

function eq_pos( p: pos_t, q: pos_t): boolean{
    return (
        p.row == q.row && p.col == q.col
    );
};

function pos_outside( p:pos_t): boolean {
    return (
        p.row < min_row ||
        p.row > max_row ||
        p.col < min_col ||
        p.col > max_col);
};

function influence( p: pos_t, q: pos_t): boolean{
    return(
        p.row == q.row ||
        p.col == q.col ||
        Math.abs( p.row - q.row) == Math.abs( p.col - q.col)
    );
};


// Direction ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

type dir_t = {
    row: -1 | 0 | 1,
    col: -1 | 0 | 1
};

function eq_dir( d1: dir_t, d2: dir_t): boolean{
    return(
        d1.row == d2.row && d1.col == d2.col
    )
};

const dir_n: dir_t = { row:-1,col:0};
const dir_ne: dir_t = { row:-1,col:1};
const dir_e: dir_t = { row:0,col:1};
const dir_se: dir_t = { row:1,col:1};
const dir_s: dir_t = { row:1,col:0};
const dir_sw: dir_t = { row:1,col:-1};
const dir_w: dir_t = { row:0,col:-1};
const dir_nw: dir_t = { row:-1,col:-1};

function dir2str( d: dir_t): string{
    if( eq_dir( d, dir_n)) return "n";
    if( eq_dir( d, dir_ne)) return "ne";
    if( eq_dir( d, dir_e)) return "e";
    if( eq_dir( d, dir_se)) return "se";
    if( eq_dir( d, dir_s)) return "s";
    if( eq_dir( d, dir_sw)) return "sw";
    if( eq_dir( d, dir_w)) return "w";
    if( eq_dir( d, dir_nw)) return "nw";
    return "";
};

const all_dirs: dir_t[] =
    [ dir_n, dir_ne, dir_e, dir_se, dir_s, dir_sw, dir_w, dir_nw];

function pos2dirs( p: pos_t): dir_t[]{
    // Four corners
    if( p.row == min_row && p.col == min_col)
        return [ dir_s, dir_se, dir_e];
    if( p.row == min_row && p.col == max_col)
        return [ dir_w, dir_sw, dir_s];
    if( p.row == max_row && p.col == min_col)
        return [ dir_n, dir_ne, dir_e];
    if( p.row == max_row && p.col == max_col)
        return [ dir_n, dir_nw, dir_w];
    // Rows and columns at the edge:
    if( p.row == min_row)
        return [ dir_w, dir_sw, dir_s, dir_se, dir_e];
    if( p.row == max_row)    
        return [ dir_n, dir_nw, dir_w, dir_ne, dir_e];
    if( p.col == min_col)
        return [ dir_n, dir_ne, dir_e, dir_se, dir_s];
    if( p.col == max_col)
        return [ dir_n, dir_nw, dir_w, dir_sw, dir_s];
    // Square in the middle:
    return all_dirs;
};

function move_pos( p:pos_t, d:dir_t): pos_t {
    return ({
        row: p.row + d.row,
        col: p.col + d.col
    })
};


// Identifier ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const col2char: string = "abcdefgh";
const char2col: Record< string, number> = {
    "a": 0,
    "b": 1,
    "c": 2,
    "d": 3,
    "e": 4,
    "f": 5,
    "g": 6,
    "h": 7
};

function pos2Id( p: pos_t): string{
    return (
        col2char[ p.col] + (p.row + 1).toLocaleString()
    );
};

function id2pos( s:string): pos_t {
    // s = <col>:char <row>:nat
    const col_pos: number = first_arr_index;
    const row_pos: number = col_pos + 1;
    return ({
        col: char2col[ s[ col_pos]],
        row: Number( s[ row_pos]) - 1
    })
};


// Colour ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export type colour_t = "white" | "black" | "";
const no_colour: colour_t = "";

export function other_colour( c:colour_t): colour_t {
    switch (c) {
        case "white":
            return "black";
        case "black":
            return "white";
        default:
            return c;
    }
};

function char2colour( c:string): colour_t {
    switch (c) {
        case "●":
            return "white";
        case "○":
            return "black";
        default:
            return no_colour;
    }
};

function colour2char( c: colour_t): string{
    switch( c){
        case "white":
            return "○";
        case "black":
            return "●";
        default:
            return "-";
    }
};


// Field ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

type field_t = Record< number, Record< number, colour_t>>;

function field2StrArray( f:field_t): string[]{
    let sa: string[] = [];
    let rs: string;
    for( let rn of all_rn){
        rs = "";
        for( let cn of all_cn){
            rs += colour2char( f[ rn][ cn]);
        };
        sa.push( rs);
    };
    return sa;
};

function strArray2Field( sa: string[]): field_t{
    // Given an array with length eight, where each string has the length eight
    // return the corresponding board. Each character is translated according to
    // the function char2colour.
    let b: field_t = {};
    for( let rn of all_rn){
        let cl: string[] = sa[ rn].split("");
        let nr:Record< number, colour_t> = {};
        for( let cn of all_cn){
            nr[ cn] = char2colour( cl[ cn]);
        };
        b[ rn] = nr;
    };
    return b;
};

function field2str( f: field_t): string{
    let s: string = " ";
    for( let cn of all_cn){
        s += col2char[ cn];
    };
    s += newline;
    for( let rn of all_rn){
        s += (rn + 1).toString(10);
        for( let cn of all_cn){
            s += colour2char( f[ rn][ cn]);
        };
        s += (rn + 1).toString(10);
        s += newline;
    };
    s += " ";
    for( let cn of all_cn){
        s += col2char[ cn];
    };
        s += newline;
    return s;
};

type stones_t = Record< colour_t, number>;

function stones2Str( s: stones_t): string{
    return(
        colour2char( "white") + ": " + s[ "white"] + ", "
        + colour2char( "black") + ": " + s[ "black"] + newline
    )
};

function count_colour( c: colour_t, f: field_t): number{
    let cc: number = 0;
    for( let rn of all_rn){
        for( let cn of all_cn){
            if( f[ rn][ cn] == c){
                cc++;
            }
        }
    };
    return cc;
};

function compute_stones( f: field_t): stones_t{
    return ({
        "white": count_colour( "white", f),
        "black": count_colour( "black", f),
        "": 0
    })
};

function is_free( p: pos_t, f: field_t): boolean{
    return (
        f[ p.row][ p.col] == no_colour
    )
};

function at_least_one_neighbour_set( p: pos_t, f: field_t): boolean{
    let alons: boolean = false;
    for( let d of pos2dirs( p)){
        const q: pos_t = move_pos( p, d);
        if( ! is_free( q, f)){
            alons = true;
            break;
        }
    };
    return alons;
};

function free_neighbours( p: pos_t, f: field_t): pos_t[]{
    return (
        pos2dirs( p).map( (d:dir_t) => {
            return move_pos( p, d);
        }).filter( (q: pos_t) => {
            return( is_free( q, f))
        })
    )
};

// Square ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export type square_t = {
    id: string,
    col: colour_t
};

function field2SquareList( f: field_t): square_t[]{
    let sl: square_t[] = [];
    for( let rn of all_rn){
        for( let cn of all_cn){
            sl.push({
                id: pos2Id({ row: rn, col: cn}),
                col: f[ rn][ cn]
            })
            }
        };
    return sl;
};

// To be used to draw the initial state of the board.
export let square_list: square_t[];


// Chains ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

type chain_t = {
    col: colour_t,
    pl: pos_t[]
};

const empty_chain: chain_t = {
    col: no_colour,
    pl: []
};

function check_chain( p: pos_t, d: dir_t, f: field_t): colour_t{
    // Check for a chain for a candidate at position p.
    let cp: pos_t = move_pos( p, d); 
    let cc: colour_t = f[ cp.row][ cp.col];
    if( cc == no_colour) return no_colour; // empty field
    let cont: boolean = true;
    while( cont){
        if( pos_outside( cp)){ // Outside of the board. No chain.
            return no_colour;
        };
        switch ( f[ cp.row][ cp.col]){
            case no_colour: // Empty square. No chain.
                return no_colour;
            case cc: // Follow the chain:
                break;
            default: // other colour: chain found.
                return other_colour( cc);
        };
        cp = move_pos( cp, d);
    };
    return cc; 
};

function collect_chain( p: pos_t, d: dir_t, oc: colour_t, f: field_t): chain_t{
    // console.log( "coll.ch: " + pos2Id(p) + " " + dir2str( d));

    let cp: pos_t = move_pos( p, d); 
    let cont: boolean = true;
    let pl: pos_t[] = [];
    while( cont){
        if( pos_outside( cp)){ // Outside of the board. No chain.
            pl = [];
            break;
        };
        switch ( f[ cp.row][ cp.col]){
            case no_colour: // Empty square. No chain.
                pl = [];
                cont = false;
                break;
            case oc: // Still other colour. Collect position. 
                pl.push( cp);
                break;
            default: // Own colour. Chain of stones to be turned.
                cont = false;
        };
        cp = move_pos( cp, d);
    };
    // console.log( "  pl:" + pl.map( pos2Id).join(","));
    
    if( pl.length == 0) {
        return empty_chain;
    }else{
        return ({
            pl: pl,
            col: oc
        })
    }
};


// Candidates ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// A candidate is a field (denoted by its position) which satisfies the following conditions:
//  1. is free;
//  2. has at least one neighbour, which is not free.

type candidate_t = {
    pos: pos_t,
    cols: Record< colour_t, boolean>
};

function cand2str( c: candidate_t): string{
    return (
        pos2Id( c.pos) + ": " +
        ( c.cols[ "white"] ? "●" : "") + " " +
        ( c.cols[ "black"] ? "○" : "")
    )
};

function new_candidate( p: pos_t): candidate_t{
    return ({
        pos: p,
        cols: {
            "white": false,
            "black": false,
            "": false
        }
    })
};

function update_candidate( c: candidate_t, f: field_t): candidate_t{
    const cp: pos_t = c.pos;
    c.cols[ "white"] = false;
    c.cols[ "black"] = false;
    for( let d of pos2dirs( cp)){
        const co: colour_t = check_chain( cp, d, f);
        c.cols[ co] = true;
        if( c.cols[ "white"] && c.cols[ "black"])
            break;
    };
    return c;
};

function pos2candidate( p: pos_t, f: field_t): candidate_t{
    return (
        update_candidate( new_candidate( p), f)
    );
};

function candidates2str( cl: candidate_t[]): string{
    return( cl.map( cand2str).join( newline));
};

function compute_candidates( f: field_t): candidate_t[]{
    let cl: candidate_t[] = [];
    for( let rn of all_rn){
        for( let cn of all_cn){
            const p: pos_t = { row: rn, col: cn};
            if( (f[ p.row][ p.col] == no_colour) &&
                at_least_one_neighbour_set( p, f)){
                cl.push( pos2candidate( p, f))
            }
        }
    };
    return cl;
};

function remove_candidate( p: pos_t, cl: candidate_t[]): candidate_t[]{
    return (
        cl.filter( (c:candidate_t) => {
            return ( !( eq_pos( c.pos, p)));
        })
    )
};

function add_candidate( p: pos_t, cl: candidate_t[]): candidate_t[]{
    let cl2: candidate_t[] = remove_candidate( p, cl);    
    cl2.push( new_candidate( p));
    return cl2;
};

// Moves ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

type moves_t = Record< colour_t, string[]>;

function getMoves( co: colour_t, cl: candidate_t[]): string[]{
    return (
        cl.filter( (c:candidate_t) => {
            return c.cols[ co] ;
        }).map( (c:candidate_t) => {
            return pos2Id( c.pos);
        }));
};

function compute_moves( cl: candidate_t[]): moves_t{
    return({
        "white": getMoves( "white", cl),
        "black": getMoves( "black", cl),
        "": []
    })
};


// Board ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

type board_t = {
    field: field_t,
    stones: stones_t,
    candidates: candidate_t[],
    moves: moves_t
};

export function board2StrArray( b: board_t): string[]{
    return(
        field2StrArray( b.field)
    );
};

function board2str( b: board_t): string{
    return(
        field2str( b.field) +
        stones2Str( b.stones) 
        // + candidates2str( b.candidates)
    )
};

function update_candidates( p: pos_t, pl: pos_t[], b: board_t): void{
    // console.log("rem: " + pos2Id( p));
    b.candidates = remove_candidate( p, b.candidates);
    free_neighbours( p, b.field).map( (q: pos_t) => {
        // console.log( "add: " + pos2Id(p));
        b.candidates = add_candidate( q, b.candidates);
    });
    b.candidates =
        b.candidates.map( (c:candidate_t) => {
            const cp: pos_t = c.pos;
            if( pl.some( (q: pos_t) => { return ( influence( q, cp)) })){
                // console.log("upd: " + pos2Id( c.pos));            
                return update_candidate( c, b.field);
            }else{
                return c;
            }
        });
};

function update_moves( b: board_t): void{
    b.moves = compute_moves( b.candidates);
};

export let curr_board: board_t;

export function set_curr_board( b: board_t): void{
    curr_board = b;
};


// Set a stone ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function setStones( c: colour_t, pl: pos_t[], b: board_t){
    pl.map( (p:pos_t) =>
        b.field[ p.row][ p.col] = c
    );
    const pll: number = pl.length;
    b.stones[ c] += pll;
    b.stones[ other_colour( c)] -= (pll - 1);
};

export function setStone( id: string, c: colour_t, b: board_t): string[] {
    const p: pos_t = id2pos( id);
    let turn_pos: pos_t[] = [ p];
    for( let d of pos2dirs( p)){
        turn_pos =
            turn_pos.concat( 
                collect_chain( p, d, other_colour( c), b.field).pl);
    };
    setStones( c, turn_pos, b);
    // console.log( "set stones: " + turn_pos.map( pos2Id).join( " ") + newline);
    // console.log( candidates);
    
    update_candidates( p, turn_pos, b);
    // candidates = compute_candidates( curr_board);
    update_moves( b);
    // console.log( board2str( b));
    
    return (
        turn_pos.map( pos2Id));
};


// Current state ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export type state_name_t =
    "normal" | "drawn" | "blocked" | "winner";

export type state_t = {
    name: state_name_t;
    col?: colour_t // used for blocked and winner.
};

export function determine_state( b: board_t): state_t {
    const nwm: number = b.moves[ "white"].length;
    const nbm: number = b.moves[ "black"].length;
    if( nwm > 0 && nbm > 0){
        return { name: "normal"};
    };
    if( nwm == 0 && nbm > 0){
        return { name: "blocked", col: "white"}
    };
    if( nwm > 0 && nbm == 0){
        return { name: "blocked", col: "black"}
    }; // nwm = nbm = 0.
    const nws: number = b.stones[ "white"];
    const nbs: number = b.stones[ "black"];
    if( nws == nbs){
        return { name: "drawn"};
    };
    if( nws > nbs){
        return { name: "winner", col: "white"};
    }else{ // nws < nbm
        return { name: "winner", col: "black"};
    };
};


// Evaluate state ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const state_value_winner: number = 100;
// const state_value_drawn: number = 80;
const state_value_loser: number = -100;
// const state_value_blocked_bonus: number = 10;

let eb_count: number = 0;

function evaluate_board( b: board_t): number{
    if( debug){
        eb_count++;
    };
    const st: state_t = determine_state( b);
    switch ( st.name){
        case "winner":
            if( st.col == "white"){
                return state_value_winner;
            }else{
                return state_value_loser;
            }
        case "drawn":
        case "blocked":
        case "normal":
            return( b.stones[ "white"] - b.stones[ "black"]);
        default:
            alert( "evaluate_board: unknown state: " + st.name);
            return state_value_loser;
    }
};


// Negamax algorihtm with alpha-beta pruning ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// min(a, .. , b) = -max(-b, .., -a)

let colour2Ext: Record< colour_t, number> = {
    "white": 1,
    "black": -1,
    "": 0
};

type result = {
    move: string; // position
    value: number
};


function find_negamax_move( b: board_t, c:colour_t, d: number, ɑ: number, β: number): result{
    if( debug){
        console.log( " *** Find: d = " + d + ", c = " + c );
        console.log( board2str(b));    
    }
    
    if( d === 0){
        if( debug){
            console.log( " *** Result(" + d + "," + c + ") v = " + evaluate_board( b));
        };
        return { move: "", value: evaluate_board( b)};
    };

    // d > 0
    const st: state_t = determine_state( b);
    switch ( st.name){
        case "winner":
        case "drawn":
            if( debug){
                console.log( " *** Result(" + d + "," + c + "): m = " + "" + " v = " + evaluate_board( b));
            };
            return { move: "", value: evaluate_board( b)};
        case "blocked":
            if( st.col == c){
                return find_negamax_move( b, other_colour( c), d - 1, ɑ, β);
            };
            // continue with search
            break;
        case "normal":
            break; // at least one move
        default:
            alert( "find_negamax_move: unknown state: " + st.name);
            return { move: "", value: state_value_loser};
    };
    
    let cm: string[] = b.moves[ c];
    let b_m: board_t;
    
    const ext: number = colour2Ext[ c];
    let al: number = ɑ;
    let be: number = β;

    let max_m: string = "";
    let max_v: number = state_value_loser;

    for( let m of cm){
        if( debug){
            console.log( "  Examine move(" + d + ") m = " + m);
        }
        b_m = structuredClone( b);
        setStone( m, c, b_m);
        let { value: v} = find_negamax_move( b_m, other_colour( c), d - 1, al, be);
        let nv: number = ext * v;

        if( nv === state_value_winner){
            if( debug){
                console.log( " *** Result(" + d + "," + c + "): m = " + m + " v = " + nv);
            };
            return({
                move: m,
                value: nv
            })
        };
        if( nv > max_v){
            max_m = m;
            max_v = nv;
        };
        
        if( ext > 0){
            if( max_v >= be) break; // beta cut
            al = Math.max( al, max_v);
        }else{ // ext < 0
            if( ext * max_v <= al) break; // alpha cut
            be = Math.min( be, ext * max_v);
        }
    };
    if( debug){
        console.log( " *** Result(" + d + "," + c + "): m = " + max_m + " v = " + max_v);
    };
    return({
        move: max_m,
        value: ext * max_v
    })    
};



// Computer strength ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const computer_strength_min = 0;
export const computer_strength_max = 5;

export let computer_strength: number = computer_strength_min;

export function set_computer_strength( s: number){
    computer_strength = s;
};


// Compute move ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export function find_move( c:colour_t, b: board_t): string{
    // Assumption: there exists at least one move for colour c.
    eb_count = 0;
    if( computer_strength == computer_strength_min){
        // choose move randomly
        const ms: string[] = b.moves[ c];
        return(
            ms[ Math.floor( ms.length * Math.random())]
        );
    }else{
        if( debug){
            console.log( " *** negamax");
        };
        
        let { move:m2} = find_negamax_move( b, c, computer_strength, state_value_loser, state_value_winner);
        if( debug){
            console.log( eb_count);
        };        
        return m2;
    };
};

export function compute_move( c:colour_t, b: board_t): string[]{
    // Assumption: there exists at least one move for colour c.
    let m: string = find_move( c, b);
    return (
        setStone( m, c, b)
        );
};


// Initialization ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export function strArray2Board( s: string[]): board_t{
    const f: field_t = strArray2Field( s);
    const cl: candidate_t[] = compute_candidates( f);
    return ({
        field: f,
        stones: compute_stones( f),
        candidates: cl,
        moves: compute_moves( cl)
    })
};

const start_board: board_t = 
        strArray2Board( [
            "        ",
            "        ",
            "        ",
            "   ●○   ",
            "   ○●   ",
            "        ",
            "        ",
            "        "]);

export function init_board( b: board_t = start_board){
    curr_board = structuredClone( b);
    
    square_list = field2SquareList( curr_board.field);
    // console.log( field2str( curr_board.field));
        
};
