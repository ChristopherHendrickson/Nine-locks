import { useState } from "react"

const Chat = ({ socket, user, currentRoom }) => {
    


    const [messages,setMessages] = useState([])
    const [text,setText] = useState('')

    socket.on('msg', (new_message) => {
        const new_messages = [...messages]

        setMessages([...new_messages,new_message])
        console.log(new_message)
        console.log(messages)
    })

    const sendMessage = (e) => {
        e.preventDefault()
        if (text.length>0) {
            socket.emit('msg',{text:text,sender:user,room_id:currentRoom})
        }
    }

    const handleChange = (e) => {
        e.preventDefault()
        setText(e.target.value)


    }
    return (
        <>
        <ul>
            {messages.map((m,i)=>{
                return <li key={`${m.sender.id}${i}`}>{m.text} - {m.sender.username}</li>
            })}
        </ul>
        <form onSubmit={sendMessage}>
            <input type='text' value={text} onChange={handleChange}></input>
            <input type='submit' value='Send'></input>
        </form>
        
        </>


    )
}

export default Chat