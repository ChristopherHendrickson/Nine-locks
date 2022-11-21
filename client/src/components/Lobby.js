import { useState,useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LeaveButton from './LeaveButton'

const Lobby = ({user, users, socket, currentRoom}) =>{
    
    const [initDeck,setInitDeck]=useState([])
    
    useEffect(()=>{

        const shuffle = (arr) => {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }

        
        const deck = [
            '2c','2d','2h','2s','3c','3d','3h','3s','4c','4d','4h','4s',
            '5c','5d','6h','5s','6c','6d','6h','6s','7c','7d','7h','7s',
            '8c','8d','8h','8s','9c','9d','9h','9s','10c','10d','10h','10s',
            'jc','jd','jh','js','qc','qd','qh','qs','kc','kd','kh','ks','ac',
            'ad','ah','as',
        ]


        shuffle(deck)
        setInitDeck(deck)


    },[])


    const handleKick = (u) => {
        socket.emit('kick',{user:u})
    }

    const startGame = () => {
        socket.emit('start_game',{
            room_id:currentRoom
        })
        socket.emit('init_game',{
            room_id:currentRoom,
            players:users,
            init_deck:initDeck
        })
    }

    return (
        <>
        <p>connected users</p>
            <ul>
            {users.map((u)=>{
                return (
                    <li key={u.id}>{u.username} - {u.id} {u.id!=user.id && user.id==currentRoom && <button onClick={() => {handleKick(u)}}>Kick</button>}</li>
                )
            })}
            </ul>
            
            { user.id==currentRoom &&
            <button onClick={startGame}>Start Game</button>
            }
            <LeaveButton socket={socket} user={user}></LeaveButton>
        </>
    )
}
export default Lobby