import cardBack from './../lib/cards/0.png'
import lock from './../lib/misc/lock.png'

const PileArea = ({ piles, selectedCard, deckCount, handlePickup, handleChangePile, handlePlayCard, isTurn, pilesOnly, usingKey }) =>{


    const Pickup = () => {
        handlePickup()
    }

    const handlePileClick = (i) => {
        if (pilesOnly) {
            handleChangePile(i)
        } else {
            // player is attempting to play the card.
            // piles are only playable if selectedCard is not null, so dont need to check for selectedCard
            handlePlayCard(i)
        }
    }

    


    return (
        <>
        <div className="board-center">
            <div className="pile-area">
                {piles.map((pile,i)=>{
                    
                    let disabled = !isTurn || pile.position!='unlocked' || !pile.playableIds.includes(selectedCard)
                    
                    const onlyFlipping = piles.filter((pile)=>{
                        return pile.position=='facedown'
                    }).length > 0
                    
                    if (pilesOnly && isTurn) {
                        if (usingKey) {
                            disabled = false
                        } else if (onlyFlipping) {
                            disabled = pile.position!=='facedown'
                        } else {
                            disabled = pile.position=='unlocked'
                        }
                    }

                    return (    
                        

                        <div className={`pile`} key={pile.card.id}>
                            <button onClick={()=>handlePileClick(i)} className='card-btn' disabled={disabled}>
                                <img className="card-img" src={pile.position!='facedown' ? pile.card.image : cardBack}></img>
                                {pile.position=='locked' ? <img className='lock' src={lock}></img> : <></>}
                            </button>
                        </div>

                    )
                })}
            </div>

            <div className="deck-area">
                {deckCount > 0 &&
                <button onClick={Pickup} disabled={!isTurn || pilesOnly} className='deck card-btn'><img className="card-img" src={cardBack}></img></button>
                }
            </div>
        </div>

        </>
    )

}


export default PileArea