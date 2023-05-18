import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Reset from './components/auth/Reset';
import Dashboard from './components/auth/Dashboard';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
