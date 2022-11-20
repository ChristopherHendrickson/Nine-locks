import { useState, useEffect } from 'react'
import Landing from './components/Landing'
import Game from './components/Game'
import { Routes, Route, useNavigate } from 'react-router-dom'

import io from 'socket.io-client';
const socket = io()

function App() {

  // user {id: xxx, username: abc}
  const [user,setUser] = useState({})
  const [msg,setMsg] = useState('')
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [users,setUsers] = useState([])


  const socket_listeners = () => {
    socket.on('connect', () => {
      setIsConnected(true);
    });


    socket.on('message',(msg)=>{  
      setMsg(msg)
    });

    socket.on('user_joined',(data) => {
      if (user.id != data.user.id) {
        const new_users=[...users,data.user]
        setUsers(new_users)
      } else {
        setUsers([...data.existing_users,user])
      }

    });

    socket.on('user_left',(leaving_user) => {
      console.log(`user ${leaving_user.id} left`)
      if (user.id==leaving_user.id) {
        setUsers([])
      } else {
        const new_users=[...users]
        const n = new_users.filter((u)=>{
          return u.id!=leaving_user.id
        })
        setUsers(n)
      }
    })

  }

  socket_listeners()
  










  useEffect( () => {

    const register = async () => {

      const res = await fetch("/api/register/", {
        method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
        
        body: JSON.stringify({"username":''})
      })
      
      const user_data = await res.json()

      if (res.status===200) {
        setUser(user_data.user) 
        console.log('user id',user_data.user.id)
      } else {
        setUser(null)
      }
    }
    
    register()

    
  },[])

  // useEffect( () => {
  //   console.log(user, '(user)')

  // },[user])

  // useEffect( () => {
  //   console.log(users, '(users)')
  //   console.log(isConnected)
  // },[users])

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Landing user={user}/>}/>
        <Route path='/:game_id/' element={<Game user={user} users={users} msg={msg} socket={socket}/>}/>
      </Routes>
    </div>
  );
}

export default App;
