


const LeaveButton = ({ socket, user} ) =>{

    const handleLeave = () => {
        socket.emit("leave", {current_user:user})
    }

    return (
        <div className="leave-btn">
            <button onClick={handleLeave}>Leave Game</button>
        </div>
    )
}

export default LeaveButton