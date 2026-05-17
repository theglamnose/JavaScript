import { createContext, useContext, useReducer } from "react";

import type { SimulatorState, SimulatorContext, SimulatorAction } from "../types";
import type { ReactNode } from "react";
import { SimulatorInitState, SimulatorStep, InitializeSimulator} from "../elevator.ts";



const initialContext: SimulatorContext = {
   state: SimulatorInitState(),
   dispatch: ()=>{}
}
const SimulatorContext = createContext<SimulatorContext>(initialContext);

export const useSimulatorContext = () => useContext(SimulatorContext);

const reducer = (state: SimulatorState, action:SimulatorAction):SimulatorState => {
    switch (action) {
        case "NextAction":
            // let ns: SimulatorState = SimulatorStep( state);
            // console.log("ns: " + ns.Time);
            
            // return(
            //     ns);
            return(
                SimulatorStep( )
            );
    
        case "Reset":
            InitializeSimulator();
            return SimulatorInitState();
        default:
            return state;
    }
}

export const SimulatorProvider = ({children}:{children: ReactNode}) => {
   const [state, dispatch] = useReducer(reducer, SimulatorInitState())


   return <SimulatorContext.Provider value={{state, dispatch}}>{children}</SimulatorContext.Provider>
}