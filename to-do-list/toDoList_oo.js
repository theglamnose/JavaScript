/***** Object-oriented approach for the to-do list *****

 ************************** A single task
 Properties:
   title: string  Must not be empty.
   done: bool     Default value is 'false'.
 Methods:
   Task( {title:string, done:boolean}) Create a new task with title t and marker m.
   *** String representation of a task in a text file (for each task one line):
        title '|' done
   Task( r:string) Create a new task from its representation string (read from a text file).
   toRep():string  Convert task t to its representation string (to be stored in a text file).
   toStr():string      Return a human readable string of the task (to be shown on console).
   toggle_done_mark()  Toggle 'done' property.


 ************************* A task list
 Properties:
   path: string  Path to location of text file.
                   Default value: 'tasks.txt'.
   tasks: array of task
 Methods:
   TaskList( p:string)
        Load task array from text file at path p. If no path is given
        use default value. If no file exists generate a new file
        and create an empty array.
   save( p:string)   Write task array to text file at path p.
   print()  Print all tasks to the console.
   add_new_tasks( )
        Add new tasks to the array.
        The user is asked for a title for a new task until he enters
        an empty string.
        It is not allowed to add a task with an already
        existing title.
   toggleTasks()
        Ask user for a task number and toggle its mark. This is repeated
        until the user enters the number 0.


 ************************* A single menu entry
 Properties:
   title: string
   action: function
 Methods:
   <none>


 ************************* A menu
 Properties:
   taskList: task list
   entries: array of entry
 Methods:
   Menu( p)
       Create a menu for a task list stored at path p:string.
       If an empty string is given, use the default path.
   print()   
       Print all entries to the console and
       give some help for using the menu (e.g. abort).
   askUser()  
       Ask user for the number of a menu entry and execute its action.
       This is repeated until the user enters 0. Then the task list written
       to the text file and the program terminates.
*/


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Implementation ~~~~~~~~~~~~~~~~~~~~~~~~~~~

import fs from "fs";
const encoding = "utf8";

import prompt from "picoprompt";
import { log } from "console";
import { title } from "process";

// String constants:
const newLine = "\n";
const space = " ";
const emptyStr = "";


// ************* Task *************
function Task( str_or_obj){ // With a string or an object.
    const separator = "|";
    const tick = "✓";
    // JavaScript offers no overloading of constructors.
    switch( typeof( str_or_obj)) {
        case "string": // title + "|" + done
            const strings = str_or_obj.split( separator);   
            const titlePos = 0;
            const donePos = 1; 
            this.title = strings[ titlePos];
            this.done = ( strings[ donePos] == "true");
            break;            
        case "object": // {title:string, done:boolean}
            this.title = str_or_obj.title;
            this.done = str_or_obj.done;
            break;
        default:
            console.log( "*** Internal error: wrong type while creating task.");
            process.exit(0);
    };
    this.toRep = function() { 
        return this.title + separator + this.done;
    },
    this.toStr = function() {
        return (this.done ? tick : space) + space + this.title;
    };
    this.toggle_done_mark = function() {
        this.done = ! this.done;
    }
};


// ************* Task list *************
function TaskList( p) { // With path p:string to task file.
    this.path = "tasks.txt";
    this.tasks = [];
    if ( p) this.path = p;
    if( ! fs.existsSync( this.path)) {
        fs.writeFileSync( this.path, emptyStr, encoding);
        console.log( "New task file created.");        
    } else // Open text file at path this.path.
        try {
            const fileContent = fs.readFileSync( this.path, encoding);
            const lines = fileContent.split( newLine);
            for( const line of lines) {
                if( line) { // ignore empty lines.
                    this.tasks.push( new Task( line));
                } 
            };
            console.log( `${this.tasks.length} tasks read from file ${this.path}.`);        
        } catch( error) {
            console.log( "Opening task file:", error.message);
            process.exit();
        };
    // Methods:
    this.print = function() {
        if( this.tasks.length === 0) {
            console.log( "Empty task list.");            
        } else 
            for( const t in this.tasks){
                console.log( `${Number( t) + 1}: ${this.tasks[ t].toStr()}`);            
            }
    };
    this.save = function() {
        let allLines = emptyStr;
        for( const task of this.tasks){
            allLines = allLines + task.toRep() + newLine;
        };
        try{
            fs.writeFileSync( this.path, allLines, encoding);
            console.log( `${this.tasks.length} tasks written to file ${this.path}.`);        
        } catch( error) {
            console.log( "Saving task list:", error.message);
            process.exit();
        }
    };
    this.exists = function( ti) { 
        // Return true iff there exists a task with title ti:string.
        let f = false;
        for( const t of this.tasks) {
            if( t.title == ti) {
                f = true;
                break;
            }
        };
        return f;
    };
    this.add_new_tasks = function() {
        let t = "-";
        while( t) {
            this.print();
            t = prompt( "Title for new task (return aborts dialogue)? ");
            if( t) {
                if( this.exists( t)) {
                    console.log( "Duplicate task (ignored)");                
                } else {
                    this.tasks.push( new Task( { title: t, done: false}));  
                }
            } 
        }
    };
    this.toggleTasks = function() {
        const l = this.tasks.length;
        if( l === 0) {
            console.log( "Empty task list.");            
        } else { // l > 0
            let n = 1;
            while( n) {
                this.print();
                n = Number( prompt( `Toggle task mark. Task number (0 means abort)? `));
                if( 1 <= n && n <= l) {
                    this.tasks[ n - 1].toggle_done_mark();                
                }
            }
        }
    }
};


// ************* Entry *************
function Entry( t, a) { // With title t:string and action a:function.
    this.title = t;
    this.action = a;
};


// ************* Menu *************
function Menu( p) { // With path p:string to task file.
    this.taskList =  new TaskList( p);
    this.entries = [
        new Entry( "Add new tasks", this.taskList.add_new_tasks),
        new Entry( "Show tasks (and toggle mark)", this.taskList.toggleTasks)
    ];
    this.print = function() {
        console.log( " *** To-do list ***");
        for( const e in this.entries) {
            console.log( `${ Number( e) + 1}: ${ this.entries[ e].title}`);            
        };
    };
    this.askUser = function() {
        const l = this.entries.length;
        let n = 1;
        while( n) {
            this.print();
            n = Number( prompt( "Entry number (0 means abort) ? "));
            if( 1 <= n && n <= l) {
                this.entries[ n - 1].action.call( this.taskList);
                // We have to give the context of the current task list
                // due to lexical scoping.
            }
        };
        this.taskList.save();
        console.log( "Good bye.");        
    }
};

// Main function
const pathPos = 2;
let m = new Menu( process.argv[ pathPos]);
m.askUser();

// To start the application:
// node toDoList_oo.js <path to task file>
