
# Elevator simulation
  
In the directory at hand you will find a small web application (using the React framework), which
simulates an elevator. The algorithm is taken from the textbook "*The Art of Computer Programming*" written by Donald Ervin Knuth.
The implementation is a nice example how to connect a state-based algorithm with some graphical elements in HTML
by using the React framework.

## Technology
The web application was developed with the React framework and uses TypeScript and CSS.

## Contents

<dl>
  <dt><code>
  elevator.md
  </code> </dt>
  <dd> 
  This file contains a reformulation of the elevator algorithm, because the original description by D. Knuth
  is not so easy to understand.
  </dd>
</dl>


<dl>
  <dt><code>
  src
  </code> </dt>
  <dd> 
  The source code of the web application. The elevator algorithm is contained in the file `elevator.ts`.

  `components`:
  This subdirectory contains the React components of the simulation:
  * User list: for each user in and out floor, give-up time and time for next user appearance.
    A user, who is currently in the building, is marked with a red number.
  * Action list: a list of scheduled actions with timepoint in the future.
    The next action to be executed is shown right above the action list together with the current time.
    Click on the button `Next action` to execute this action.
    The `reset` button resets the application to its initial state.
  * Building:
    * Five floors: for each floor call buttons and waiting users.
    * Shaft with cabin: inside of the cabin call buttons, direction display and passengers.
  </dd>
</dl>

<dl>
  <dt><code>
  public
  </code> </dt>
  <dd> 
  Code to specify simulation runs (file `userList.json`) and elevator parameters (file `parameter.json`).
  The simulation run given here is taken from Knuths textbook.
  </dd>
</dl>


## Installation

```shell
npm i
npm run dev
```

## What you can learn from the source code
While reading the source code you can learn, how to ...
+ define a clear software architecture, which separates between logic and user interface,
+ apply the React concept of a reducer,
+ build a simulation system with discrete time logic.

<dl>
  <dt><code>
  
  </code> </dt>
  <dd> 
  
  </dd>
</dl>
