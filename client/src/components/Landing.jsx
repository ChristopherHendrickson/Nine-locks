import { useState,useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import GameRules from './GameRules'

const Landing = ({user, errorMessage, socket }) => {
    const navigate = useNavigate()
    const [fields, setFields] = useState('')
    const [showRules,setShowRules] = useState(false)
    const handleChange = (event) => {
        const { name, value } = event.target
        setFields({
          ...fields,
          [name]: value
        })
    }

    const handleOpen = () =>{
        setShowRules(true)
    }

    const handleClose = () => {
        setShowRules(false)
    }

    const joinGame = (e) => {
        e.preventDefault()
        if (fields.room_id) {
            socket.emit('check_room_hosted',{room_id: fields.room_id})
        }
    }

    const Create = (e) => {
        e.preventDefault()
        navigate(`/${user.id}`)
    }

    useEffect(()=>{
        if (user) {
            socket.emit('leave',{current_user:user})
        }
    },[user])

    return (
        <>
            <div className='hover-panel'>
                <h1 className='title'>Nine Locks<img className='small-img'></img></h1>
                <form onSubmit={Create} autoComplete="off">
                    <input type='submit' className='btn-landing' value='Create A Game'></input>
                </form>

                <h2>Or Join A Game With A Code</h2>
                <form className='flex-col flex-center' onSubmit={joinGame} autoComplete="off">
                    <input type='text' onChange={handleChange} name='room_id' className='join-input' placeholder="Paste Game Code"></input>
                    <input type='submit' value='Join Game' className="btn-landing" ></input>
                </form>
                <p>First Time Playing? <button onClick={handleOpen} id="btn-open-rules">Read The Game Rules</button></p>
                <p id='landing-error'>{errorMessage}</p>
            </div>
            {showRules && <GameRules handleClose={handleClose}></GameRules>}
        </>
    )
}

export default Landing