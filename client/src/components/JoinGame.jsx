import { useState,useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'


const JoinGame = ({user, setUser, socket}) =>{


    const { game_id } = useParams()
    const navigate = useNavigate()

    const [fields, setFields] = useState('')
        
    const handleChange = (event) => {
        const { name, value } = event.target
        setFields({
          ...fields,
          [name]: value
        })
    }
    const handleJoin = (room_id) =>  {
        socket.emit("join", {current_user:user,room_id:room_id})
    }

    const setNameAndJoinGame = (e) => {
        e.preventDefault()
        const new_user = {...user}
        console.log(new_user.username)
        new_user.username = fields.username
        setUser(new_user)
        handleJoin(game_id)
    }


    return (
        <>
            <form onSubmit={setNameAndJoinGame}>
                <input id="username" type='text' onChange={handleChange} name='username' required></input>
                <br/>
                <input type='submit' value='Join Game'></input>
            </form>
        </>
    )
}
export default JoinGame