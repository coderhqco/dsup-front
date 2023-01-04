import {useSelector,useDispatch, } from 'react-redux';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {pod,authenticate} from '../store/userSlice.js';
import {baseURL} from '../store/conf.js'

function PodBackNforth(){
    const podInfo = useSelector((state) => state.AuthUser.pod);
    const AuthUser = useSelector((state) => state.AuthUser.user);
    const [message, setMessage] = useState('')
    const [allM, setAllM] = useState('')
    
    let ws_schame = window.location.protocol == "https:" ? "wss" : "ws";
    const url = `${ws_schame}://${process.env.REACT_APP_BASE_URL}/ws/pod-back-n-forth/${podInfo.code}/${AuthUser.username}/`
    const chatSocket = new WebSocket(url);

    useEffect(()=>{
        // get back the messages...
        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            if(data.type === 'init'){
                // console.log(data.data)
            }else{
                setAllM(data.data)
            }
        };

    },[])
    const handleSend =()=>{
        chatSocket.send(JSON.stringify({
            type: "msg",
            message: message,
        }));
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
                            <p>{allM.message}</p>
                        </div>
                        <div className="modal-footer m-1 justify-content-center">
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" 
                                    placeholder="Username" 
                                    onChange={(e)=>setMessage(e.target.value)}
                                    aria-label="Username" aria-describedby="basic-addon1"/>
                                <span className="input-group-text" 
                                    onClick={()=>handleSend()} 
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