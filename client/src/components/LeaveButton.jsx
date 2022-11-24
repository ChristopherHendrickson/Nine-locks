


const LeaveButton = ({ socket, user, style } ) =>{

    const handleLeave = () => {
        socket.emit("leave", {current_user:user})
    }

    return (
            <button className={`${style} btn-leave`} onClick={handleLeave}>Leave Game</button>
    )
}

export default LeaveButton