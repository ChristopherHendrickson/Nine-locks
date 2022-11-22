import card_back from './../lib/cards/0.png'

const PileArea = ({ piles, selectedCard }) =>{


    // const handleClick = (card_id) => {
    //     handleSelect(card_id)
    // }

    return (
        <>
        <div className="board-center">
            <div className="pile-area">
                {piles.map((pile,i)=>{
                    
                    return (
                        // <div className={`pile-${i}`} key={pile.card.id}>
                        //     <button className='card-btn'>
                        //         <img className="card-img" src={pile.position!='facedown' ? pile.card.image : card_back}></img>
                        //     </button>
                        // </div>
                        <></>
                    )
                })}
            </div>

            <div className="deck-area">
            
            </div>
        </div>

        </>
    )

}


export default PileArea