const GameInfo = ({ isTurn, noMoves, gameInfo, pilesOnly, usingKey, piles }) => {


    const onlyFlipping = piles.filter((pile)=>{
        return pile.position=='facedown'
    }).length > 0

    let turnInstruction
    if (usingKey) {
        turnInstruction = 'Unlock a Pile with your key' 
    } else if (pilesOnly && onlyFlipping) {
        turnInstruction = 'Reveal a Pile' 
    } else if (pilesOnly) {
        turnInstruction = 'Unlock a Pile' 
    } else {
        turnInstruction = 'Play a card or pickup' 
    }


    return (
        <>
        <div className="game-info">
         {isTurn && 
            <div className='info glow'>
                <p>It is your turn.</p>
                <p><em>{turnInstruction}</em></p>
            </div>
         }
        {noMoves && 
            <div className='info'><p>No more moves. Was it enough to win?</p></div>
         }
        {gameInfo.map((info,i)=>{
            return <div key={i} className='info leaver'><p>{info}</p></div>       
        })
     
        }
        </div>
        </> 
    )
}


export default GameInfo