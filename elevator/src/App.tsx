
import './App.css';
import UserList from './components/UserList';
import ActionList from './components/ActionList';
import Building from './components/Building';

function App() {

  return (
    <>
      <h1>Elevator Simulation</h1>
      <div id='frame'>
        <UserList/>
        <ActionList/>
        <Building/>
      </div>
    </>
  )
}

export default App
