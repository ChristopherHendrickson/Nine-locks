import { useState,useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'


const Landing = ({user, errorMessage, socket }) => {
    const navigate = useNavigate()
    const [fields, setFields] = useState('')
    
    const handleChange = (event) => {
        const { name, value } = event.target
        setFields({
          ...fields,
          [name]: value
        })
    }

    const joinGame = (e) => {
        e.preventDefault()
        socket.emit('check_room_hosted',{room_id: fields.room_id})
    }

    const Create = (e) => {
        e.preventDefault()
        navigate(`/${user.id}`)
    }

    useEffect(()=>{
        socket.emit('leave',{user:user})
    })

    return (
        <>
            
            <p>Create A New Game!</p>
            <form onSubmit={Create}>
                <input type='submit' value='Create Game'></input>
            </form>

            <p>Or.. Join A Game With A Code!</p>
            <form onSubmit={joinGame}>
                <input type='text' onChange={handleChange} name='room_id'></input>
                <br/>
                <input type='submit' value='Join Game'></input>
            </form>
            <p>{errorMessage}</p>
        </>
    )
}

export default Landing