import { useState,useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const Landing = ({user, handleJoin }) => {
    const navigate = useNavigate()
    const [fields, setFields] = useState('')
    
    const handleChange = (event) => {
        const { name, value } = event.target
        setFields({
          ...fields,
          [name]: value
        })
    }

    const join = (e) => {
        e.preventDefault()
    }

    const Create = (e) => {
        console.log(user)
        e.preventDefault()
        handleJoin(user.id)
        navigate(`/${user.id}`)
    }


    return (
        <>
            
            <p>Create A New Game!</p>
            <form onSubmit={Create}>
                <input type='submit' value='Create Game'></input>
            </form>

            <p>Or.. Join A Game With A Code!</p>
            <form onSubmit={join}>
                <input type='text' onChange={handleChange} name='room_id'></input>
                <br/>
                <input type='submit' value='Join Game'></input>
            </form>
        </>
    )
}

export default Landing