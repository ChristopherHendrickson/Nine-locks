import { useState, useEffect } from "react"
import LeaveButton from "./LeaveButton"
import all_cards_images from '../lib/cards/imageExport'
import { useParams } from "react-router-dom"




const Game = ({ user, socket }) => {
    const { game_id } = useParams
    const [initDeck,setInitDeck] = useState([])
    const [players,setPlayers] = useState([])
    const [moves,setMoves] = useState([])
    const [isTurn,setIsTurn] = useState(user.id == game_id)

    socket.on('init_game', (data) => {
        console.log('RECIEVED GAME INIT')
        setInitDeck(data.init_deck)
        const players = data.players
        players.forEach((p)=>p.active=true)
        setPlayers(players)
    })

    socket.on('user_left', (user_left) => {
        const new_players = [...players]
        new_players.forEach((p)=>{
            if (p.id==user_left.id) {
                p.active = false
            }
        })
        setPlayers(new_players)
    })

    socket.on('move', (data)=>{
        return
        // important function
    })

    return (
        <>
            <p>GAME</p>
            <button><img src={all_cards_images.c4}/></button>
            <LeaveButton user={user} socket={socket}></LeaveButton>
        
        </>
    )
}

export default Game