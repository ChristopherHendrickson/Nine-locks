import { useState,useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'


const Lobby = () =>{
    const { game_id } = userParams()
    const navigate = useNavigate()

    return (
        <>
            <p>lobby for {game_id}</p>
        </>
    )
}

export default Lobby