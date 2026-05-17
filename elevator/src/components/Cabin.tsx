import "./Cabin.css";

import { useSimulatorContext } from './simulator';
import type {   SimulatorContext  } from "../types";
import Button from "./Button";

export default function Cabin( ) {
    const c:SimulatorContext = useSimulatorContext();
    const top:string = 
        (( 4 - c.state.Floor) * 122) + "px"
  return (
    <div id="cabin"
        style= {{ marginTop: top }}   >
        <div id="cabinButtons">
            <Button floor={4} pushed={c.state.CallCar[4]}></Button>
            <Button floor={3} pushed={c.state.CallCar[3]}></Button>
            <Button floor={2} pushed={c.state.CallCar[2]}></Button>
            <Button floor={1} pushed={c.state.CallCar[1]}></Button>
            <Button floor={0} pushed={c.state.CallCar[0]}></Button>
        </div>
        <div id='cabinQueue'>
            {
                c.state.Elevator.map(
                    (n:number) =>
                        <p key={n}> {n}&nbsp; </p>)}
        </div>
        <div id="direction">            
            {
                (
                    (c.state.State == "GoingDown") ? <p> &#9660; </p>  :
                    (
                        (c.state.State == "GoingUp") ? <p> &#9650; </p>  : <p>  </p>
                    )
                )
            }
        </div>
    </div>
  )
}
