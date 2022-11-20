import { useState,useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'


const Lobby = ({user, setUser, socket}) =>{

    const [fields, setFields] = useState('')
    const setNameAndJoinGame = () => {
        return
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setFields({
          ...fields,
          [name]: value
        })
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
export default Lobby