import { useState } from "react"
import LeaveButton from "./LeaveButton"
const Winner = ({ winner, user, socket }) => {


    const [size,setSize] = useState(1)

    const reduce = () => {
        setSize(Math.abs(size-1))
    }

    const winnersString = winner[0].username
    
    if (winner.length > 1) {
        for (let i=1;i<winner.length;i++){
            winnersString+=` and ${winner[i].username}`
        }
    }

    return (
        <>
        <div className="shader">
        </div>
        <div className={`win-panel ${size==0 ? 'reduce' : ''}`}>
            <button onClick={reduce} className={`minimise${size==0 ? 'reduce' : ''}`}></button>
            {size == 1 ?  
            <>
                <div>
                <p>{winnersString} Won!</p>

                </div>
                <div className="lifter">                
                <span>
                    <button className="btn-space">Play Again</button>
                    <LeaveButton user={user} socket={socket}></LeaveButton>
                </span>
                </div>
                </>
            : <></>}
        </div>
        </> 
    )
}


export default Winner