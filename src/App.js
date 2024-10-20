import { Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import DeveloperTool from './components/DeveloperTool';
import BugDetails from './components/BugDetails';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path="/developer-tool" element={<BugDetails />} />
    </Routes>
  //  <Dashboard/>
  );
}

export default App;
