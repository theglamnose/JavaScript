
export type User = {
    Name: number,
    In: number,
    Out: number,
    GiveUpTime: number, 
    InterTime: number
};


export type UserList = {
    Contents: string,
    Users: User[]
};

export type Action =
    { type:
        "U1_Enter" | "U2_Signal" | "U3_EnterQueue" | "U4_GiveUp" |
        "U5_GetIn" | "U6_GetOut" |
        "E1_Wait" | "E2_ChangeState" | "E3_OpenDoors" |
        "E4_LetPeopleOutIn" |
        "E5_CloseDoors" | "E6_PrepareToMove" | "E7_GoUp" |
        "E8_GoDown" |
        "E9_SetInaction",
      name?: number} // used for U2, U3, U4, U5, U6.
    ;

export type Event_t = [ number, Action]; // Time point and action.

export type ElevatorState = "GoingUp" | "GoingDown" | "Neutral";

export type SimulatorState = {
    UserList: UserList,
    Users: User[];
    Time: number,
    Action: string,
    EventList: Event_t[],
    Floor: number,
    State: ElevatorState,
    Elevator: number[],
    Queue: Record<number, number[]>,
    CallUp: boolean[],
    CallDown: boolean[],
    CallCar: boolean[]
}

export type SimulatorContext = {
    state: SimulatorState,
    dispatch: Function
}

export type SimulatorAction = "NextAction" | "Reset";
