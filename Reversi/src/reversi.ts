// TypeSCript code for the main module:
// * event handler for the squares and buttons.

import "./reversi.sass";

import type { colour_t, state_t} from "./board.ts";
import {
    other_colour, 
    compute_move, find_move,
    computer_strength, computer_strength_min, computer_strength_max,
    set_computer_strength,
    setStone, 
    determine_state, 
    square_list, 
    init_board, curr_board, board2StrArray, strArray2Board
} from "./board.ts";

const first_list_index: number = 0;

const class_sel: string = ".";
const newline: string = "\n";

let user_colour: colour_t;
const user_colour_default: colour_t = "white";
let users_turn: boolean;
let user_cursor: string;

let computer_colour: colour_t;

type optHTMLElement = HTMLElement | null;
type optEventTarget = EventTarget | null;

const sec: number = 1000; // 1 sec. in ms.


// Wait ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const waitTime: number = 3; // seconds

function sleep( t: number): Promise<number>{
    return new Promise( res => setTimeout( res, t));
};


// Alert dialogue ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let alert_frame_el: optHTMLElement = document.getElementById( "alert_frame");
if( !alert_frame_el){
    alert( "Alert frame not found.");
    window.close();
};

let alert_question_el: optHTMLElement = document.getElementById( "alert_question");
if( !alert_question_el){
    alert( "Alert question not found.");
    window.close();
};

let alert_ok_el: optHTMLElement = document.getElementById( "alert_ok");
if( !alert_ok_el){
    alert( "Alert OK button not found.");
    window.close();
};

function alertDialogue( q: string): Promise<void>{
    return new Promise<void> (resolve => {
        alert_question_el!.innerHTML = q;
        alert_frame_el!.style.display = "flex";
        clear_keyboard();

        function alert_answer_ok(): void{
            close_dialogue();
            resolve();
        };
        alert_ok_el!.addEventListener( "click", alert_answer_ok);
        
        function keydown_handler( ke: KeyboardEvent): void {
            switch( ke.key){
                case "Enter":
                case "Escape":
                    alert_answer_ok();
                    break;
                default:
                    // ignore
            }                
        };
        document.addEventListener("keydown",keydown_handler);

        function close_dialogue(): void {
            alert_frame_el!.style.display = "none";
            alert_ok_el!.removeEventListener("click", alert_answer_ok);
            document.removeEventListener( "keydown", keydown_handler);
            set_up_keyboard();
        };
    })
};


// Confirm dialogue ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let confirm_frame_el: optHTMLElement = document.getElementById( "confirm_frame");
if( !confirm_frame_el){
    alert( "Confirm frame not found.");
    window.close();
};

let confirm_question_el: optHTMLElement = document.getElementById( "confirm_question");
if( !confirm_question_el){
    alert( "Confirm question not found.");
    window.close();
};

let confirm_yes_el: optHTMLElement = document.getElementById( "confirm_yes");
if( !confirm_yes_el){
    alert( "Confirm yes button not found.");
    window.close();
};

let confirm_no_el: optHTMLElement = document.getElementById( "confirm_no");
if( !confirm_no_el){
    alert( "Confirm no button not found.");
    window.close();
};
    
function confirmDialogue( q: string): Promise<boolean>{
    return new Promise<boolean> (resolve => {
        confirm_question_el!.innerHTML = q;
        confirm_frame_el!.style.display = "flex";
        clear_keyboard();

        function confirm_answer_yes(): void{
            close_dialogue();
            resolve(true);
        };
        confirm_yes_el!.addEventListener( "click", confirm_answer_yes);

        function confirm_answer_no(): void{
            close_dialogue();
            resolve(false);
        };
        confirm_no_el!.addEventListener( "click", confirm_answer_no);

        function keydown_handler( ke: KeyboardEvent): void {
            switch( ke.key){
                case "Enter":
                case "y":
                    confirm_answer_yes();
                    break;
                case "Escape":
                case "n":
                    confirm_answer_no();
                    break;
                default:
                    // ignore
            }                
        };
        document.addEventListener("keydown",keydown_handler);

        function close_dialogue(): void{
                confirm_frame_el!.style.display = "none";
                confirm_yes_el!.removeEventListener("click", confirm_answer_yes);
                confirm_no_el!.removeEventListener("click", confirm_answer_no);
                document.removeEventListener( "keydown", keydown_handler);
                set_up_keyboard();
            };
    })
};


// Input dialogue ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let read_number_frame_el: optHTMLElement = document.getElementById( "read_number_frame");
if( !read_number_frame_el){
    alert( "read_number frame not found.");
    window.close();
};

let read_number_heading_el: optHTMLElement = document.getElementById( "read_number_heading");
if( !read_number_heading_el){
    alert( "read_number heading not found.");
    window.close();
};

let read_number_input_el: HTMLInputElement = document.getElementById( "read_number_input") as HTMLInputElement ;
if( !read_number_input_el){
    alert( "read_number ok button not found.");
    window.close();
};

let read_number_ok_el: optHTMLElement = document.getElementById( "read_number_ok");
if( !read_number_ok_el){
    alert( "read_number input field not found.");
    window.close();
};

let read_number_cancel_el: optHTMLElement = document.getElementById( "read_number_cancel");
if( !read_number_cancel_el){
    alert( "read_number cancel button not found.");
    window.close();
};
    
type opt_number = number | null;

function readNumberDialogue( h: string, l: number, u: number, s: number): Promise<opt_number>{
    return new Promise<opt_number> (resolve => {
        read_number_heading_el!.innerHTML =
            h + "<br>[" + l.toString(10) + ".." + u.toString(10) + "]";
        read_number_input_el!.min = l.toString(10);
        read_number_input_el!.max = u.toString(10);
        read_number_input_el!.value = s.toString(10);
        read_number_frame_el!.style.display = "flex";
        clear_keyboard();

        function read_number_ok(): void{
                let inp: opt_number = Number( read_number_input_el!.value);
                if( inp){
                    if( l <= inp && inp <= u){
                        close_dialogue();
                        resolve( inp);
                    }else{ // np out of range
                        return;
                    }
                }else{ // inp is null
                    close_dialogue();
                    resolve( null);
                }
            };
        read_number_ok_el!.addEventListener( "click", read_number_ok);

        function read_number_cancel(): void{
                close_dialogue();
                resolve(null);
            };
        read_number_cancel_el!.addEventListener( "click", read_number_cancel);

        function keydown_handler( ke: KeyboardEvent): void {
            switch( ke.key){
                case "Enter":
                    read_number_ok();
                    break;
                case "Escape":
                    read_number_cancel();
                    break;
                default:
                    // ignore
            }                
        };
        document.addEventListener("keydown",keydown_handler);

        function close_dialogue(): void{
                read_number_frame_el!.style.display = "none";
                read_number_ok_el!.removeEventListener("click", read_number_ok);
                read_number_cancel_el!.removeEventListener("click", read_number_cancel);
                document.removeEventListener( "keydown", keydown_handler);
                set_up_keyboard();
            };

    })
};


// Stones on the board ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let board_el: optHTMLElement = document.getElementById( "board");
if( !board_el){
    alert( "Board not found.");
    window.close();
};

const stones: Record< colour_t, string> = {
    "white": "<img src=\"./pics/white_stone.svg\">",
    "black": "<img src=\"./pics/black_stone.svg\">",
    "": ""
};

const timeToInsertStone: number = 1; // in sec.

function insertStone( s: string, c: colour_t){
    // Draw increasing stone (duration 'timeToInsertStone' sec.) at position s with colour c.
    const se: optHTMLElement = document.getElementById( s);
    if( se){
        se.innerHTML = stones[ c];

        se.firstElementChild!.animate(
            { scale: [0,1]},
            { duration: timeToInsertStone * sec, easing: "ease" }
        );

        // console.log( "draw: " + s);        
    }
};

function drawStone( s: string, c: colour_t){
    // Draw stone at position s with colour c (no delay).
    const se: optHTMLElement = document.getElementById( s);
    if( se){
        se.innerHTML = stones[ c];

        // console.log( "draw: " + s);        
    }
};

const turnStonesTemplate: Record< colour_t, string> = {
    "white": "<img src=\"./pics/black2white/b2w#.svg\">",
    "black": "<img src=\"./pics/white2black/w2b#.svg\">",
    "": ""
};
let turnStoneTemplate: string = "";

const timeToTurnStone: number = 0.5; // seconds
const numberOfTurnSteps: number = 8;

let timerTurnStonesId: number = 0;
let turnStoneStep: number = 1;
let turnStoneElements : optHTMLElement[] = [];

function turnStones(): void{
    if( turnStoneStep > numberOfTurnSteps){
        clearInterval( timerTurnStonesId);
        return;
    };
    turnStoneElements.forEach(
        ( e: optHTMLElement) => {
            if(e){
                e.innerHTML =
                    turnStoneTemplate.replace( "#", turnStoneStep.toString(10));
            }else{
                alert( "turnStones: empty eleemnt.");
                clearInterval( timerTurnStonesId);
                return;
            }
        }
    );
    turnStoneStep++;
};

function startTurnStones(){
    timerTurnStonesId = setInterval(
            turnStones, (timeToTurnStone / numberOfTurnSteps) * sec);
}

function placeStones( sl: string[], c: colour_t){
    let [ s, ...rl]: string[] = sl;
    insertStone( s, c);
    turnStoneTemplate = turnStonesTemplate[ c];
    turnStoneStep = 1;
    turnStoneElements = rl.map(
        ( s: string) => {
            return(
                document.getElementById( s))}
    );
    setTimeout( startTurnStones, timeToInsertStone * sec);
};


// Squares on the board ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

async function check_for_end( c: colour_t): Promise<colour_t>{
    const curr_state: state_t = determine_state( curr_board);
    switch( curr_state.name) {
        case "normal":
            return other_colour( c);
        case "blocked":
            if( curr_state.col == other_colour( c)){
                return c;
            }else{
                return other_colour( c);
            };
        case "drawn":
            await alertDialogue( "Game has finished: no winner.");
            return "";
        case "winner":
            await alertDialogue(
                "Game has finished:<br>" + 
                "The Winner is " +
                ( curr_state.col == user_colour ?
                    "the human. Congratulations!" :
                    "the machine. Sorry.")                
            );
            return "";
        default:
            alert( "check_for_end: unknown state of board.");
            return "";
    };
};

async function square_click( pe: PointerEvent): Promise<void> {
    if( users_turn){
        if(pe){
            const et: optEventTarget = pe.target;
            if(et instanceof HTMLElement){
                if( curr_board.moves[ user_colour].includes( et.id)){

                    btn_swap_off();
                    btn_strength_off();
                    btn_from_clpboard_el_off();

                    clear_message();

                    users_turn = false;
                    board_el!.style.cursor = "not-allowed";

                    let sl: string[] = setStone( et.id, user_colour, curr_board);
                    placeStones( sl, user_colour);
                    show_state();

                    // console.log(">w: " + (new Date));    
                    await sleep( waitTime * sec);   
                    // console.log("<w: " +  (new Date));                     

                    let c: colour_t = await check_for_end( user_colour);
                    switch( c){
                        case "": // end of game
                            break;
                        case user_colour:
                            show_new_message( "Machine is blocked. Human continues.");
                            users_turn = true;
                            board_el!.style.cursor = user_cursor;
                            break;
                        case computer_colour:
                            let cont: boolean = true;
                            clear_message();
                            while( cont){

                                sl = compute_move( computer_colour, curr_board);
                                show_add_message( "Machine move: " + sl[ first_list_index]);
                                placeStones( sl, computer_colour);

                                await sleep( waitTime * sec);   
                                show_state();
                                c = await check_for_end( computer_colour);

                                switch( c){
                                    case "": 
                                        cont = false;
                                        break;
                                    case user_colour:
                                        users_turn = true;
                                        board_el!.style.cursor = user_cursor;
                                        cont = false;
                                        break;
                                    case computer_colour:
                                        show_app_message( " (Human is blocked. Machine continues.)");
                                        break;
                                    default:
                                        alert( "check_for_end returned unknown colour.")
                                };
                            };
                            break;
                        default:
                            alert( "check_for_end returned unknown colour.")
                    };
                }else{
                    // Ignore click.
                }
            }
        }else{
            alert( "No pointer event.");
        }    
    }
};


// State field ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let state_el: optHTMLElement = document.getElementById( "state");
if(  !state_el){
    alert( "State element not found.");
    window.close();
};

const stone_symbol: Record< colour_t, string> = {
    "white": "⚪",
    "black": "⚫",  
    "": ""
};

const stone_symbol_small: Record< colour_t, string> = {
    "white": "<span class=\"whitem\">●</span>",
    "black": "●",  // OK
    "": ""
};

function show_state(): void{ // ⥢===⥤ 🢤🢥 🢀🢂
    state_el!.innerHTML =
        "Human: " + curr_board.stones[ user_colour] + " " + stone_symbol[ user_colour] +
        " 🤜🏻🤛🏻 Machine: " +
            curr_board.stones[ computer_colour] + " " + stone_symbol[ computer_colour] 
};


// Message field ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let message_el: optHTMLElement = document.getElementById( "message");
if( !message_el){
    alert( "Message element not found.");
    window.close();
};

function show_new_message( m: string): void{
    message_el!.innerHTML = m;
};

function show_app_message( m: string): void{
    message_el!.innerHTML += m;
};

function show_add_message( m: string): void{
    if( message_el!.innerHTML !== ""){
        message_el!.innerHTML += "<br>" + m;
    }else{
        message_el!.innerHTML = m;
    }
};

function clear_message(): void {
    message_el!.innerHTML = "";    
};



// Swap button ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let btn_swap_state: boolean = true;

function swap_colours(){
    user_colour = other_colour( user_colour);
    computer_colour = other_colour( computer_colour);
    user_cursor = 'url("../pics/' + user_colour + '_stone.svg") 25 25, pointer';
    board_el!.style.cursor = user_cursor;
    show_state();
    show_new_message( "User colour is now " + user_colour + ".");
};

function btn_swap_click( pe: PointerEvent): void {
    if( pe){
        if( btn_swap_state){
            swap_colours();
        }
    }else{
        alert( "btn_swap_click: no pointer event.");
    }
};

let btn_swap: optHTMLElement = document.getElementById( "btn_swap");
if(  btn_swap){
    btn_swap.addEventListener( "click", btn_swap_click);
}else{
    alert( "Swap button not found.");
    window.close();
};

function btn_swap_off(){
    btn_swap!.style.color = "darkgray";
    btn_swap!.style.cursor = "not-allowed";
    btn_swap_state = false;
};

function btn_swap_on(){
    btn_swap!.style.color = "white";
    btn_swap!.style.cursor = "pointer";
    btn_swap_state = true;
};


// Strength button ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let btn_strength_state: boolean = true;

async function set_strength(){
    const inp: opt_number =
        await readNumberDialogue(
                "Set computer's strength",
                computer_strength_min, computer_strength_max,
                computer_strength);
    if( inp){
        set_computer_strength( inp);
        show_state();
        showStrength()
        show_new_message( "Computer strength set to " + inp + ".");
    }else{ // inp is null
        // nothing to do.
    }
};

async function btn_strength_click( pe: PointerEvent): Promise<void> {
    if( pe){
        if( btn_strength_state){
            set_strength();
        }
    }else{
        alert( "btn_strength_click: no pointer event.");
    }
};

let btn_strength: optHTMLElement = document.getElementById( "btn_strength");
if(  btn_strength){
    btn_strength.addEventListener( "click", btn_strength_click); 
}else{           
    alert( "Strength button not found.");
    window.close();
};

function btn_strength_off(){
    btn_strength!.style.color = "darkgray";
    btn_strength!.style.cursor = "not-allowed";
    btn_strength_state = false;
};

function btn_strength_on(){
    btn_strength!.style.color = "white";
    btn_strength!.style.cursor = "pointer";
    btn_strength_state = true;
};

const strength_symbol: string[] = ["🄋","➀","➁","➂","➃","➄"];

function showStrength(){
    btn_strength!.textContent = "Set strength " + strength_symbol[ computer_strength];
};


// Button: show moves ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function show_moves(){
    curr_board.moves[ user_colour].map( (s:string) => {
        const sq:optHTMLElement = document.getElementById( s);
        if( sq){
            sq.innerHTML = stone_symbol_small[ user_colour];
            sq.style.color = user_colour;
        }
    })
};

function btn_moves_mousedown( me: MouseEvent): void{
    if( me){
        show_moves();
    }else{
        alert( "btn_moves_mousedown: mouse event not found.");
    }
};

function clear_moves(){
    curr_board.moves[ user_colour].map( (s:string) => {
        const sq:optHTMLElement = document.getElementById( s);
        if( sq){
            sq.innerText = "";
        }
    })
};

function btn_moves_mouseup( me:MouseEvent): void {
    if( me){
        clear_moves();
    }else{
        alert( "btn_moves_mouseup: mouse event not found.");
    }
};

let btn_moves: optHTMLElement = document.getElementById( "btn_moves");
if(  btn_moves){
    btn_moves.addEventListener( "mousedown", btn_moves_mousedown);
    btn_moves.addEventListener( "mouseup", btn_moves_mouseup);
}else{
    alert( "Show moves button not found.");
    window.close();
};


// Best move button ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let best_move_el: optHTMLElement;

function show_best_move(){
    let best_move: string = find_move( user_colour, curr_board);
    best_move_el = document.getElementById( best_move);

    if( best_move_el){
        best_move_el.innerHTML = stone_symbol_small[ user_colour];
        best_move_el.style.color = user_colour;
    }else{
        alert( "best_move_mousedown: square for move not found: " + best_move);
    }
};

function best_move_mousedown( me: MouseEvent): void{
    // Assumption: user is not blocked
    if( me){
        show_best_move();
    }else{
        alert( "best_move_mousedown: mouse event not found.");
    }
};

function clear_best_move(){
    if( best_move_el){
        best_move_el.innerText = "";
    }
};

function best_move_mouseup( me:MouseEvent): void {
    if( me){
        clear_best_move();
    }else{
        alert( "best_move_mouseup: mouse event not found.");
    }
};

let btn_best_move: optHTMLElement = document.getElementById( "btn_best_move");
if(  btn_best_move){
    btn_best_move.addEventListener( "mousedown", best_move_mousedown);
    btn_best_move.addEventListener( "mouseup", best_move_mouseup);
}else{
    alert( "Best move button not found.");
    window.close();
};


// Copy to clipboard button ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function copy_to_clipboard(){
    let curr_state = {
        curr_board: board2StrArray( curr_board),
        user_colour: user_colour,
        computer_strength: computer_strength,
    };
    navigator.clipboard.writeText(
        JSON.stringify( curr_state)
            .replace( "[", "[" + newline)
            .replaceAll( ",", "," + newline)
    );
    show_new_message( "Board copied to clipboard.");
};

function btn_to_clpboard_click( pe: PointerEvent): void{
    if( pe){
        copy_to_clipboard();
    }else{
        alert( "btn_to_clpboard_click: no pointer event.");
    }
};

let btn_to_clpboard_el: optHTMLElement = document.getElementById( "btn_to_clpboard");
if(  btn_to_clpboard_el){
    btn_to_clpboard_el.addEventListener( "click", btn_to_clpboard_click);
}else{
    alert( "Button 'to clipboard' not found.");
    window.close();
};


// Draw board ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function draw_board(){
    user_cursor = 'url("../pics/' + user_colour + '_stone.svg") 25 25, pointer';
    board_el!.style.cursor = user_cursor;

    computer_colour = other_colour( user_colour);

    for( const s of square_list){
        drawStone( s.id, s.col);
    };

    show_state();
};


// Load from clipboard button ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let btn_from_clpboard_state: boolean = true;

function check_number( s: any, l: number, u: number): void{
    if( typeof( s) != "number"){
        throw new Error( "Computer strength: number expected.");
    };
    const n: number = Number( s);
    if( n < l || u < n){
        throw new Error( "Computer strength: number out of range.");
    }
};

function check_colour( c: any): void{
    if( typeof( c) != "string"){
        throw new Error( "User colour: string expected.");
    };
    if( c != "white" && c != "black"){
        throw new Error( "User colour: unknown colour.");
    }
};

function check_strArray( sl: any): void{
    if( sl[0] === undefined){
        throw new Error( "Board: not an array.");
    };
    if( sl.length != 8){
        throw new Error( "Board: wrong number of rows.");
    };
    for( let rn in sl){
        let s = sl[ rn];
        if( typeof( s) != "string"){
            throw new Error( "Board: row: " + ( Number( rn) + 1) + ": string expected.");
        };
        if( s.length != 8){
            throw new Error( "Board: row: " + ( Number( rn) + 1) + ": wrong number of columns.");
        };
        for( let cn in [...s]){
            let ch = s[ cn];
            if( ch != "-" && ch != "○" && ch != "●"){
                throw new Error( "Board: row: " + ( Number( rn) + 1) + ": column: " + ( Number( cn) + 1) +
                                ": invalid character.");
            };
        }
    }
};

function load_from_clipboard(){
    navigator.clipboard.readText()
    .then(text => {
        try{
            const {
                curr_board: sa,        // string[]
                user_colour: uc,       // colour_t
                computer_strength: cs, // number
            } = JSON.parse( text);

            check_number( cs, computer_strength_min, computer_strength_max);
            check_colour( uc);
            check_strArray( sa);

            init_board( strArray2Board( sa));
            user_colour = uc;
            set_computer_strength( cs);

            draw_board();
            showStrength();
            show_new_message( "Board read from clipboard.");
        }catch( e: any){
            alertDialogue(  e.toString());
        }
    })
    .catch(err => {
        alertDialogue("Could not read clipboard:" + newline + err);
    });
};

function btn_from_clpboard_click( pe: PointerEvent): void{
    if( pe){
        if( btn_from_clpboard_state){
            load_from_clipboard();
        }
    }else{
        alert( "btn_from_clpboard_click: no pointer event.");
    }
};

let btn_from_clpboard_el: optHTMLElement = document.getElementById( "btn_from_clpboard");
if(  btn_from_clpboard_el){
    btn_from_clpboard_el.addEventListener( "click", btn_from_clpboard_click);
}else{
    alert( "Button 'from clipboard' not found.");
    window.close();
};

function btn_from_clpboard_el_off(){
    btn_from_clpboard_el!.style.color = "darkgray";
    btn_from_clpboard_el!.style.cursor = "not-allowed";
    btn_from_clpboard_state = false;
};

function btn_from_clpboard_el_on(){
    btn_from_clpboard_el!.style.color = "white";
    btn_from_clpboard_el!.style.cursor = "pointer";
    btn_from_clpboard_state = true;
};


// Local storage ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const board_local_store: string = "board";
const user_colour_local_store: string = "user";
const computer_strength_local_store: string = "strength";


function clear_local_storage(){
    localStorage.removeItem( board_local_store);
    localStorage.removeItem( user_colour_local_store);
    localStorage.removeItem( computer_strength_local_store);
};

function store_to_local_storage(){
    localStorage.setItem( board_local_store, JSON.stringify( curr_board));
    localStorage.setItem( user_colour_local_store, JSON.stringify( user_colour));
    localStorage.setItem( computer_strength_local_store, JSON.stringify( computer_strength));
};

type optString = string | null;

type local_storage_values_t = {
    board: optString,
    user: optString,
    computer: optString
};

function read_local_storage(): local_storage_values_t{
    return ({
            board: localStorage.getItem( board_local_store),
            user: localStorage.getItem( user_colour_local_store),
            computer: localStorage.getItem( computer_strength_local_store)
        })
};


// Launch game ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function launch_game(){
    const {
            board: board_str,
            user: user_str,
            computer: comp_str
        }: local_storage_values_t = read_local_storage();

    if( board_str && user_str && comp_str){
        // Load loacl storage
        init_board( JSON.parse( board_str));
        user_colour = JSON.parse( user_str);
        set_computer_strength( JSON.parse( comp_str));

        btn_swap_off();
        btn_strength_off();
        showStrength();

        btn_from_clpboard_el_off();

        show_new_message( "Board loaded.");
    }else{ // Init game.
        clear_local_storage();
        init_board();
        user_colour = user_colour_default;

        btn_swap_on();
        btn_strength_on();
        showStrength();

        btn_from_clpboard_el_on();

        show_new_message( "Board initialized.");
    };

    draw_board();

    const squares: NodeList = document.querySelectorAll( class_sel + "square");
    for( let s of squares){
        if( s instanceof HTMLElement){
            s.addEventListener( "click", square_click);
        }
    };

    set_up_keyboard();

    users_turn = true;
};


// Reset button ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

async function reset_game(): Promise<void>{
    const answer: boolean =
        await confirmDialogue( "Reset game?<br> This will initialize the board.");
    if( answer){
        clear_local_storage();
        launch_game();
    };
};

function btn_reset_click( pe: PointerEvent): void{
    if( pe){
        reset_game();
    }else{
        alert( "btn_reset_click: no pointer event.");
    }
};

let btn_reset: optHTMLElement = document.getElementById( "btn_reset");
if(  btn_reset){
    btn_reset.addEventListener( "click", btn_reset_click);
}else{
    alert( "Reset button not found.");
    window.close();
};


// Exit button ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

async function exit_game(){    
    const answer: boolean =
        await confirmDialogue( "Exit game?<br> Current state of board is saved in local storage.");
    if( answer){
        try{
            store_to_local_storage();
            window.close();
        }catch( error: any){
            alert( "Saving board in local storage: " + error.message);
        }
    }
};

async function btn_exit_click( pe: PointerEvent){
    if( pe){
        exit_game();
    }else{
        alert( "btn_exit_click: no pointer event.");
    }
};

let btn_exit: optHTMLElement = document.getElementById( "btn_exit");
if(  btn_exit){
    btn_exit.addEventListener( "click", btn_exit_click);
}else{
    alert( "Exit button not found.");
    window.close();
};


// Keyboard events ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function keydown_handler( ke: KeyboardEvent): void{
    switch ( ke.key){
        case "w":
            if( btn_swap_state){
                swap_colours();
            };
            break;
        case "s":
            if( btn_strength_state){
                set_strength();
            };
            break;
        case "m":
            show_moves();
            break;
        case "b":
            show_best_move();
            break;
        case "c":
            copy_to_clipboard();
            break;
        case "l":
            if( btn_from_clpboard_state){
                load_from_clipboard();
            };
            break;
        case "r":
            reset_game();
            break;
        case "x":
            exit_game();
            break;
        default:
            // ignore key
    }
};


function keyup_handler( ke: KeyboardEvent): void{
    switch ( ke.key){
        case "m":
            clear_moves();
            break;
        case "b":
            clear_best_move();
            break;
        default:
            // ignore key
    }
};

function set_up_keyboard(): void{
    document.addEventListener("keydown",keydown_handler);
    document.addEventListener("keyup",keyup_handler);
};

function clear_keyboard(){
    document.removeEventListener( "keydown", keydown_handler);
};


launch_game();

