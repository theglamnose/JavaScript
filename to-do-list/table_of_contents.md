# A small to-do list ~~~ How to program in JavaScript in an object-oriented style

## 1 Introduction

### 1.1 Purpose

The directory at hand contains a small commandline tool, which is able to manage a list of tasks.
The tasks are stored in a text file with default name `tasks.txt` (but also a different name can be given
as an argument on the commandline). Two operations are offered to work with tasks:  
1. Add a new task (simply a string).  
2. Mark/unmark a task in the list.  

The program is not very complicated, but it is a nice demonstration of how to structure a given programming task
into a set of objects. This method is called object-oriented analysis. The result is a set of object classes,
where each has it own functions and values. 

Moreover the program contains example code ..  
1. to implement a polymorphic function;
2. to call a function with scope other than its lexical scope.

### 1.2 Technology
The program is written in JavaScript and uses only one external package.

## 2 Usage

### 2.1 Installation
Use the node package manager to install the dependencies: `npm install`

### 2.2 Usage
To invoke the program, type:  
`node toDoList_oo.js <path to task file>`  

The path to the task file is mandatory. If no file exists, a new task file is generated. After termination of the
program all tasks are stored in that file.

## 3 Source code

### 3.1 List of files
The tool consists of the following files:

```shell
toDoList_oo.ts      # JavaScript source code of the program. 
                    # This file also contains the object-oriented analysis.
tasks.txt           # Default file with task list.
```

### 3.2 What you can learn
It might be of interest for you to see how to ..  
- use object-oriented analysis to design a program;
- use classes in JavaScript;
- define polymorphic functions in JavaScript (function, which operates differently depending on the type of the given arguments);
- call a function with scope other than its lexical scope.