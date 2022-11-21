import { useInsertionEffect } from 'react'
import { useState,useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'


const JoinGame = ({user, setUser, socket}) =>{


    const { game_id } = useParams()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
        
    useEffect(() => {
        console.log(user)
        if (user.username){
            setUsername(user.username)
        }
    },[user])

    const handleChange = (event) => {
        event.preventDefault()
        setUsername(event.target.value)
    }
    const handleJoin = (room_id,new_user) =>  {
        console.log(new_user)
        socket.emit("join", {current_user:new_user,room_id:room_id})
    }

    const setNameAndJoinGame = (e) => {
        e.preventDefault()
        const new_user = {...user}
        new_user.username = username
        setUser(new_user)
        sessionStorage.setItem('user',JSON.stringify(new_user))
        handleJoin(game_id,new_user)
    }


    return (
        <>
            <form onSubmit={setNameAndJoinGame}>
                <input id="username" type='text' onChange={handleChange} name='username' value={username} required></input>
                <br/>
                <input type='submit' value='Join Game'></input>
            </form>
        </>
    )
}
export default JoinGame