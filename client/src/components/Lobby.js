import { useState,useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LeaveButton from './LeaveButton'

const Lobby = ({user, users, socket, currentRoom}) =>{
    
    


    const startGame = () => {
        socket.emit('start_game',{room_id:currentRoom})
    }

    return (
        <>
        <p>connected users</p>
            <ul>
            {users.map((u)=>{
                return <li key={u.id}>{u.username} - {u.id}</li>
            })}
            </ul>
            <p>Lobby</p>
            
            { user.id==currentRoom &&
            <button onClick={startGame}>Start Game</button>
            }
            <LeaveButton socket={socket} user={user} currentRoom={currentRoom}></LeaveButton>
        </>
    )
}
export default Lobby