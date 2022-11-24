import { useState, useEffect } from 'react'
import Landing from './components/Landing'
import Main from './components/Main'
import { Routes, Route, useNavigate } from 'react-router-dom'

import './App.css';


import io from 'socket.io-client';
const socket = io()

function App() {
  // user {id: xxx, username: abc}
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [errorMessage,setErrorMessage] = useState('')


  useEffect(() => {
    const register = async () => {
      const stored_user = sessionStorage.getItem('user')

      if (stored_user) {
        setUser(JSON.parse(stored_user))
      } else {
        const res = await fetch("/api/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({ "username": '' })
        })


        const user_data = await res.json()

        if (res.status === 200) {
          setUser(user_data.user)
          sessionStorage.setItem('user', JSON.stringify(user_data.user))
        } else {
          setUser(null)
        }
      }
    }

    register()

    socket.on('hosted_confirmation', (data) => {
      navigate(`/${data.room_id}`)
    })

    socket.on('connection_error', (data) => {
      if (data.status == 404 || data.status == 403) {
        setErrorMessage(data.message)
        navigate('/')
      }
    })


  }, [])


  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Landing user={user} socket={socket} errorMessage={errorMessage}/>} />
        <Route path='/:game_id/' element={<Main user={user} setUser={setUser} socket={socket} />} />
      </Routes>
    </div>
  );
}

export default App;
