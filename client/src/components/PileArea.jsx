import cardBack from './../lib/cards/0.png'
import lock from './../lib/misc/lock.png'

const PileArea = ({ piles, selectedCard, deckCount, handlePickup, handleChangePile, isTurn, pilesOnly }) =>{


    const Pickup = () => {
        handlePickup()
    }

    const handlePileClick = () => {
        if (pilesOnly) {
            handleChangePile()
        } else {
            // playcard
            return
        }
    }

    return (
        <>
        <div className="board-center">
            <div className="pile-area">
                {piles.map((pile,i)=>{
                    let disabled = pile.position!='unlocked' || !pile.playableIds.includes(selectedCard)
                    if (pilesOnly && isTurn) {
                        disabled = false
                    }

                    return (    
                        

                        <div className={`pile`} key={pile.card.id}>
                            <button onClick={handlePileClick} className='card-btn' disabled={disabled}>
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