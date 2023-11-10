import React from 'react';
import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

function BillPage() {
    return (
        <div>
            <Container style={{ display: 'flex', justifyContent: 'center', marginTop: "2%" }}>
                <Card style={{ width: '70%' }}>
                    <Card.Body>
                        <Card.Title style={{fontFamily: "inter-bold"}}>H.R. 1234</Card.Title>
                        <Card.Subtitle style={{fontFamily: "Inter-SemiBold"}}>BILL TITLE</Card.Subtitle>
                        <br/>
                        <Card.Text style={{fontFamily: "Inter-SemiBold"}}>
                            Latest Action
                                <ul style={{fontFamily: "inter-regular"}}>
                                    <li>DATE</li>
                                    <li>ACTION</li>
                                </ul>
                        </Card.Text>
                        <Card.Text style={{fontFamily: "Inter-SemiBold"}}>
                            TEXT
                                <ul style={{fontFamily: "inter-regular"}}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </ul>

                        </Card.Text>
                        <Card.Link href="#">Back</Card.Link>
                        <Card.Link href="#">Full Bill List</Card.Link>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}


export default BillPage;