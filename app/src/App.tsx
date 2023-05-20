import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Reset from './components/auth/Reset';
import Dashboard from './components/auth/Dashboard';
import { environment_name } from './environment';
import { api_auth_test, api_ping } from './api/ping';
import { useState } from 'react';

function App() {

  let [apiResponse, setApiResponse] = useState(null);

  return (
    <div className="App">
      <small>You are running this application in <b>{environment_name}</b> mode.</small><br/>
      <button onClick={
        async () => {
          setApiResponse(await api_ping());
        }
      }>Call root</button><br/>
      <button onClick={
        async () => {
          setApiResponse(await api_auth_test());
        }
      }>Call API auth test</button>
      { 
        (apiResponse) 
        ? (
          <div><br/>
          API Response:<br/>
          {apiResponse}
        </div>
        )
        : ""
      }
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
