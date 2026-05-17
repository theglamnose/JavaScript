

import Floor from "./Floor.tsx";
import Shaft from "./Shaft.tsx";
import "./Building.css";


export default function Building() {
  return (
    <div id="building">
        <div id='floorList'>        
            <Floor floor={4}></Floor>
            <Floor floor={3}></Floor>
            <Floor floor={2}></Floor>
            <Floor floor={1}></Floor>
            <Floor floor={0}></Floor>
        </div>
        <Shaft />
    </div>
  )
}
