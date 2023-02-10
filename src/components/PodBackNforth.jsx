import {useSelector,useDispatch, } from 'react-redux';
import {useState, useEffect,useRef} from 'react';
import axios from 'axios';
import {pod,authenticate} from '../store/userSlice.js';
import {baseURL} from '../store/conf.js'

const PodBackNforth =()=>{
    const podInfo = useSelector((state) => state.AuthUser.pod);
    const AuthUser = useSelector((state) => state.AuthUser.user);
    
    const [message, setMessage] = useState('')
    const [serverMessage, setServerMessage] = useState([]);
    let socketRef = useRef(null);

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        scrollToBottom()
    },[serverMessage])


    useEffect(()=>{
        let ws_schame = window.location.protocol == "https:" ? "wss" : "ws";
        const url = `${ws_schame}://${process.env.REACT_APP_BASE_URL}/ws/${podInfo.code}/${AuthUser.username}/`
        socketRef.current = new WebSocket(url);
        
        socketRef.current.onopen =(event)=>{
            console.log("web socket connected opened. ");
        };

        socketRef.current.onmessage =(event)=>{
            const data = JSON.parse(event.data);
            
            // setServerMessage([serverMessage,...data]);
            if (Array.isArray(data)) {
                // when the first time it connects, it retrives a list of old messages
                setServerMessage(data);
            } else {
                // when a new message is being sent and receives an instance of it
                setServerMessage((serverMessage) => [...serverMessage, data]);
            }
        };
        socketRef.current.onerror = (error)=>{
            console.log("web socket error: ", error)
        };

        socketRef.current.onclose =(event) => {
            console.log("web socket colosed, ", event);
        };

        return ()=>{
            socketRef.current.close();
        };
        
    },[]);

    const handleSend =()=>{
        console.log(socketRef.current)
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
            setMessage("");
          }
    }
    const msg = (message, index) => {
        const longDate = new Date(message.date);
        const yr = longDate.getFullYear()
        const mon = longDate.getMonth()
        const day = longDate.getDate()
        
        if(AuthUser.username === message.sender.username){
            return (
                <div key={index} className="d-flex align-item-baseline text-end justify-content-end mb-3 mx-4">
                    <div className=' px-2 bg-tertiary rounded '>
                        {message.message}
                    </div> 
                    <div className='fw-bold'>
                        <p>:{message.sender.username}</p>
                    </div>
                </div>
            )
        }else{
            return (
                <div key={index} className="d-flex align-item-baseline mb-3 mx-3 ">
                    <div className='fw-bold'>
                        <p>{message.sender.username}: </p>
                        <div ref={messagesEndRef} />
                    </div>
                    <div className=' px-2 rounded '>
                       {message.message}
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="container my-5">
            <div className="card mx-auto w-50"  >
                <div className="card-header border-0 shadow-sm text-center" >
                    <h1>{podInfo.code}-{podInfo.district.code}</h1>
                </div>
                <div className="card-body mh-100 p-0" style={{height:"500px", overflowY:'auto'}}>
                {serverMessage.map((message, index) => msg(message, index))} 
                </div>
                <div className="card-header shadow-sm p-3 z-1 border-0">  
                    <div className="input-group">
                        <input type="text" className="form-control" 
                            placeholder="Message..." 
                            value={message}
                            onChange={(e)=>setMessage(e.target.value)}
                            aria-label="Username" aria-describedby="basic-addon1"/>
                        <span className="input-group-text" 
                            onClick={handleSend} 
                            style={{"cursor":"pointer"}}
                            id="basic-addon1">Send</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PodBackNforth;