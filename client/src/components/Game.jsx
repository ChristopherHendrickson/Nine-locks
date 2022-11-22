import { useState, useEffect } from "react"
import LeaveButton from "./LeaveButton"
import all_cards_images from '../lib/cards/imageExport'
import { useParams } from "react-router-dom"
import GameController from "../lib/GameController/GameController" 
import PlayerArea from "./PlayerArea"
import PileArea from "./PileArea"

import card_back from '../lib/cards/0.png'

const Game = ({ user, socket }) => {

    const { game_id } = useParams()
    const [gameController,setGameController] = useState(null)
    const [initDeck,setInitDeck] = useState([])
    const [moves,setMoves] = useState([])
    const [isTurn,setIsTurn] = useState(user.id == game_id)

    const [players,setPlayers] = useState([])
    const [piles,setPiles] = useState([])
    const [deck,setDeck] = useState(0)

    const [selectedCard,setSelectedCard] = useState(null)

    socket.on('init_game', (data) => {
        console.log('RECIEVED GAME INIT')
        const init_deck = data.init_deck
        const _players = data.players
        _players.forEach((p)=>p.connected=true)
        setGameController(new GameController({ "init_deck":init_deck,"players":_players,"setPlayers":setPlayers,"setPiles":setPiles,"setDeck":setDeck,"setIsTurn":setIsTurn }))
    })

    useEffect(()=>{
        if (gameController) { //once we get the gameController set up, tell it to init the game
            console.log('init game')
            gameController.move({type:'init'})

            socket.on('user_left', (user_left) => {
                gameController.playerLeft(user_left)                
            })
            socket.on('move', (data)=>{
                gameController.move(data)
            })
        }
    },[gameController])

    const handleSelect = (card_id) =>{
        if (selectedCard == card_id) {
            setSelectedCard(null)
        } else {
            setSelectedCard(card_id)
        }
    }

    return (
        <>
            <div className="game-grid">
                <PileArea piles={piles} selectedCard={selectedCard} deckCount={deck}></PileArea>
                {players.map((player,i)=>{
                    if (players.length==2 && i == 1) {
                        i++
                    }
                    return <PlayerArea key={player.id} player={player} gridNumber={i} isUser={user.id==player.id} isTurn={isTurn} handleSelect={handleSelect} selectedCard={selectedCard}></PlayerArea>
                })}


            </div>
            




            {/* {players.map((p)=>{
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
            <LeaveButton user={user} socket={socket}></LeaveButton> */}
        
        </>
    )
}

export default Game