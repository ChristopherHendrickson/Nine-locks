import React, { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom'

const Landing = ({user, sendMessage, users, msg, handleJoin, handleLeave}) => {
    const { room_id }=useParams()
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
        console.log(fields.room_id)
        handleJoin(fields.room_id)
    }


    const submitMessage = (e) => {
        console.log(fields.message)
        e.preventDefault()
        sendMessage(fields.message)
    }

    return (
        <>
            <h1>i am {user}</h1>
            <hr/>
            <h4>connected users</h4>
            {users.map((u)=>{
                return <p key={u}>{u} - user</p>
            })}
            <hr/>

            <h2>{msg}</h2>
            <button onClick={handleLeave}>leave</button>
            <br/>
            <form onSubmit={submitMessage}>
                <input type='text' onChange={handleChange} name='message'></input>
                <input type='submit'></input>
            </form>

            <form onSubmit={join}>
                <input type='text' onChange={handleChange} name='room_id'></input>
                <input type='submit' value='join room'></input>
            </form>
        </>
    )
}

export default Landing