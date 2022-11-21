import { useState, useEffect } from "react"
import LeaveButton from "./LeaveButton"

const Game = ({ user, socket, currentRoom }) => {

    return (
        <>
        <p>GAME</p>
        <LeaveButton user={user} currentRoom={currentRoom} socket={socket}></LeaveButton>
        </>
    )
}

export default Game