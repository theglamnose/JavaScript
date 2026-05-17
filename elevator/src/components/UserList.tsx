
import { useSimulatorContext } from './simulator';
import type { User,  SimulatorContext  } from "../types";
import "./UserList.css";


export default function UserList() {
    const c:SimulatorContext = useSimulatorContext();
    function inSystem(n:number):boolean{
        return(
            undefined !=
            (c.state.Users.find(
                (u:User) => u.Name == n))
        )
    }
  return (
    <div>
        <h2>User list</h2>
        <table>
            <tbody>
            <tr>
                <th>Name</th>
                <th>In</th>
                <th>Out</th>
                <th>Give up</th>
                <th>Next</th>
            </tr>
            {
                c.state.UserList.Users.map(
                    (u:User) =>
                        <tr key={u.Name}>
                            <td className= { inSystem( u.Name) ? "in" : "out" }>
                                {u.Name}</td>
                            <td>{u.In}</td>
                            <td>{u.Out}</td>
                            <td>{u.GiveUpTime}</td>
                            <td>{u.InterTime}</td>
                        </tr>
                )
            }
            </tbody>
        </table>
        <p> {c.state.UserList.Contents } </p>

    </div>    
  )
}
