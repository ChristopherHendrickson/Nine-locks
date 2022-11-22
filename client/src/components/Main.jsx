import { useState,useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Lobby from './Lobby'
import JoinGame from './JoinGame'
import Chat from './Chat'
import Game from './Game'


const Main = ({user, setUser, msg, sendMessage, socket}) =>{
    
    const { game_id } = useParams()
    const navigate = useNavigate()
    const [currentRoom,setCurrentRoom] = useState(null)
    const [view,setView] = useState('join')
    const [users,setUsers] = useState([])




    socket.on('user_left', (user_left) => {
        if (user_left.id == user.id) {
            setUsers([])
            setCurrentRoom(null)
            navigate('/')
        } else {
            const new_users = [...users]
            console.log(new_users,'unchanged')
            const n = new_users.filter((u)=>{

                return u.id!=user_left.id
            })
            console.log(n)
            setUsers([...n])
        }      
    })


    socket.on('user_joined', (data)=>{
        console.log('user joined')
        console.log(data, 'data')
        if (data.user.id == user.id) {
            setUsers([...data.existing_users,data.user])
            console.log([data.existing_users,data.user],'set to this')
            setCurrentRoom(data.room_id)
            setView('lobby')
        } else {
            setUsers([...users,data.user])
        }
    })

    socket.on('start_game', () => {
        setView('game')
    })



    return (
        <div className="main">
            {view == 'join' && <JoinGame user={user} setUser={setUser} socket={socket}></JoinGame> }
            {view == 'lobby' && <Lobby user={user} users={users} socket={socket} currentRoom={currentRoom}></Lobby> }
            {view == 'game' && <Game socket={socket} user={user} ></Game> }
            {view != 'join' && <Chat user={user} socket={socket} currentRoom={currentRoom}></Chat> }
        </div>

    )
}

export default Main