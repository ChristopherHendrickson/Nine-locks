


const LeaveButton = ({ socket, user } ) =>{

    const handleLeave = () => {
        socket.emit("leave", {current_user:user})
    }

    return (
            <button className="leave-btn btn-space" onClick={handleLeave}>Leave Game</button>
    )
}

export default LeaveButton