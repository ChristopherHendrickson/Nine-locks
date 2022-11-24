import { useState,useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LeaveButton from './LeaveButton'

const Lobby = ({user, users, socket, currentRoom, view}) =>{
    
    const [initDeck,setInitDeck]=useState([])
    const [buttonText,setButtonText] = useState('Click here to copy the invite code')
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
            'c2','d2','h2','s2','c3','d3','h3','s3','c4','d4','h4','s4',
            'c5','d5','h5','s5','c6','d6','h6','s6','c7','d7','h7','s7',
            'c8','d8','h8','s8','c9','d9','h9','s9','c10','d10','h10','s10',
            'cj','dj','hj','sj','cq','dq','hq','sq','ck','dk','hk','sk','ca',
            'da','ha','sa',
        ]


        shuffle(deck)
        setInitDeck(deck)


    },[view])


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

    const copyText = () => {
        navigator.clipboard.writeText(currentRoom);
        setButtonText('Code Copied!')
        setTimeout(() => {
            setButtonText('Click here to copy the invite code')
        },1500)
    }

    return (
        
        <div className="main-content">
            <div className='hover-panel'>
                <h1 className='title'>Nine Locks</h1>
                <h2>{users[0].username}'s Game</h2>
                <ul className='lobby-players'>
                {users.map((u)=>{
                    return (
                        <li key={u.id}>
                                {u.username}
                                {u.id!=user.id && user.id==currentRoom && <button className='kick-btn' onClick={() => {handleKick(u)}}>Kick</button>}
                        </li>
                    )
                })}
                </ul>
                
                { user.id==currentRoom &&
                <>
                <p>Share the URL of this page to invite players</p>
                <p>Or click the button below to copy the invite code</p>
                <button className='btn-copy' onClick={copyText}><p id='code'>{buttonText}</p></button>
                
                <button onClick={startGame} disabled={users.length>4} className='btn-landing'>Start Game</button>
                </>
                }
                <LeaveButton socket={socket} user={user} style={'leave-lobby'}></LeaveButton>
            </div>
        </div>
    )
}
export default Lobby