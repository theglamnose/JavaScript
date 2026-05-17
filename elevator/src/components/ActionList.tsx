import { useSimulatorContext } from './simulator';
import type {  Event_t, SimulatorContext  } from "../types";
import "./ActionList.css"

export default function ActionList() {
    const c:SimulatorContext = useSimulatorContext();
    let dispatcher = c.dispatch;
  return (
    <div id='actionList'>
        <h2>Action list</h2> 
        <button
            onClick={ () => dispatcher( "NextAction") }>
            Next Action
        </button>
        <button id='reset'
            onClick={ () => dispatcher( "Reset") }>
            Reset
        </button>
        <p>Time: { c.state.Time }</p>
        <p> { c.state.Action } </p>
        <table id='eventList'>
          <tbody>
            <tr>
              <th>Time</th>
              <th>Action</th>
            </tr>
            {
              c.state.EventList.map(
                ([t,a]:Event_t) => 
                  <tr key={ t + a.type}>
                    <td>{t}</td>
                    <td>{a.type +
                      ( a.name == undefined ? "" : "(" + a.name + ")")}
                    </td>
                  </tr>
              )
            }
          </tbody>
        </table>
    </div>
  )
}
