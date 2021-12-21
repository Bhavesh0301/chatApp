import './App.css';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import Login from './components/Login';
import { Context } from './Context';
import db from './firebase';
import NullPage from './components/NullPage';

function App() {
  const [user] = useContext(Context);
  const [state, setState] = useState('');
  useEffect(async () => {
    if (user) {
      const a = await db.collection('login').get();
      a.docs.map((doc) => {
        if (doc.data().id === user.user.email) {
          setState(doc.id);
        }
        return null;
      })
    }
  }, [user])
  window.addEventListener("beforeunload", (ev) => {
    if (user) {
      navigator.sendBeacon(`https://quiet-plateau-71296.herokuapp.com/api/${state}`);
    }
  });
  return user ?
    (
      <div className="App">
        <div className="app_body">
          <Router>
            <Sidebar />
            <Routes>
              <Route path="/rooms/:roomId" element={<Chat />}></Route>
              <Route path="/" element={<NullPage />} />
            </Routes>
          </Router>
        </div>
      </div>) : (
      <Login />
    )
}

export default App;
