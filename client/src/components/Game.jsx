import { useState, useEffect } from "react"
import LeaveButton from "./LeaveButton"
import GameController from "../lib/GameController/GameController" 
import PlayerArea from "./PlayerArea"
import PileArea from "./PileArea"
import Winner from "./Winner"



const Game = ({ user, socket, currentRoom }) => {


    const [gameController,setGameController] = useState(null)
    const [isTurn,setIsTurn] = useState(user.id == currentRoom)

    const [players,setPlayers] = useState([])
    const [piles,setPiles] = useState([])
    const [deck,setDeck] = useState(0)
    const [usingKey, setUsingKey] = useState(false)
    const [selectedCard,setSelectedCard] = useState(null)
    const [pilesOnly,setPilesOnly] = useState(false)
    const [winner,setWinner] = useState(null)
    const [noMoves,setNoMoves] = useState(false)

    socket.on('init_game', (data) => {
        setIsTurn(user.id == currentRoom)
        setPlayers([])
        setPiles([])
        setDeck([])
        setUsingKey(false)
        setSelectedCard(null)
        setPilesOnly(false)
        setWinner(null)
        setNoMoves(false)
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
            "setWinner":setWinner,
            "setNoMoves":setNoMoves
        }))
    })

    useEffect(()=>{
        if (noMoves) {
            socket.emit('move',{
                'type':'noMove',
                'room_id':currentRoom, 
                'player':user,
                'endTurn':true
            })
        }
    },[noMoves])

    useEffect(()=>{
        if (gameController) { //once we get the gameController set up, tell it to init the game

            gameController.move({type:'init'})

            socket.on('user_left', (user_left) => {
                gameController.playerLeft(user_left)                
            })
            socket.on('move', (data)=>{
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
        socket.emit('move',{
            'type':'playCard',
            'room_id':currentRoom,
            'cardId':selectedCard,
            'pileIndex':i, 
            'player':user,
            'endTurn':true
        })
    }



    return (
        <>
            <div className="game-grid">
                <PileArea piles={piles} selectedCard={selectedCard} pilesOnly={pilesOnly} deckCount={deck} handlePickup={handlePickup} handleChangePile={handleChangePile} isTurn={isTurn} usingKey={usingKey} handlePlayCard={handlePlayCard}></PileArea>
                
                {players.map((player,i)=>{
                    if (players.length==2 && i == 1) {
                        i++
                    }
                    return <PlayerArea key={player.id} pilesOnly={pilesOnly} player={player} gridNumber={i} isUsersHand={user.id==player.id} handleSelect={handleSelect} selectedCard={selectedCard}></PlayerArea>
                })}

                {winner &&
                    <Winner winner={ winner } user={user} socket={socket}></Winner>
                }
                <span>
                <p>no moves {noMoves.toString()}</p>
                <p>is turn {isTurn.toString()}</p>
                <p>{winner}</p>
                </span>
            </div>
            




            {/*<LeaveButton user={user} socket={socket}></LeaveButton> */}
        
        </>
    )
}

export default Game