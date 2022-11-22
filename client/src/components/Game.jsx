import { useState, useEffect } from "react"
import LeaveButton from "./LeaveButton"
import all_cards_images from '../lib/cards/imageExport'
import { useParams } from "react-router-dom"
import GameController from "../lib/GameController/GameController" 



const Game = ({ user, socket }) => {
    console.log('game compo')
    const { game_id } = useParams
    const [gameController,setGameController] = useState(null)
    const [initDeck,setInitDeck] = useState([])
    const [moves,setMoves] = useState([])
    const [isTurn,setIsTurn] = useState(user.id == game_id)

    const [players,setPlayers] = useState([]) // object with id, username, hands > cards
    const [piles,setPiles] = useState([])
    const [deck,setDeck] = useState(0)

    const [selectedCard,setSelkectedCard] = useState(null)
    console.log('letting game controller')

    socket.on('init_game', (data) => {
        console.log('RECIEVED GAME INIT')
        const init_deck = data.init_deck
        const players = data.players
        players.forEach((p)=>p.connected=true)
        setGameController(new GameController({ "init_deck":init_deck,"players":players,"setPlayers":setPlayers,"setPiles":setPiles,"setDeck":setDeck }))
        // Create game controller, let game controller set state on init
    })

    useEffect(()=>{
        if (gameController) {
            gameController.move('init')

            socket.on('user_left', (user_left) => {
                gameController.playerLeft(user_left)                
            })
            socket.on('move', (data)=>{
                gameController.move(data)
            })
        }
    },[gameController])



    useEffect(()=>{
        console.log(players)
    },[players])



    return (
        <>
            <p>GAME</p>
            {players.map((p)=>{
                return (
                    <>
                    <p key={p.id}>{p.username} - {p.connected ? 'connected':'disconnected'}</p>

                    </>
                )
            })}
            {players.map((p)=>{
                const shownCards = []
                const hiddenCards = []
                p.handShown.forEach((card)=>{
                    shownCards.push(<img src={card.image}></img>)
                })
                p.handHidden.forEach((card)=>{
                    hiddenCards.push(<img src={card.image}></img>)
                })
                return [shownCards,hiddenCards,<br></br>] 
                
            })}
            <LeaveButton user={user} socket={socket}></LeaveButton>
        
        </>
    )
}

export default Game