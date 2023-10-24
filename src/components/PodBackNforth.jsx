import { useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { SortNumericDown } from 'react-bootstrap-icons';
import Card from 'react-bootstrap/Card';
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const PodBackNforth = () => {
    const podInfo = useSelector((state) => state.AuthUser.pod);
    const AuthUser = useSelector((state) => state.AuthUser.user);
    const [pages, setPages] = useState(2)
    const [message, setMessage] = useState('')
    const [serverMessage, setServerMessage] = useState([]);
    const [loadMoreVisible, setLoadMoreVisible] = useState(true);
    let socketRef = useRef(null);

    const messagesEndRef = useRef(null)
    const messagesStartRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    const scrollToTop = () => {
        messagesStartRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const submitNickname = () => {
        console.log("submitting nickname")
    }



    useEffect(() => {
        let ws_schame = window.location.protocol == "https:" ? "wss" : "ws";
        const url = `${ws_schame}://${process.env.REACT_APP_BASE_URL}/ws/${podInfo.code}/${AuthUser.username}/`
        socketRef.current = new WebSocket(url);

        socketRef.current.onopen = (event) => {
            console.log("web socket connected opened. ");
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (Array.isArray(data)) {
                // when the first time it connects, it retrives a list of old messages

                // check weather to show loade more or not.  items per page on pagination from api.
                data.length < 10 ? setLoadMoreVisible(false) : setLoadMoreVisible(true)
                setServerMessage((prevserverMessage) => [...data.reverse(), ...prevserverMessage])
                // setServerMessage([...serverMessage, ...data]);

            } else {
                // when a new message is being sent and receives an instance of it
                setServerMessage((serverMessage) => [...serverMessage, data]);
            }
        };
        socketRef.current.onerror = (error) => {
            console.log("web socket error: ", error)
        };

        socketRef.current.onclose = (event) => {
            console.log("web socket colosed, ", event);
        };

        return () => {
            socketRef.current.close();
        };

    }, []);

    const handleLoad = () => {
        setPages(pages + 1)
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(`page_number,${pages}`)
        }
        scrollToTop();

    }
    const handleSend = () => {
        console.log(socketRef.current)
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
            setMessage("");
        }
        scrollToBottom()
    }

    const date_short = (date) => {
        const datetime = new Date(date);
        const options = {
            year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
        };
        return datetime.toLocaleString('en-US', options);
    }
    const msg = (message, index) => {
        if (AuthUser.username === message.sender.username) {
            return (
                <div key={index} className="d-flex align-item-baseline align-item-baseline mb-3 mx-4 ">
                    <div >
                        <p className='back-and-forth-nickname-font'>{message.sender.username}
                        </p>
                        <p> {message.message}</p>
                    </div>
                    <div style={{ marginLeft: ".5%" }}>
                        <div>
                            {(() => {
                                switch (AuthUser.users.userType) {
                                    case 0:
                                        return "Content for User Type 0";
                                    case 1:
                                        return (
                                            <div>
                                                <p className='f-del-tag'>[F-Del]</p>
                                            </div>
                                        );
                                    case 2:
                                        return "Content for User Type 2";
                                    case 3:
                                        return "Content for User Type 3";
                                    case 4:
                                        return "Content for User Type 4";
                                    case 5:
                                        return "Content for User Type 5";
                                    default:
                                        return "Fallback Content";
                                }
                            })()}
                        </div>
                    </div>

                    <div style={{ marginLeft: "3%" }}>
                        [{date_short(message.date)}]
                    </div>
                </div>
            )
        } else {
            return (
                <div key={index} className="d-flex align-item-baseline mb-3 mx-3 ">
                    <div className='fw-bold'>
                        <p>{message.sender.username}: </p>
                    </div>
                    <div className=' px-2 rounded '>
                        {message.message}
                    </div>
                </div>
            )
        }
    }

    // below, AuthUser is being used to determine what to render, though once each user has a "nickname" attribute in the database
    // we can change it to User.nickname, which will be the name that is displayed in the chat. if no nickname, then
    // the prompt to create a username will be displayed.
    {
        // User.handle? 
        return AuthUser ? (
            <div className="container my-5">
                <div className="card mx-auto "  >
                    <div className="card-header border-0 shadow-sm text-center" >
                        <h1>{podInfo.code}-{podInfo.district.code} </h1>
                    </div>
                    <div className="card-body mh-100 p-0" style={{ height: "500px", overflowY: 'auto' }}>
                        <div className='text-center p-2'>
                            <div ref={messagesStartRef}></div>
                            {loadMoreVisible && (<a href="#" onClick={handleLoad}>load more</a>)}
                        </div>
                        {serverMessage.map((message, index) => msg(message, index))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="card-header shadow-sm p-3 z-1 border-0">
                        <div className="input-group">
                            <input type="text" className="form-control"
                                placeholder="Message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                aria-label="Username" aria-describedby="basic-addon1" />
                            <span className="input-group-text"
                                onClick={handleSend}
                                style={{ "cursor": "pointer" }}
                                id="basic-addon1">Send</span>
                        </div>
                    </div>
                </div>

            </div>
        )
            :
            (<div style={{ marginTop: "5%" }}>
                <Container className='d-flex align-items-center justify-content-center'>
                    <Card style={{ width: '50%' }}>
                        <Card.Body>
                            <Card.Title>Choose a Handle</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">As you are entering the Back & Forth page for the first time, we as you to provide a handle. It is your display name for the Back & Forth, and unless you enter it here, we will not display your real name.</Card.Subtitle>
                            <br />
                            <Form.Control type="text" placeholder="Handle" />
                            <div className="text-center d-grid gap-2" style={{ marginTop: "1%" }}>
                                <Button variant="primary" type="submit" onClick={submitNickname}>
                                    Submit
                                </Button>
                            </div>
                            <div>
                                <Card.Link href="#">Help</Card.Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </div>)
    }
}

export default PodBackNforth;