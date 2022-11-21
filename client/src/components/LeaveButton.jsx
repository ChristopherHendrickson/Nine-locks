


const LeaveButton = ({ socket, user, currentRoom} ) =>{

    const handleLeave = () => {
        socket.emit("leave", {current_user:user,room_id:currentRoom})
    }

    return (
        <div className="leave-btn">
            <button onClick={handleLeave}>Leave Game</button>
        </div>
    )
}

export default LeaveButton