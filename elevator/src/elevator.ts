
import type { ElevatorState, Action, Event_t, UserList, SimulatorState } from "./types";


// Simulation configuration

type Configuration = {
    content: string,
    elevator: {
        TimeToOpenDoors: number,
        TimeUntilClosingDoors: number,
        TimeUntilClosingDoorsFast: number,
        TimeToCloseDoors: number,
        TimeToHoldDoorsOpen: number,
        TimeToBuildUpSpeed: number,
        TimeToMoveUp: number,
        TimeToMoveDown: number,
        TimeToLooseSpeedUp: number,
        TimeToLooseSpeedDown: number,
        TimeUntilInaction: number
    },
    user: {
        TimeToLeaveCabin: number,
        TimeToEnterCabin: number
    }
}

const Config: Configuration = {
    "content": "Configuration file for the elevator simulation.",
    "elevator": {
        "TimeToOpenDoors": 20,
        "TimeUntilClosingDoors": 76,
        "TimeUntilClosingDoorsFast": 25,
        "TimeToCloseDoors": 20,
        "TimeToHoldDoorsOpen": 40,
        "TimeToBuildUpSpeed": 15,
        "TimeToMoveUp": 51,
        "TimeToMoveDown": 61,
        "TimeToLooseSpeedUp": 14,
        "TimeToLooseSpeedDown": 23,
        "TimeUntilInaction": 300
    },
    "user": {
        "TimeToLeaveCabin": 25,
        "TimeToEnterCabin": 25
    }
};

// Floor numbers: 
export const LowestFloor: number = 0;
export const HighestFloor: number = 4;
let NrOfFloors: number = HighestFloor + 1;
export const HomeFloor: number = 2;

// Users waiting at a floor in a queue:
let Queue: Record<number, number[]> =
    // floor -> name list
    Array.from({ length: NrOfFloors }, () => []);

function EnterQueue( name: number, floor: number){
    Queue[ floor].unshift( name); // at the front
}

function RemoveFromQueue( name: number, floor: number){
    Queue[ floor] =
        Queue[ floor].filter( (n:number) =>
            n != name)
}

// function IntList2Str(i: number[]): string{
//     return (
//         i
//             .map( String)
//             .join( " "))
// }

// Position of the elevator:
let Floor: number =
    HomeFloor;

// Call buttons at the floors and in the cabin:
let CallUp: boolean[] =
    Array( NrOfFloors).fill(false);

let CallDown: boolean[] =
    Array( NrOfFloors).fill(false);

let CallCar: boolean[] =
    Array( NrOfFloors).fill(false);

// function Buttons2Str(): string{
//     return (
//         CallCar
//             .map( ( b:boolean, f:number) => {
//                 return ( b ? String(f) : "")})
//             .join( " "))
// }

function AnyCall(floor: number): boolean{
    return (
        CallUp[ floor] || CallDown[ floor] || CallCar[ floor])
}

function NoCallsAbove(floor: number): boolean{
    for( let f = floor + 1; f <= HighestFloor; f++){
        if( AnyCall( f)) {
            return false;}
    };
    return true;
}

function NoCallsBelow(floor: number): boolean{
    for( let f = floor - 1; f >= LowestFloor; f--){
        if( AnyCall( f)) {
            return false;}
    };
    return true;
}

function NoCallCarBelow(floor: number): boolean{
    for( let f = floor - 1; f >= LowestFloor; f--){
        if( CallCar[ f]) {
            return false;}
    };
    return true;
}

function NoCallCarAbove(floor: number): boolean{
    for( let f = floor + 1; f <= HighestFloor; f++){
        if( CallCar[ f]) {
            return false;}
    };
    return true;
}

function FindCall(floor: number): number | undefined{
    for( let f = LowestFloor; f <= HighestFloor; f++){
        if( f != floor && AnyCall(f)){
            return f;}
    };
    return undefined;
}

// Elevator state

let State: ElevatorState =
    "Neutral";

// const StateToString: Record< ElevatorState, string> = {
//     "GoingDown": "v",
//     "GoingUp": "^",
//     "Neutral": "-"
// }

// Time clock (unit is tenths of seconds)
let Time: number = 0;

// Detector signals
let D1_PeopleTrespassing: boolean = false;

let D2_BusyElevator: boolean = false;

let D3_OpenDoors: boolean = false;

// List of events


const ElevatorActions: Action[] = [
    { type:"E1_Wait"}, { type:"E2_ChangeState"}, { type:"E3_OpenDoors"}, { type:"E4_LetPeopleOutIn"},
    { type:"E5_CloseDoors"}, { type:"E6_PrepareToMove"}, { type:"E7_GoUp"}, { type:"E8_GoDown"},
    { type:"E9_SetInaction"}
];

// function Action2Str( a: Action): string{
//     return(
//         a.type + ( a.name == undefined ? "" : "(" + a.name + ")" )
//     )
// }

function EqualActions( a1: Action, a2: Action): boolean{
    return (
        (a1.type == a2.type) && (a1.name == a2.name)
    )
}

function IsElevatorAction( a: Action): boolean{
    return (
        undefined !=
        ElevatorActions.find(
            ( a2: Action) => EqualActions( a, a2)))
}

// console.log( IsElevatorAction( {type:"E1_Wait"}));
// console.log( IsElevatorAction( {type:"U1_Enter"}));


// Events: 

// function Event2Str( [ t, a]: Event_t): string{
//     return(
//         String(t) + ":" + Action2Str(a)
//     )
// }

// function EventList2Str( el: Event_t[]): string{
//     return (
//         el
//             .map( Event2Str)
//             .join(" "))
// }

let Wait: Event_t[] = []; // Event list sorted by time point.

type Order = "LESS" | "EQUAL" | "GREATER";

function CompEvents( [t1,_]: Event_t, [t2,__]: Event_t): Order{
    // Compare events by time point.
    if( t1 < t2) return "LESS";
    if( t1 == t2) return "EQUAL";
    return "GREATER"; // t1 > t2
}

const NotFound: number = -1;
const InsertElement: number = 0;
function NewEvent( ne: Event_t): void{
    let i: number = Wait.findIndex(
        (e: Event_t) => CompEvents( ne, e) == "LESS");
    if( i == NotFound){
        Wait.push( ne);
    }else{
        Wait.splice( i, InsertElement, ne);
    }
}

const RemoveOneElement: number = 1;
function RemoveEvent( a: Action): void{
    let i: number = Wait.findIndex(
        ([_,ea]: Event_t) => EqualActions( ea, a));
    if( i != NotFound){
        Wait.splice( i, RemoveOneElement);}
}

function RescheduleEvent( e: Event_t): void{
    let [_,a]: Event_t = e;
    RemoveEvent(a);
    NewEvent( e);
}

function IsNextElevatorAction( a: Action): boolean{
    let i: number = Wait.findIndex(
        ([_,ea]: Event_t) => IsElevatorAction( ea));
    if( i == NotFound){
        return(
            EqualActions( a, {type:"E1_Wait"})
        )
    }else{
        let [_,a2]: Event_t = Wait[ i];
        return(
            EqualActions( a, a2)
        )
    }
}

// User data

type User = {
    Name: number,
    In: number,
    Out: number,
    GiveUpTime: number, 
    InterTime: number
};

// function User2Str( u: User):string{
//     let { Name, In, Out} = u;
//     return(
//         Name + "(" + String(In) + "->" + String(Out) + ")"
//     )   
// }

let Users: User[] = [];
   // Users, which are currently in the system.

// function UserList2Str( l: User[]): string{
//     return(
//         l   
//             .map( User2Str)
//             .join(" ")
//     )
// }

function GetUser( name: number): User | undefined{
    return(
        Users.find(
            (u:User) => u.Name == name))
}

function DeleteUser( name: number): void{
    let i: number = Users.findIndex(
        (u: User) => u.Name == name);
    if( i != NotFound){
        Users.splice( i, RemoveOneElement);}
}

// Users in the elevator cabin
let Elevator: number[] = [];

function GetIn( name: number): void{
    Elevator.unshift( name); // at the front
}    

function GetOut( name: number): void{
    let i: number = Elevator.findIndex(
        (n: number) => n == name);
    if( i != NotFound){
        Elevator.splice( i, RemoveOneElement);}
}

function RightDirection( name: number): boolean{
    // Return true iff the elevator state (direction)
    // fits with the target of user with the name.
    let u:User | undefined = GetUser( name);
    if( u == undefined) return false;
    let { In, Out} = u;
    switch ( State) {
        case "Neutral":
            return true
        case "GoingDown":
            return( In > Out);
        case "GoingUp":
            return( In < Out);
    }
}

// Decision subroutine

function Move( floor: number): void{
    if( Floor > floor){
        State = "GoingDown"
    }
    if( Floor < floor){
        State = "GoingUp"
    }
    if( IsNextElevatorAction( {type:"E1_Wait"}) && 
        floor != HomeFloor){
        NewEvent(
            [ Time + Config.elevator.TimeToCloseDoors,
            {type:"E6_PrepareToMove"}])
    }
}

function Decision( a: Action): void{
    if( State == "Neutral"){
        if(
            IsNextElevatorAction( {type:"E1_Wait"}) &&
            AnyCall( HomeFloor)){
                NewEvent(
                    [ Time + Config.elevator.TimeToOpenDoors,
                        {type:"E3_OpenDoors"}])
            }else{
                let f: number | undefined = FindCall( Floor);
                if( f == undefined){
                    if( a.type == "E6_PrepareToMove"){
                        Move( HomeFloor);
                    }
                }else{
                    Move( f)
                }
            }
    }
}

// Tracing


// function ShowSystem(){
//     function ShowFloors(){
//         let cl: string =
//             "[" + ( IntList2Str( Elevator)) + "]";
//         let es: string =
//             " ".repeat( 1 + cl.length);
//         for( let f = HighestFloor; f >= LowestFloor; f--){
//             console.log(            
//             ( f == Floor ? StateToString[ State] + cl : es) +
//             (String(f)) + " " +
//             ( CallUp[f] ? "u" : " ") + " " +
//             ( CallDown[f] ? "d" : " ") + " " +
//             ( IntList2Str( Queue[f])))}
//     };
//     console.log( "Time: " + String( Time));
//     console.log( EventList2Str( Wait));
//     ShowFloors();
//     console.log(
//         "Elevator: " +
//         ( D1_PeopleTrespassing ? "D1_PeopleTrespassing" : "") +
//         ( D2_BusyElevator ? "D2_BusyElevator" : "") +
//         ( D3_OpenDoors ? "D3_OpenDoors" : ""));
//     console.log(
//         "  Calls:" + Buttons2Str());
//     console.log(
//         "Users: " + UserList2Str( Users));    
// }

let Action: string = "";

async function ShowAction( s: string){
    // console.log( "\n*** " + s + "*********************");
    // ShowSystem();
    // await prompt( "Press <return> to continue.");
    Action = s;
}

// Elevator actions

function Elevator1_Wait(){
    // Elevator is at floor 2, waiting for a call with closed doors. 
    // Next action is E3_OpenDoors or E6_PrepareToMove, triggered by Decision subroutine.
    ShowAction( "E1 - Elevator dormant.");
}

function Elevator2_ChangeState(){
    ShowAction( "E2 - Elevator stops (change direction?).");
    switch (State) {
        case "GoingUp":
            if( NoCallsAbove( Floor)){
                if( NoCallCarBelow( Floor)){
                    State = "Neutral"
                }else{
                    State = "GoingDown"
                };
                CallCar[ Floor] = false;
                CallUp[ Floor] = false;
                CallDown[ Floor] = false;
            }
            break;
        case "GoingDown":
            if( NoCallsBelow( Floor)){
                if( NoCallCarAbove( Floor)){
                    State = "Neutral"
                }else{
                    State = "GoingUp"
                };
                CallCar[ Floor] = false;
                CallUp[ Floor] = false;
                CallDown[ Floor] = false;
            }
            break;
        case "Neutral":
            break;
    }
    NewEvent(
        [ Time, {type:"E3_OpenDoors"}])
}

function Elevator3_OpenDoors(){
    ShowAction( "E3 - Elevator doors start to open.");
    D1_PeopleTrespassing = true;
    D2_BusyElevator = true;
    RescheduleEvent( [Time + Config.elevator.TimeUntilInaction,
        {type:"E9_SetInaction"}]);
    NewEvent(
        [ Time + Config.elevator.TimeToOpenDoors,
            {type:"E4_LetPeopleOutIn"} ]);
    NewEvent(
        [ Time + Config.elevator.TimeUntilClosingDoors,
            {type:"E5_CloseDoors"}])
}

function Elevator4_LetPeopleOutIn(){

    function PeopleGettingOut( nl: number[]): boolean{
        let out: number | undefined = nl.find(
            (n:number) => {
                let u: User | undefined = GetUser(n);
                if( u == undefined) return false;
                let {Out} = u;
                return( Out == Floor);})
        if( out == undefined) return false;
        NewEvent( [ Time, {type:"U6_GetOut",name:out}]);
        RescheduleEvent(
            [ Time + Config.user.TimeToLeaveCabin,
                {type:"E4_LetPeopleOutIn"}]);
        return true;
    };

    function PeopleGettingIn( nl: number[]): boolean{
        let nin: number | undefined = nl.find( RightDirection);
        if( nin == undefined) return false;
        RemoveEvent( {type:"U4_GiveUp",name:nin});
        NewEvent(
            [ Time, {type:"U5_GetIn",name:nin}]);
        RescheduleEvent(
            [ Time + Config.user.TimeToEnterCabin,
                {type:"E4_LetPeopleOutIn"}]);        
        return true;
    }

    ShowAction( "E4 - Doors are open (let people getting in/out).");
    if( ! PeopleGettingOut( Elevator)){
        if( ! PeopleGettingIn( Queue[ Floor])){
            D1_PeopleTrespassing = false;
            D3_OpenDoors = true;
            // and wait for further activity: U2 or E5
        }
    }
}

function Elevator5_CloseDoors(){
    ShowAction( "E5 - Elevator doors start to close.");
    if( D1_PeopleTrespassing){
        // Fluttering doors.
        NewEvent(
            [ Time + Config.elevator.TimeToHoldDoorsOpen,
                {type:"E5_CloseDoors"}]);
    }else{
        D3_OpenDoors = false;
        NewEvent(
            [ Time + Config.elevator.TimeToCloseDoors,
                {type:"E6_PrepareToMove"}])
    }
}

function Elevator6_PrepareToMove(){
    ShowAction( "E6 - Elevator prepares to move.");
    CallCar[ Floor] = false;
    // Clear call buttons according to current direction.
    if( State != "GoingDown"){
        CallUp[ Floor] = false;
    }
    if( State != "GoingUp"){
        CallDown[ Floor] = false;
    }
    // Maybe the elevator is empty: going home?
    Decision( {type:"E6_PrepareToMove"});
    if( State == "Neutral"){
        NewEvent(
            [ Time, {type:"E1_Wait"}])
    }else{
        if( D2_BusyElevator){
            RemoveEvent( {type:"E9_SetInaction"})
        }
        if( State == "GoingUp"){
            NewEvent(
                [ Time + Config.elevator.TimeToBuildUpSpeed,
                  {type:"E7_GoUp"}])
        }else{ // State = GoingDown
            NewEvent(
                [ Time + Config.elevator.TimeToBuildUpSpeed,
                  {type:"E8_GoDown"}])
        }
    }
}

function Elevator7_GoUp(){
    ShowAction( "E7 - Elevator moving up.");
    Floor++;
    if( CallCar[ Floor] || CallUp[ Floor] ||
        (   (Floor == HomeFloor || CallDown[ Floor]) &&
            NoCallsAbove( Floor))){
        NewEvent(
            [ Time + Config.elevator.TimeToLooseSpeedUp +
                Config.elevator.TimeToMoveUp,
              {type:"E2_ChangeState"}])
    }else{
            NewEvent(
                [ Time + Config.elevator.TimeToMoveUp,
                  {type:"E7_GoUp"}])
    }
}

function Elevator8_GoDown(){
    ShowAction( "E8 - Elevator moving down.");
    Floor--;
    if( CallCar[ Floor] || CallDown[ Floor] ||
        (   (Floor == HomeFloor || CallUp[ Floor]) &&
            NoCallsBelow( Floor))){
        NewEvent(
            [ Time + Config.elevator.TimeToLooseSpeedDown +
                Config.elevator.TimeToMoveDown,
             {type:"E2_ChangeState"}])
    }else{
            NewEvent(
                [ Time + Config.elevator.TimeToMoveDown,
                  {type:"E8_GoDown"}])
    }
}

function Elevator9_SetInaction(){
    ShowAction( "E9 - No activities, going idle.");
    D2_BusyElevator = false;
    Decision( {type:"E9_SetInaction"});
}

// User actions

const Sim1: UserList  = 
{
        "Contents": "Simulation example taken from Knuth's textbook, p.286.",
        "Users": [
            { "Name": 1, "In": 0, "Out": 2, "GiveUpTime": 152, "InterTime": 38},
            { "Name": 2, "In": 4, "Out": 1, "GiveUpTime": 500, "InterTime": 98},
            { "Name": 3, "In": 2, "Out": 1, "GiveUpTime": 800, "InterTime": 5},
            { "Name": 4, "In": 2, "Out": 1, "GiveUpTime": 800, "InterTime": 150},
            { "Name": 5, "In": 3, "Out": 1, "GiveUpTime": 500, "InterTime": 73},
            { "Name": 6, "In": 2, "Out": 1, "GiveUpTime": 176, "InterTime": 238},
            { "Name": 7, "In": 1, "Out": 2, "GiveUpTime": 600, "InterTime": 225},
            { "Name": 8, "In": 1, "Out": 0, "GiveUpTime": 400, "InterTime": 49},
            { "Name": 9, "In": 1, "Out": 3, "GiveUpTime": 400, "InterTime": 172},
            { "Name": 10, "In": 0, "Out": 4, "GiveUpTime": 400, "InterTime": 650}]}

const FirstIndex: number = 0;

let NextUser: number = FirstIndex;

function Values(): User | undefined{
    if( NextUser >= Sim1.Users.length) return undefined;
    return(
        Sim1.Users[ NextUser++])
}

function User1_Enter(){
    let v:User | undefined = Values();
    if( v == undefined) return;
    let {Name,In,Out,InterTime} = v;
    ShowAction(
        "U1 - User " + Name + " arrives at floor " + In +
        ", destination is " + Out);
    Users.push(v);
    NewEvent(
        [ Time + InterTime, {type:"U1_Enter"}]);
    NewEvent(
        [ Time, {type:"U2_Signal", name:Name}])
}

function User2_Signal( name: number){
    let u: User | undefined = GetUser( name);
    if( u == undefined) return;
    let {In,Out} = u;
    ShowAction( "U2 - User " + name + " signals at floor " + In); 
    if( In == Floor){
        if( IsNextElevatorAction({type:"E6_PrepareToMove"})){
            // Stop closing doors.
            RemoveEvent({type:"E6_PrepareToMove"});
            NewEvent(
                [ Time, {type:"E3_OpenDoors"}])
        }else{
            if( D3_OpenDoors){
                // Enter cabin
                D3_OpenDoors = false;
                D1_PeopleTrespassing = true;
                NewEvent(
                    [ Time, {type:"E4_LetPeopleOutIn"}])
            }
        }
    }else{ // In <> Floor
        // Press call button
        if( In < Out){
            CallUp[ In] = true
        }
        if( In > Out){
            CallDown[ In] = true
        }
        if( (! D2_BusyElevator) ||
            IsNextElevatorAction({type:"E1_Wait"})){
            // Wake elevator
            Decision({type:"U2_Signal",name:name})
        }
    };
    NewEvent(
        [ Time, {type:"U3_EnterQueue",name:name}])
}

function User3_EnterQueue( name: number){
    let u: User | undefined = GetUser( name);
    if( u == undefined) return;
    let {In,GiveUpTime} = u;
    ShowAction( "U3 - User " + name + " enters queue at floor " + In);
    EnterQueue( name, In);
    NewEvent(
        [ Time + GiveUpTime, {type:"U4_GiveUp",name:name}])
    // Wait for elevator.
}

function User4_GiveUp( name: number){
    let u: User | undefined = GetUser( name);
    if( u == undefined) return;
    let {In} = u;
    if( Floor != In || D1_PeopleTrespassing ||
        ( Floor == In && !D1_PeopleTrespassing)){
        ShowAction( "U4 - User " + name +
            " decides to give up and leaves the system.");
        RemoveFromQueue( name, In);
        DeleteUser( name)
    } // Else: wait a little while to enter.
}

function User5_GetIn( name: number){
    let u: User | undefined = GetUser( name);
    if( u == undefined) return;
    let {In,Out} = u;
    ShowAction( "U5 - User " + name + " gets in at floor " + In);
    RemoveFromQueue( name, In);
    GetIn( name);
    CallCar[ Out] = true;
    if( State == "Neutral"){
        // Start elevator.
        if( Floor < Out){
            State = "GoingUp"
        }else{
            State = "GoingDown"
        };
        RescheduleEvent(
            [ Time + Config.elevator.TimeUntilClosingDoorsFast,
                {type:"E5_CloseDoors"}])
    }
}


function User6_GetOut( name: number){
    ShowAction( "U6 - User " + name + " gets out at floor " + Floor +
        " and leaves the system.");
    GetOut(name);
    DeleteUser(name);
}

// Event handler

function ExecAction( a: Action){
    if( EqualActions( a, {type:"E1_Wait"})){
        Elevator1_Wait();
        return;
    }
    if( EqualActions( a, {type:"E2_ChangeState"})){
        Elevator2_ChangeState();
        return;
    }
    if( EqualActions( a, {type:"E3_OpenDoors"})){
        Elevator3_OpenDoors();
        return;
    }
    if( EqualActions( a, {type:"E4_LetPeopleOutIn"})){
        Elevator4_LetPeopleOutIn();
        return;
    }
    if( EqualActions( a, {type:"E5_CloseDoors"})){
        Elevator5_CloseDoors();
        return;
    }
    if( EqualActions( a, {type:"E6_PrepareToMove"})){
        Elevator6_PrepareToMove();
        return;
    }
    if( EqualActions( a, {type:"E7_GoUp"})){
        Elevator7_GoUp();
        return;
    }
    if( EqualActions( a, {type:"E8_GoDown"})){
        Elevator8_GoDown();
        return;
    }
    if( EqualActions( a, {type:"E9_SetInaction"})){
        Elevator9_SetInaction();
        return;
    }
    if( EqualActions( a, {type:"U1_Enter"})){
        User1_Enter();
        return;
    }
    if( a.type == "U2_Signal"){
        User2_Signal( a.name!);
        return;
    }
    if( a.type == "U3_EnterQueue"){
        User3_EnterQueue( a.name!);
        return;
    }
    if( a.type == "U4_GiveUp"){
        User4_GiveUp( a.name!);
        return;
    }
    if( a.type == "U5_GetIn"){
        User5_GetIn( a.name!);
        return;
    }
    if( a.type == "U6_GetOut"){
        User6_GetOut( a.name!);
        return;
    }
}

export function InitializeSimulator(){
    Users = [];
    Time = 0;
    Wait = [];
    NewEvent( 
        [ Time, {type:"U1_Enter"}]);
    Action = "Elevator dormant";
    Floor = HomeFloor;
    State = "Neutral";
    Elevator = [];
    D1_PeopleTrespassing = false;
    D2_BusyElevator = false;
    D3_OpenDoors = false;
    Queue = Array.from({ length: NrOfFloors }, () => []);
    CallDown = Array( NrOfFloors).fill(false);
    CallUp = Array( NrOfFloors).fill(false);
    CallCar = Array( NrOfFloors).fill(false);
}

export function SimulatorInitState(): SimulatorState{
    // Call reset function for all simulator variables.
    return({
        UserList: Sim1,
        Users: Users,
        Time: Time,
        Action: Action,
        EventList: Wait,
        Floor: Floor,
        State: State,
        Elevator: Elevator,
        Queue: Queue,
        CallDown: CallDown,
        CallUp: CallUp,
        CallCar: CallCar
    })
}

export function SimulatorStep( ): SimulatorState{
    let e: Event_t | undefined = Wait.shift();
    if( e == undefined){
        return({
            UserList: Sim1,
            Users: Users,
            Time: Time,
            Action: "No more events, terminating simulation.",
            EventList: Wait,
            Floor: Floor,
            State: State,
            Elevator: Elevator,
            Queue: Queue,
            CallDown: CallDown,
            CallUp: CallUp,
            CallCar: CallCar
        })
    }else{
        let [t,a]: Event_t = e;
        Time = t;
        ExecAction( a);
        return({
            UserList: Sim1,
            Users: Users,
            Time: Time,
            Action: Action,
            EventList: Wait,
            Floor: Floor,
            State: State,
            Elevator: Elevator,
            Queue: Queue,
            CallDown: CallDown,
            CallUp: CallUp,
            CallCar: CallCar
        })
    }
}

InitializeSimulator();
