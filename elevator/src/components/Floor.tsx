import { useSimulatorContext } from './simulator';
import type {   SimulatorContext  } from "../types";
import "./Floor.css"
import { HomeFloor } from '../elevator';

type FloorProps = {
    floor: number
}

export default function Floor( {floor}: FloorProps) {
    const c:SimulatorContext = useSimulatorContext();

  return (
    <div className='floor'>
        <p className={'floorNr' + ( floor == HomeFloor ? " home" : "")}>
            {floor}
        </p>
        <div className='queue'>
            {
                c.state.Queue[floor].map(
                    (n:number) =>
                        <p key={n}> {n}&nbsp; </p>
                )
            }
        </div>
        <div className='floorButtons'>
            {
                (   floor < 4 ?
                        <p className = { c.state.CallUp[floor] ? "on" : "off"} > &#9650; </p> : <></>

                )
            }
            {
                (
                    floor > 0 ?
                        <p className = { c.state.CallDown[floor] ? "on" : "off"} > &#9660; </p> : <></>
                )
            }
        </div>
    </div>
  )
}
