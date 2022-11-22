import { useEffect } from "react"
import { useState, useRef } from "react"
import { Fragment } from "react"

const Chat = ({ socket, user, currentRoom }) => {
    
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView(false)
    }

    const [messages,setMessages] = useState([])
    const [text,setText] = useState('')

    useEffect(()=>{
        scrollToBottom()
    },[messages])

    socket.on('msg', (new_message) => {
        const new_messages = [...messages]
        setMessages([...new_messages,new_message])
    })

    const sendMessage = (e) => {
        e.preventDefault()
        if (text.length>0) {
            socket.emit('msg',{text:text,sender:user,room_id:currentRoom})
            setText('')
        }
    }

    const handleChange = (e) => {
        e.preventDefault()
        setText(e.target.value)

    }

    const rc = (uuid,n) => {
        if (uuid) {
            const nums = uuid.split('').filter((n)=>{
                if (parseInt(n)) {
                    return n
                }
            })
            return Math.floor(255*(10*parseInt(nums[n])+parseInt(nums[n+1]))/100)
        }
    }


    return (
        <div className="chat-container">
            <ul id="messages">
                {messages.map((m,i)=>{
                    return (      
                        <Fragment key={i}>       
                        <li><span style={{color:`rgb(${rc(m.sender.id,0)},${rc(m.sender.id,2)},${rc(m.sender.id,4)})`}} className='sender'>{`${m.sender.username}`}</span>: {`${m.text}`}</li>
                        {i==messages.length-1 ? <div id="scroll-point" ref={messagesEndRef}></div>:<></>}    
  
                        </Fragment>
                    )
                })}
            </ul>
            
            <form id="message-form" onSubmit={sendMessage}>
                <input id="message-input" type='text' maxLength={600} autoComplete="off" value={text} onChange={handleChange}></input>
                <input id="message-btn" type='submit' value='Send'></input>
            </form>
            
        </div>


    )
}

export default Chat