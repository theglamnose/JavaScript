

# Elevator simulation

## 1 Introduction

This simulation is directly taken from the famous textbook series "*The Art of Computer Programming*" written by Donald Ervin Knuth published in 1968.
The task and algorithm given here appeared in *Volume 1 - Fundamental algorithms* - in section *2.2.5 Doubly linked Lists*.

The task is to implement a discrete simulation of an elevator. This seams to be quiet simple, because you can ask what does an elevator do?
It takes users and moves them to a desired floor. This seams not so interesting, but assume you have an elevator which moves
in the following way: start at the first level, move up to the highest level (while stopping at levels with waiting users), then
move down to the lowest level, and repeat this forever. Obviously each user will reach his destination, but there are situations,
where its takes a lot of time. E. g. think about a user at level 2, who wants to travel to level 1, but the elevator is in its
rising phase? Our user has to travel all along the way to the highest level and down to level 1. As you can see with this naive
approach, there is more to be observed to talk about elevator algorithms.

We will present here the elevator algorithm as described in D. Knuths book, which is an implementation in the Mathematical building
of the California Institute of Technology. We will use a quiet different terminology (e. g. using better variable names instead of just `D1`).

---

## 2 The Elevator and its environment

### 2.1 Floors and buttons 
The elevator is placed in a building with five floors (two basements, one ground floor and two upper floors).
The floors are numbered from bottom to top with 0 to 4.
Each floor has two call buttons:

* `DOWN`: for going down (ignored at floor 0),

* `UP`: for going up (ignored at floor 4).

Due to this we have two boolean arrays of length 5: `CallUp` and `CallDown`.

Inside of the elevator cabin there is for each floor a destination button.

* The buttons are modelled by a boolean array of length 5: `CallCar`.

Pressing a button sets the corresponding variable to `true`.
The button is automatically set back to `false` by the elevator after the request has been fulfilled.

Users waiting at a floor are modelled by a queue. So we have an array of five queues: `Queue[]`.


### 2.2 Movement
The elevator can be in one of the following states (current direction): 

* `GoingUp`: moving up,

* `GoingDown`: moving down,

* `Neutral`: no movement.  

The movement of the elevator is shown by lighted arrows inside of the cabin. 

### 2.3 Home floor
If the elevator is in state `Neutral` and not in floor 2 (the ground floor, also called _home floor_),
then the elevator will close
its doors, and if no call command is given, it will move to floor 2.
At the home floor the elevator waits with closed doors for calls.
When the elevator receives a call, it starts to move in the corresponding direction (state `GoingUp` or `GoingDown`). 
The movement continues in the same direction until there are no more calls for this direction.
After reaching the last floor for that direction the elevator changes its state to:

- `Neutral`: no more calls,

- other direction, if there are other calls for the new direction.


### 2.4 Timing behavior
The global variable Time contains the current `Time` (unit is tenth of seconds).

There are several actions performed by the elevator, which take some time:

* `TimeToOpenDoors`: opening the doors.

* `TimeUntilClosingDoors`: waiting time until the doors are closing automatically (unless there are no users trespassing).

* `TimeUntilClosingDoorsFast`: waiting time to automatically close the doors, but for state `Neutral`.
  This is shorter than the time interval `TimeUntilClosingDoors`.

* `TimeToCloseDoors`: closing the doors.

* `TimeToHoldDoorsOpen`: while trying to close the doors a sensor detects trespassing users.
   The elevator holds the doors open again.

* `TimeToBuildUpSpeed`: accelerate after starting to move.

* `TimeToMoveUp`: move one floor upwards.

* `TimeToMoveDown`: move one floor downwards.

* `TimeToLooseSpeedUp`: decelerate to stop at a floor whiling moving up.

* `TimeToLooseSpeedDown`: decelerate to stop at a floor whiling moving down.



### 2.5 Timeout intervals
The elevator has some timeout intervals:

* `TimeUntilInaction`: waiting time until no more actions are performed by the elevator at a floor.

### 2.6 State variables for the elevator
The elevator has the following variables:

* `Floor`: current position of the elevator (0 to 4).

* `D1_UsersTrespassing`: set to `true` as long as
   users are trespassing the doors (or the doors are opening after arrival).

* `D2_BusyElevator`: set to `true` as long as the elevator is busy.
   After `TimeUntilInaction` units of no action the variable is set to `false`.

* `D3_OpenDoors`: set to `true` as long as the doors are open but nobody is trespassing.
  This gives late arriving users some time to enter the elevator.

* `Direction`: current state/direction of the elevator (`GoingUp`, `GoingDown` or `Neutral`).

* `Passengers`: Users being inside of the cabin are modelled by a stack.


The initial state is:

- `Floor` = 2,

- `D1_UsersTrespassing` = `D2_BusyElevator` = `D3_OpenDoors` = `false`,

- `Direction` = `Neutral`.

---

## 3 The user

Before we specify the actions of a user, we describe his data:

1. `In`: At this floor a new user enters the simulation.

2. `Out`: The floor, where the user wants to go for ( `In ≠ Out`).

3. `GiveUpTime`: time interval, after the user gives up waiting for the elevator and takes the stairs.

4. `InterTime`: time interval after the next user will enter the simulation.
   This is only one possibility to implement the arrival of new users.

Some time intervals for actions of the user:

* `TimeToLeaveCabin`: time needed for one user to leave the elevator cabin.

* `TimeToEnterCabin`: time needed for one user to enter the elevator cabin.

We describe the behavior of a user in the simulation by the following rules:

### 3.1 U1_Enter
  Create a new user with the four data given above. 
  Create an event for the next user to enter the system at time `Time + InterTime`.

### 3.2 U2_Signal
  Call the elevator. There are some special cases:

  - If the elevator is at the `In` floor and is starting to move (doors are closing)
    (action E6_PrepareToMove), then reopen the doors (action E3_OpenDoors).

  - If the elevator is at the `In` floor and the doors are still open, clear `D3_OpenDoors`, turn on the door sensor
    and let users trespass the doors (action E4_LetUsersOutIn).

  - All other cases: set `CallUp` or `CallDown` according to the direction (`In` and `Out`).
    If the elevator is at his home floor (E1_Wait) or `D2_BusyElevator` is false, then execute the `Decision` subroutine of the elevator.

### 3.3 U3_EnterQueue
  The elevator is not at the `In` floor, so the user joins the back of the queue `Queue[In]`.
  The event U4_GiveUp for giving up of the user is scheduled at time `Time + GiveUpTime`.

### 3.4 U4_GiveUp  
  - If the elevator has not arrived (`Floor ≠ In`) or the doors cannot be used (`D1_UsersTrespassing` is set): 
    give up (take the stairs) and leave the simulation.

  - If the elevator has arrived (`Floor = In`) and the doors can be used (`D1_UsersTrespassing` is false):
    don't give up and wait a little while.

  - If the elevator has arrived (`Floor = In`), but the doors cannot be used (`D1_UsersTrespassing` is set): 
    give up (take the stairs) and leave the simulation.

### 3.5 U5_GetIn
  If the current direction of the elevator does not match with the required direction of a waiting user, the user will not enter the elevator.

  The user leaves the queue `Queue[In]`, enters the `Passengers` and pushes the button `CallCar[Out]`.

  - If `State = Neutral`, set `Direction` according to the pushed call button.
    Action E5_CloseDoors is rescheduled for time `Time + TimeUntilClosingDoorsFast`.

### 3.6 U6_GetOut
  Delete the user from `Passengers` and removes him from the simulation.
  
--- 

## 4 The Algorithm for the elevator

So far we only specified the behavior of the users and some aspects of the elevator.
But now we have to give a precise algorithm for the elevator.
The algorithm consists of two parts:

1. Elevator subroutine  
   This subroutine describes the general behavior of the elevator (move, open/close doors).

2. Decision subroutine  
   This subroutine is used, where a decision
   has to be made about the next direction (e.g. waking up at the home floor by a call).

The basic idea of moving is as follows: while there are calls in the direction of movement,
continue with the direction. Otherwise stop or change the direction of movement, if there are calls in the other direction.

 

### 4.1 ~~~ Elevator subroutine ~~~

#### 4.1.1 E1_Wait
* Precondition: the elevator is at the home floor with doors closed.
* Event: a user presses a call button.
* Action: Perform action according to the decision subroutine (this will lead to E3_OpenDoors or E6_PrepareToMove).

#### 4.1.2 E2_ChangeState
* Precondition:
  `State = GoingUp` and for all `f > Floor: CallUp[f] = CallDown[f] = CallCar[f] = false`.

* Action: 
  If for all `f < Floor: CallCar[f] = false`, then set `State = Neutral`, otherwise set `State = GoingDown`.  
  Also set `CallUp[Floor] = CallDown[Floor] = CallCar[Floor] = false`.

The same action as above is performed for the other direction (`State = GoingDown`).

Schedule E3_OpenDoors for now.
  
#### 4.1.3 E3_OpenDoors
* Action: 
  Set `D1_UsersTrespassing = D2_BusyElevator = true`.  
  Schedule E9_SetInaction at time `Time + TimeUntilInaction` (reschedule if necessary).  
  Schedule E5_CloseDoors at time `Time + TimeUntilClosingDoors`.  
  Schedule E4_LetUsersOutIn at time `Time + TimeToOpenDoors`.

#### 4.1.4 E4_LetUsersOutIn
* Precondition 1:
  There is at least one user in `Passengers` with `Out = Floor`.

* Action 1:
  For the user with `Out = Floor` remove him from `Passengers`, schedule U6_GetOut for him for now and  
  schedule E4_LetUsersOutIn at time `Time + TimeToLeaveCabin`.

* Precondition 2:
  No user wants to get out and `Queue[Floor]` is not empty.

* Action 2:
  Schedule first user of `Queue[Floor]` (for whom the elevator has the right direction) with U5_GetIn for him for now (and remove U4_GiveUp for him from scheduler).  
  Reschedule E4_LetUsersOutIn at time `Time + TimeToEnterCabin`.

* Precondition 3:
  No user wants to get out and `Queue[Floor]` is empty.
  
* Action 3:
  Clear `D1_UsersTrespassing` and set `D3_OpenDoors` (wait for further action).

#### 4.1.5 E5_CloseDoors
* Precondition 1:
  `D1_UsersTrespassing` is set.

* Action 1:
  Reschedule E5_CloseDoors at time `Time + TimeToHoldDoorsOpen`.

* Precondition 2:
  `D1_UsersTrespassing` is not set.

* Action 2:
  Set `D3_OpenDoors` and schedule E6_PrepareToMove at time `Time + TimeToCloseDoors`.
  It's possible, that a new user arrives and stops the closing doors, see action U2_Signal.

#### 4.1.6 E6_PrepareToMove
* Action:
  Clear `CallCar[Floor]`.  
  Clear `CallUp[Floor]`, if `State ≠ GoingDown`.  
  Clear `CallDown[Floor]`, if `State ≠ GoingUp`.  
  If the current direction of the elevator does not match with the required direction of waiting users,
  these users will not enter the elevator; so the call sign remains.  
  Execute the Decision subroutine.  
  
* Precondition 1:
  `State = Neutral`.

* Action 1:
  Schedule E1_Wait for now.

* Precondition 2:
  `State = GoingUp`.  

* Action 2:
  If `D2_BusyElevator` is set: remove event E9_SetInaction from scheduler.  
  Schedule E7_GoUp at time `Time + TimeToBuildUpSpeed`.

* Precondition 3:
  `State = GoingDown`.  

* Action 2:
  If `D2_BusyElevator` is set: remove event E9_SetInaction from scheduler.  
  Schedule E8_GoDown at time `Time + TimeToBuildUpSpeed`.

#### 4.1.7 E7_GoUp
* Action:
Increment `Floor`.  
If `CallCar[Floor]` or  
&nbsp;&nbsp;&nbsp;&nbsp;`CallUp[Floor]` or  
&nbsp;&nbsp;&nbsp;&nbsp;((no call for any floor above `Floor`) and  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(`Floor = HomeFloor` or `CallDown[Floor]`))  
then schedule E2_ChangeState at time `Time + TimeToMoveUp + TimeToLooseSpeedUp`  
else Schedule E7_GoUp at time `Time + TimeToMoveUp`.


#### 4.1.8 E8_GoDown
* Action:
Increment `Floor`.  
If `CallCar[Floor]` or  
&nbsp;&nbsp;&nbsp;&nbsp;`CallDown[Floor]` or  
&nbsp;&nbsp;&nbsp;&nbsp;((no call for any floor below `Floor`) and  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(`Floor = HomeFloor` or `CallUp[Floor]`))  
then schedule E2_ChangeState at time `Time + TimeToMoveDown + TimeToLooseSpeedDown`  
else Schedule E8_GoDown at time `Time + TimeToMoveDown`.


#### 4.1.9 E9_SetInaction
* Action:
  Clear `D2_BusyElevator`.  
  Execute the Decision subroutine.  
  (This action is scheduled in E3_OpenDoors, but almost always removed in E6_PrepareToMove).



### 4.2 ~~~ Decision subroutine ~~~

This subroutine is used to make a decision about the direction. If the elevator is in `Neutral`:
look for any calls. If there are any calls, let's move.
Otherwise move to home floor.


* Precondition 1:
  `State = Neutral`, the elevator is waiting at the home floor and at least one call button is pushed at the home floor.

* Action 1:
  Schedule E3_OpenDoors at time `Time + TimeToOpenDoors`.  
  Exit subroutine.

* Precondition 2:
  `State = Neutral` and no calls for home floor.
  
* Action 2:
  Find the smallest `f ≠ Floor` with at least one call button is pushed for `f`.  
  If such an `f` exists, then  
   -- set `Direction` accordingly (`GoingUp` or `GoingDown`)  
   -- if the elevator is waiting at the home floor and `f ≠ Floor`,  
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;then schedule E6_PrepareToMove at time `Time + TimeToCloseDoors`.  
  If no such `f` exists, then  
   -- if the subroutine was invoked by E6_PrepareToMove,  
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; then set `Direction` for moving to home floor;   
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; otherwise: exit subroutine.