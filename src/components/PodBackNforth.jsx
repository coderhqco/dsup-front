import {useSelector,useDispatch, } from 'react-redux';
import {useState, useEffect,useRef} from 'react';
import axios from 'axios';
import {pod,authenticate} from '../store/userSlice.js';
import {baseURL} from '../store/conf.js'

const PodBackNforth =()=>{
    const podInfo = useSelector((state) => state.AuthUser.pod);
    const AuthUser = useSelector((state) => state.AuthUser.user);
    
    const [message, setMessage] = useState('')
    const [serverMessage, setServerMessage] = useState();
    let socketRef = useRef(null);
    useEffect(()=>{
        let ws_schame = window.location.protocol == "https:" ? "wss" : "ws";
        const url = `${ws_schame}://${process.env.REACT_APP_BASE_URL}/ws/${podInfo.code}/${AuthUser.username}/`
        console.log("url: ", url)
        socketRef.current = new WebSocket(url);
        
        socketRef.current.onopen =(event)=>{
            console.log("web socket connected", event);
        };

        socketRef.current.onmessage =(event)=>{
            const data = JSON.parse(event.data);
            setServerMessage(data.message);

            // here get all the messages. 
            // new messages shall be complete like: date, id, pod, sender, message
            
            console.log(data)
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
    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12 col-md-3"></div>
                <div className="col-sm-12 col-md-6 mt-3">
                    <div className="modal-dialog shadow-sm rounded-2 bg-light p-2">
                        <div className="modal-content">
                        <div className="modal-header ">
                            <h5 className="modal-title">{podInfo?.district?.code} - {podInfo?.code}</h5>
                        </div>
                        <div className=" modal-dialog-scrollable bg-white p-3 border">
                            {}
                        </div>
                        <div className="modal-footer m-1 justify-content-center">
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" 
                                    placeholder="Username" 
                                    value={message}
                                    onChange={(e)=>setMessage(e.target.value)}
                                    aria-label="Username" aria-describedby="basic-addon1"/>
                                <span className="input-group-text" 
                                    onClick={handleSend} 
                                    style={{"cursor":"pointer"}}
                                    id="basic-addon1">Enter</span>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-md-3"></div>
            </div>
        </div>
    )
}

export default PodBackNforth;