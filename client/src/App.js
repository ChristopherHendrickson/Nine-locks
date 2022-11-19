import './App.css';
import { useState, useEffect } from 'react'
import Landing from './components/landing'
import Lobby from './components/lobby'
import { Routes, Route, useNavigate } from 'react-router-dom'

import io from 'socket.io-client';
const socket = io()



function App() {

  // user {id: xxx, username: abc}
  const [user,setUser] = useState({})
  const [msg,setMsg] = useState('')
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [users,setUsers] = useState([])
  const [currentRoom,setCurrentRoom] = useState(null)
  console.log('-----------------------------------')

  const handleJoin = (room_id) =>  {
    handleLeave()
    socket.emit("join", {current_user:user,room_id:room_id})
    setCurrentRoom(room_id)
  }

  const handleLeave = () => {

    if (currentRoom) {
      console.log('leaving', currentRoom)
      socket.emit("leave", {current_user:user,room_id:currentRoom})
    }
    setCurrentRoom(null)
  }

  const sendMessage = (message) =>{
    if (currentRoom) {
    socket.send(message,{
      'type':'msg',
      room:currentRoom
    })
  }
}

const socket_listeners = () => {
  socket.on('connect', () => {
    setIsConnected(true);
  });

  socket.on('disconnect', () => {
    console.log('DOES THIS EVER HAPPEN?')
    socket.emit("leave", {current_user:user,room_id:currentRoom})
  });

  socket.on('message',(msg)=>{  
    setMsg(msg)
  });

  socket.on('user_joined',(data) => {
    if (user.id != data.user_id) {
      const new_users=[...users,data.user_id]
      setUsers(new_users)
    } else {
      setUsers([...data.existing_users,user.id])
    }

  });

  socket.on('user_left',(user_id) => {
    console.log(`user ${user_id} left`)
    if (user.id==user_id) {
      setUsers([])
    } else {
      const new_users=[...users]
      const n = new_users.filter((u)=>{
        return u!=user_id
      })
      setUsers(n)
    }
  })

}

socket_listeners()
  










  useEffect( () => {

    const register = async () => {
      const rand_user = Math.floor(Math.random()*10)
      
      const res = await fetch("/api/register/", {
        method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
        
        body: JSON.stringify({"username":rand_user})
      })
    }
    const getUser = async () => {
      const res = await fetch('/api/verify/')
      const user_data = await res.json()
  
      if (res.status===200) {
        setUser(user_data.user) 
        socket.nickname=user_data.user.id
      } else {
        setUser(null)
      }
    }
    
    register()
    getUser()
    
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
        <Route path='/' element={<Landing user={user?.id} sendMessage={sendMessage} users={users} msg={msg} handleJoin={handleJoin} handleLeave={handleLeave}/>}/>
        <Route path='/:game_id/lobby' element={<Lobby user={user?.id} sendMessage={sendMessage} users={users} msg={msg} handleJoin={handleJoin} handleLeave={handleLeave}/>}/>
        {/* <Route path='/:game_id/play'/> */}
      </Routes>
    </div>
  );
}

export default App;
