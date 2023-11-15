import React from 'react';
import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


function BillPage() {
    return (
        <div>
            <Container style={{ display: 'flex', justifyContent: 'center', marginTop: "2%" }}>
                <Card style={{ width: '90%' }}>
                    <Card.Body>
                        <h1 style={{ fontFamily: "inter-bold" }}>H.R. 1234</h1>
                        <Card.Subtitle style={{ fontFamily: "Inter-SemiBold" }}>BILL TITLE</Card.Subtitle>
                        <br />
                        <Card.Text style={{ fontFamily: "Inter-SemiBold" }}>
                            Latest Action
                            <ul style={{ fontFamily: "inter-regular" }}>
                                <li>DATE</li>
                                <li>ACTION</li>
                            </ul>
                        </Card.Text>
                        <Card.Text style={{ fontFamily: "Inter-SemiBold" }}>
                            TEXT
                            <ul style={{ fontFamily: "inter-regular" }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </ul>

                        </Card.Text>
                        <Card.Link href="#">Back</Card.Link>
                        <Card.Link href="#">Full Bill List</Card.Link>
                    </Card.Body>
                </Card>
            </Container>
            <Container style={{ display: 'flex', justifyContent: 'center', marginTop: "2%" }}>
                <Card style={{ width: '90%', height: "250px"}}>
                    <Card.Title style={{ fontFamily: "inter-bold", marginLeft: "1%", marginTop: "1%" }}>Personal Notes <Button variant="success">Add Notes</Button></Card.Title>
                </Card>
            </Container>
            <Container style={{ display: 'flex', justifyContent: 'center', marginTop: "2%" }}>
                <Card style={{ width: '90%', height: "250px"}}>
                    <Card.Title style={{ fontFamily: "inter-bold", marginLeft: "1%", marginTop: "1%" }}>First Delegate Notes <Button variant="success">Add Notes</Button></Card.Title>
                </Card>
            </Container>
            <Container style={{ display: 'flex', justifyContent: 'center', marginTop: "2%" }}>
                <Card style={{ width: '90%', height: "250px"}}>
                    <Card.Title style={{ fontFamily: "inter-bold", marginLeft: "1%", marginTop: "1%" }}>Second Delegate Notes <Button variant="success">Add Notes</Button></Card.Title>
                </Card>
            </Container>
            <Container style={{ display: 'flex', justifyContent: 'center', marginTop: "2%" }}>
                <Card style={{ width: '90%', height: "250px"}}>
                    <Card.Title style={{ fontFamily: "inter-bold", marginLeft: "1%", marginTop: "1%" }}>MoDA Notes <Button variant="success">Add Notes</Button></Card.Title>
                </Card>
            </Container>
            <Container style={{ display: 'flex', justifyContent: 'center', marginTop: "2%" }}>
                <Card style={{ width: '90%', height: "250px"}}>
                    <Card.Title style={{ fontFamily: "inter-bold", marginLeft: "1%", marginTop: "1%" }}>HoLC Delegate Notes <Button variant="success">Add Notes</Button></Card.Title>
                </Card>
            </Container>
            <Container style={{ display: 'flex', justifyContent: 'center', marginTop: "2%" }}>
                <Card style={{ width: '90%', height: "250px"}}>
                    <Card.Title style={{ fontFamily: "inter-bold", marginLeft: "1%", marginTop: "1%" }}>House Rep Notes <Button variant="success">Add Notes</Button></Card.Title>
                </Card>
            </Container>
        </div>
    )
}


export default BillPage;