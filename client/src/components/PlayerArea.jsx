import cardBack from './../lib/cards/0.png'

const PlayerArea = ({ player, gridNumber, isUsersHand, isTurn, handleSelect, selectedCard, pilesOnly }) =>{


    const handleClick = (cardId) => {
        console.log(cardId)
        handleSelect(cardId)
    }
    let disabled = !isUsersHand 
    return (
        <>
        <div className={`player-area-${gridNumber}`}>
            <div className="hand-shown">
                {player.handShown.map((card)=>{
                    const selected = selectedCard == card.id ? 'selected' : ''
                    return (
                        <div className='hand-wrap'  key={card.id}>
                            <button onClick={()=>{handleClick(card.id)}} className={`card-btn ${selected}`} disabled={disabled}>
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
                            <button onClick={()=>{handleClick(card.id)}} className={`card-btn ${selected}`} disabled={disabled}>
                                <img className={`card-img ${selected}`} src={isUsersHand ? card.image : cardBack}></img>
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