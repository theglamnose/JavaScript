import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx';
import { SimulatorProvider } from './components/simulator.tsx';

createRoot(document.getElementById('root')!).render(
  <SimulatorProvider>
    <App />
  </SimulatorProvider>,
)
