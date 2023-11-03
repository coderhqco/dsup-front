import { useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { ModalHeader } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import {baseURL} from '../store/conf.js'


const PodBackNforth = () => {
    const podInfo = useSelector((state) => state.AuthUser.pod);
    const AuthUser = useSelector((state) => state.AuthUser.user);
    const [pages, setPages] = useState(2)
    const [message, setMessage] = useState('')
    const [serverMessage, setServerMessage] = useState([]);
    const [loadMoreVisible, setLoadMoreVisible] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [handle, setHandle] = useState('');
    const [errorModal, setErrorModal] = useState('')
    let socketRef = useRef(null);

    const scrollableElementRef = useRef(null);

    useEffect (()=>{
        /** This use effect function is responsible for smooth scrolling to 
         * the end of entries list
         * does so by new entries being added
         */
        if (scrollableElementRef.current) {
            const scrollableElement = scrollableElementRef.current;
            // Scroll to the bottom if the element is not in view
            scrollableElement.scrollIntoView({ behavior: "smooth" });
          }
    },[serverMessage])

    useEffect(() => {
        /** This useEffect opens the web socket protocal and fetches B&F data */
        let ws_schame = window.location.protocol == "https:" ? "wss" : "ws";
        const url = `${ws_schame}://${process.env.REACT_APP_BASE_URL}/ws/${podInfo.code}/${AuthUser.username}/`
        socketRef.current = new WebSocket(url);

        socketRef.current.onopen = (event) => {
            console.log("connected.");
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (Array.isArray(data)) {
                // when the first time it connects, it retrives a list of old messages
                // check weather to show  "load more" on pagination from api.
                data.length < 10 ? setLoadMoreVisible(false) : setLoadMoreVisible(true)
                setServerMessage((prevserverMessage) => [...data.reverse(), ...prevserverMessage])
            } else {
                // when a new message is being sent and receives an instance of it
                setServerMessage((serverMessage) => [...serverMessage, data]);
            }
        };
        socketRef.current.onerror = (error) => {
            console.log("web socket: ", error)
        };

        socketRef.current.onclose = (event) => {
            console.log("close web socket, ", event);
        };

        return () => {
            socketRef.current.close();
        };

    }, []);

    const handleLoad = () => {
        /** B&F Entries are paginated based on 10 entries in each page.
         * This loads the next page.
         */
        setPages(pages + 1)
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(`page_number,${pages}`)
        }

    }
    const handleSend = () => {
        /* This function sends a new message entry (Back And Forth Entry). 
        It checks if the web socket is open   */
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
            setMessage("");
        }
    }

    const date_format = (date, _24h=false) => {
        /* this function is used on msg function for the date format of message. 
        _24h is only for the last part of the date format which is in hours: minutes: seconds. */
        if (_24h === true){
            return new Date(date).toLocaleString('en-US', {hour: "2-digit", minute: "2-digit", second: "2-digit"})
        }else{
            return new Date(date).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric',});
        } 
    }

    const msg = (message, index) => {
        /*
        an entery instance with handle, date format and the message entry
        */
        return (
            <div key={index} className="container mb-3">
                <div className='row'>
                    {/* checking if this message has handle */}
                    <p className='mb-0'>
                        {message.handle?.handle? 
                        <span className='fw-bold h4'>{message.handle.handle}</span> : 
                        <span className='fw-bold h4'>{message.sender?.users?.legalName}</span>
                        }
                        <span className='text-muted small'> &nbsp;&nbsp;{date_format(message.date)}&nbsp; [ {date_format(message.date, true)} ] </span>
                    </p>
                </div>
                <div className='row'>
                    <article>
                        {message.message}
                    </article>
                </div>
            </div>
        )
    }


    const handleModalClose = () => setShowModal(false);

    const UpdateHandle =()=>{
        /* creating or updating of an existing handle. 
         it updates the existing handle via post request and create one if does not exist already
         Params: 
            pod code
            voter/user username (entry code)
            a handle name
        */ 
        const handleURL = `${window.location.protocol}//${baseURL}/api/create-handle/`;
        const handle_data = {
            pod: podInfo.code, voter: AuthUser.username, handle:handle
        }
        axios.post(handleURL, handle_data)
        .then(response =>{ 
            handleModalClose();
            // update all the message handle
            const handleUpdated = serverMessage.map((object) => ({
                ...object, // Keep the other fields the same
                handle: {
                  ...object.handle, // Keep the other properties of 'handle' the same
                  handle: handle, // Update the 'handle' property within 'handle' 
                },
              }));
              setServerMessage(handleUpdated)
        })
        .catch(err =>{ setErrorModal('something went wrong. Try agian!') })
    }
    // User.handle? 
    return  (
        // the message history area. 
        <div className="container my-5">
            <div className="card mx-auto "  >
                <div className="card-header border-0 shadow-sm text-center" >
                    <h1>{podInfo.code}-{podInfo.district.code} </h1>
                </div>
                <div className="card-body mh-100 p-0" style={{ height: "500px", overflowY: 'auto' }}>
                    <div className='text-center p-2' >
                     
                        {loadMoreVisible && (<a href="#" className='btn btn-sm btn-outline-primary rounded-pill px-3' onClick={handleLoad}>load more</a>)}
                    </div>
                    {serverMessage.map((message, index) => msg(message, index))}
                    
                    <div ref={scrollableElementRef} />
                </div>

                {/* enter your message area */}
                <div className="card-header shadow-sm p-3 z-1 border-0">
                    <div className="input-group">
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"
                            placeholder="Submit An Entry "
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}> </textarea>
                        <span className="input-group-text"
                            onClick={handleSend}
                            style={{ "cursor": "pointer" }}
                            id="basic-addon1">Send</span>
                    </div>
                    <br />
                    <a href='#' onClick={()=>setShowModal(true)}>Create/update your handle</a>
                </div>
            </div>

        {/*  handle update modal */}
            <Modal
            show={showModal}
            onHide={()=>handleModalClose()}
            backdrop="static"
            keyboard={false}>
                <ModalHeader>
                    <p className='h5'>What's Your Handle?</p>
                    <button type="button" className="close btn btn-outline-danger" onClick={()=>setShowModal(false)}>
                        <span>&times;</span>
                    </button>
                </ModalHeader>
                <Modal.Body> 
                    {errorModal ? 
                        <div class="alert alert-danger" role="alert">
                            {errorModal}
                        </div>
                    :''}
                   
                    <label htmlFor="handle" className='fw-bold'>Handle:</label>
                    <input type="text"
                        onChange={(e) => setHandle(e.target.value)}
                        className='form-control'
                        name='handle'
                        placeholder="Enter new handle here" />
                    <div className="row p-4">
                    <button className='btn btn-primary'
                    onClick={()=>UpdateHandle()}>
                        Make This My Handle
                    </button>

                    <p className='mt-3'> A Handle is like a nickname or a screenname, but with a difference.  
                        It isn't just for fun or to keep things friendly.  
                        The orders you submit to your delegate, and the reports they send back, 
                        can contain important information about your political point of view. 
                        As we all know, we don't always want everyone, either in our personal lives 
                        or in the larger world, to know exactly what we think on every political issue.  
                        While members of a Circle should never copy or share the contents of a B&F... things happen. 
                        Your Handle provides another layer of security in that situation. 
                    </p>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default PodBackNforth;