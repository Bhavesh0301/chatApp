import './App.css';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useContext } from 'react';
import Login from './components/Login';
import { Context } from './Context';

function App() {
  const [user] = useContext(Context)
  return user ?
    (
      <div className="App">
        <div className="app_body">
          <Router>
            <Sidebar />
            <Routes>
              <Route path="/rooms/:roomId" element={<Chat />}></Route>
              <Route path="/" />
            </Routes>
          </Router>
        </div>
      </div>) : (
      <Login />
    )
}

export default App;
