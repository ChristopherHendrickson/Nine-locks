import { useState, useEffect } from "react"
import LeaveButton from "./LeaveButton"
import all_cards_images from '../lib/cards/imageExport'
import { useParams } from "react-router-dom"
import GameController from "../lib/GameController/GameController" 
import PlayerArea from "./PlayerArea"
import PileArea from "./PileArea"
import Winner from "./Winner"

import card_back from '../lib/cards/0.png'

const Game = ({ user, socket, currentRoom }) => {


    const [gameController,setGameController] = useState(null)
    const [initDeck,setInitDeck] = useState([])
    const [moves,setMoves] = useState([])
    const [isTurn,setIsTurn] = useState(user.id == currentRoom)

    const [players,setPlayers] = useState([])
    const [piles,setPiles] = useState([])
    const [deck,setDeck] = useState(0)
    const [usingKey, setUsingKey] = useState(false)
    const [selectedCard,setSelectedCard] = useState(null)
    const [pilesOnly,setPilesOnly] = useState(false)
    const [winner,setWinner] = useState(null)
    socket.on('init_game', (data) => {
        console.log('RECIEVED GAME INIT')
        const init_deck = data.init_deck
        const _players = data.players
        _players.forEach((p)=>p.connected=true)
        setGameController(new GameController({ 
            "init_deck":init_deck,
            "players":_players,
            "setPlayers":setPlayers,
            "setPiles":setPiles,
            "setDeck":setDeck,
            "setIsTurn":setIsTurn,
            "user":user,
            "setPilesOnly":setPilesOnly,
            "setUsingKey":setUsingKey,
            "setWinner":setWinner
        }))
    })

    useEffect(()=>{
        if (gameController) { //once we get the gameController set up, tell it to init the game
            console.log('init game')
            gameController.move({type:'init'})
            console.log('init move')

            socket.on('user_left', (user_left) => {
                gameController.playerLeft(user_left)                
            })
            socket.on('move', (data)=>{
                console.log('recieved move from socket')
                gameController.move(data)
            })
        }
    },[gameController])

    const handleSelect = (cardId) => {
        if (selectedCard == cardId) {
            setSelectedCard(null)
        } else {
            setSelectedCard(cardId)
        }
    }

    const handlePickup = () => {
        setSelectedCard(null)
        setIsTurn(false) //this gets unset in gameController depending if it is their turn
        socket.emit('move',{
            'type':'pickup',
            'room_id':currentRoom, //different casing because python backend expects room_id
            'player':user,
            'endTurn':false
        })
    }

    const handleChangePile = (i) => {
        setSelectedCard(null)
        setIsTurn(false)
        socket.emit('move',{
            'type':'changePile',
            'room_id':currentRoom,
            'pileIndex':i, 
            'player':user,
            'endTurn':true
        })
    }

    const handlePlayCard = (i) => {
        setIsTurn(false)
        setSelectedCard(null)
        console.log('emitting playcard case')
        socket.emit('move',{
            'type':'playCard',
            'room_id':currentRoom,
            'cardId':selectedCard,
            'pileIndex':i, 
            'player':user,
            'endTurn':true
        })
    }

    useEffect(()=>{
        console.log('i am state', piles)
    },[selectedCard])

    return (
        <>
            <div className="game-grid">
                <PileArea piles={piles} selectedCard={selectedCard} pilesOnly={pilesOnly} deckCount={deck} handlePickup={handlePickup} handleChangePile={handleChangePile} isTurn={isTurn} usingKey={usingKey} handlePlayCard={handlePlayCard}></PileArea>
                
                {players.map((player,i)=>{
                    if (players.length==2 && i == 1) {
                        i++
                    }
                    return <PlayerArea key={player.id} pilesOnly={pilesOnly} player={player} gridNumber={i} isUsersHand={user.id==player.id} isTurn={isTurn} handleSelect={handleSelect} selectedCard={selectedCard}></PlayerArea>
                })}

                {winner &&
                    <Winner player={{ winner }} user={user} socket={socket}></Winner>
                }

            </div>
            




            {/*<LeaveButton user={user} socket={socket}></LeaveButton> */}
        
        </>
    )
}

export default Game