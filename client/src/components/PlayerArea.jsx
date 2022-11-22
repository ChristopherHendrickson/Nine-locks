import card_back from './../lib/cards/0.png'

const PlayerArea = ({ player, gridNumber, isUser, isTurn, handleSelect, selectedCard }) =>{


    const handleClick = (card_id) => {
        console.log(card_id)
        handleSelect(card_id)
    }

    return (
        <>
        <div className={`player-area-${gridNumber}`}>
            <div className="hand-shown">
                {player.handShown.map((card)=>{
                    const selected = selectedCard == card.id ? 'selected' : ''
                    return (
                        <div className='hand-wrap'  key={card.id}>
                            <button onClick={()=>{handleClick(card.id)}} className={`card-btn ${selected}`} disabled={!isTurn || !isUser}>
                                <img className={`card-img ${selected}`} src={card.image}></img>
                            </button>
                        </div>
                    )
                })}    
            </div>
            <div className='hand-hidden'>
            {player.handHidden.map((card)=>{
                const selected = selectedCard == card.id ? 'selected' : ''
                    return (
                        <div className="hand-wrap" key={card.id} >
                            <button onClick={()=>{handleClick(card.id)}} className={`card-btn ${selected}`} disabled={!isTurn || !isUser}>
                                <img className={`card-img ${selected}`} src={isUser ? card.image : card_back}></img>
                            </button>
                        </div>
                    )
                })}    
            </div>


        </div>
        <div className={`player-info-${gridNumber}`}>
            <p className="player-name">{player.username}</p>
        </div>
        </>
    )

}


export default PlayerArea