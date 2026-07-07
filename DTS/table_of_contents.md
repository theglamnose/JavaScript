
# DTS (deterministic transition system)
  
In the directory at hand you will find a small example, which shows a generic implementation of a deterministic transition system.
Moreover this example is a nice demonstration how to use higher-order modules (i.e. a module, that generates another module).

## Purpose
The purpose of the source code is to show, how higher-order modules can be implemented in Java. A higher-order module 
(in the field of functional programming languages it is called a functor) is quiet similar to a higher-order function.
While a higher-order function gets as an argument a function and returns as a result a new function, a higher-order module
works on modules: it gets as an argument a module and returns a new module.

As a small example we will discuss deterministic transition systems (DTS). A DTS consists of the following parts:  
1. A non-empty and finite set S of states.
2. A non-empty and finite set L of labels.
3. A partial tranition function T: S x L -> S.
4. A start state s in S.
5. A non-empty set F of final states: F <= S.

Given this DTS, we want to find the shortest loop-free path (if there exists any),
which starts with s and ends in one of the final states F.

As an example consider the following small DTS:

S = { 0,1,2,3}, s = 3, F = {1}  
L = { suc, pre}  
T( s, suc) = s+1, s < 3  
T( s, pre) = s-1, s > 0

We can visualize this DTS with a graph:

```shell
0 <-- pre -- 1 <-- pre -- 2 <-- pre -- 3  
  -- suc -->   -- suc -->   -- suc -->
```  

The shortes path from 3 to 1 is: [ pre, pre].

To find the shortest path, we apply a breadth-first search, which starts with the state s.
We construct a spanning tree with root s, which contains the shortest path for state t, which
can be reached from the state s. The construction stops, when a state f of F is reached. 
In this case the path from s to f is given as a result.
If no state can be added to the spanning tree anymore, and if no state of F is contained
in the spanning tree, then the search stops with the result: "no path exists".

Instead of implementing the breadth-first search for each individual DTS, we generalize the
algorithm to a higher-order-module, which accepts an arbitrary DTS and returns a path (if it exists).

In the Java file `DTS.java` you will find the following classes:

<dl>
  <dt><code>
    interface DTS_Interface< State,Label>
  </code> </dt>
  <dd> 
    The interface specification of a DTS. It contains the specification for the methods T, s and F.
    In addition it contains method, which returns for a given State a set of available labels.
  </dd>

  <dt><code>
     interface WorkOnDTS_Interface< Label>
  </code> </dt>
  <dd> 
     The interface specification of the produced module. It contains only one method to compute the shortest path.
  </dd>

<dl>
  <dt><code>
     class WorkOnDTS< State, Label, DTS_par extends DTS_Interface< State, Label>>
							implements WorkOnDTS_Interface< Label>
  </code> </dt>
  <dd> 
     The higher-order module, which gets an DTS as an argument and returns a module with the method to compute the shortest path. 
  </dd>
</dl>

  <dt><code>
     class TS implements DTS_Interface<Integer,String>
  </code> </dt>
  <dd> 
     Example class, with the small DTS.
  </dd>

  <dt><code>
     public class DTS
  </code> </dt>
  <dd> 
     The default class with the main() method (automatically executed). The main method invokes the higher-order module and produces
     a new module, which contains the method to compute the shortest path.
  </dd>
</dl>

## Technology
The program is written in Java.

## Folder structure

```shell
├── DTS.java   # Java file with source code for a generic DTS with an example application.
├── Linux      # Bash scripts for compiling and running on a Linux machine.
├── PowerShell # PowerShell scripts for compiling and running on any machine with a PowerShell.
├── table_of_contents.md # The MarkDown document at hand.
└── windows    # Windows batch files for compiling and running on a Windows machine.
```




## Installation
Depending on the machine you are using, execute one of the `compile.*` files in the root directory (i.e. the directory, where the file `table_of_contents.md` is located). This will build the Java classes in a new folder `Class`.

To run the example execute one of the `run.*` files in the root directory.

## What you can learn from the source code
While reading the source code, you will learn how to ...
* work with hash sets in Java,
* work with queues in java,
* work with generic types,  
* work with lists in Java,
* implement higher order modules,  
* use higher order modules,
* implement a breadth-first search with queues.  



