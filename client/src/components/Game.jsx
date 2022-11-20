import { useState,useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Lobby from './Lobby'
import JoinGame from './JoinGame'


const Game = ({user, setUser, users, msg, sendMessage, socket}) =>{
    
    const { game_id } = useParams()
    const navigate = useNavigate()
    const [currentRoom,setCurrentRoom] = useState(null)

    
    const handleLeave = () => {
        if (currentRoom) {
          socket.emit("leave", {current_user:user,room_id:currentRoom})
        }
        setCurrentRoom(null)
    }

    // const sendMessage = (message) =>{
    //     if (currentRoom) {
    //     socket.send(message,{
    //       'type':'msg',
    //       room:currentRoom
    //     })
    //   }
    //   }


    return (
        <>
            {user.usernmae==='' ?
                <JoinGame user={user} setUser={setUser} socket={socket}></JoinGame>:
                <Lobby user={user} setUser={setUser} users={users} msg={msg} sendMessage={sendMessage} handleLeave={handleLeave}></Lobby> 
            }
        </>
    )
}

export default Game