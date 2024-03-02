import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../contexts/Auth/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {SubmitButton} from "../Utils/DefaultComponents.tsx";
import {getHistoryChat} from "../../api/hooks/Chat.tsx";



export default function Chat({toUser}: {toUser: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [messages, setMessages] = useState<string[]>([]);
    const [message, setMessage] = useState<string>("");
    const useUser = useContext(AuthContext)
    const navigate = useNavigate();

    if (!useUser?.user) {
        navigate('/login')
    }

    const {data, isLoading} = getHistoryChat({
        receiver: useUser.user?.id!,
        sender: toUser
    })

    useEffect(() => {
        if (data) {
            const texts = data.history.map((message: any) => message.text);
            setMessages((prevMessages) => [...texts, ...prevMessages]);
        }
    }, [data]);


    useEffect(() => {
        const userId = useUser.user?.id;
        const socket = new WebSocket(
            `ws://127.0.0.1:8000/v1/chat/ws/${userId}`,
        );
        socket.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };
        socket.onclose = event => {
            console.log("WebSocket closed", event);
        };
        socket.onopen = (event) => {
            console.log(event)
            const initData = {
                receiver: toUser,
                sender: useUser.user?.id,
                text: 'start'
            }
            socket.send(JSON.stringify(initData));
        };
        socket.onerror = error => {
            console.error("WebSocket error", error);
        };
        setSocket(socket);
        return () => {
            socket.close();
        };

    }, [useUser.user, toUser]);

    if (isLoading){
        return <div>Loading...</div>
    }

    const sendMessage = () => {
        const messageData = {
            sender: useUser.user?.id,
            receiver: toUser,
            text: message
        }
        setMessages((messages) => [...messages, message]);
        if(socket) {
            socket.send(JSON.stringify(messageData));
            setMessage("");
        }
    }

    return <div>
        <div className="max-h-48 min-h-48 overflow-y-auto">
            <ul>
                {messages.map((message, index) => <li key={index}>
                    {message}
                </li>)}
            </ul>
        </div>
        <div className="">
            <input type="text" className="p-3 border-2 border-gray-300 rounded w-3/4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                   value={message} onChange={(e) => setMessage(e.target.value)}/>
            <SubmitButton className="ml-4 px-8"
                onClick={sendMessage}>Send</SubmitButton>
        </div>
    </div>
}