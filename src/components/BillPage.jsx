import React from 'react';
import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import AddNotesForm from './AddNotesForm';

// ** READ BELOW **

// this is a sample page for the bill page, it is not connected to the backend
// currently, this is mimicking a situation where the person signed in is a regular user, and is not a first del or higher
// the notes section is currently not connected to the backend, but it is a good example of how we can implement it
// nothing will persist, and "add notes" buttons will have to be added and conditionally rendered later on, this
// is a quick example and is hard coded and not meant to be a long term solution

function BillPage() {

    const [addingNotes, setAddingNotes] = React.useState(false);
    const [notes, setNotes] = React.useState([]);

    const handleAddNotes = () => {
        setAddingNotes(!addingNotes);
    }


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
                <Card style={{ width: '90%', height: "250px" }}>
                    <Card.Title style={{ fontFamily: "inter-bold", marginLeft: "1%", marginTop: "1%", textDecoration: "underline" }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: "1%" }}>
                            Personal Notes
                            <Button variant="success" style={{ textDecoration: 'none' }} onClick={handleAddNotes}>{ addingNotes ? "Exit" : "Add Notes"}</Button>
                        </div>
                    </Card.Title>
                    {addingNotes && <AddNotesForm setNotes={setNotes} />}

                    <div style={{ overflow: "auto" }}>

                        <ul>
                            {notes.map((note, index) => (
                                <li key={index}>{note}</li>
                            ))}
                        </ul>
                    </div>
                </Card>
            </Container>

            <Container style={{ display: 'flex', justifyContent: 'center', marginTop: "2%" }}>
                <Card style={{ width: '90%', height: "250px" }}>
                    <Card.Title style={{ fontFamily: "inter-bold", marginLeft: "1%", marginTop: "1%", textDecoration: "underline" }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: "1%" }}>
                            First Delegate Notes
                        </div>
                    </Card.Title>
                    <div style={{ overflow: "auto" }}>
                        <ul style={{ marginTop: "2%" }}>
                            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                            <li>Curabitur tristique massa eu metus faucibus, vel ullamcorper velit tincidunt.</li>
                            <li>Sed fermentum neque eu enim cursus, a congue justo luctus.</li>
                            <li>Vestibulum auctor libero vel libero interdum, nec venenatis dui pellentesque.</li>
                            <li>Proin id turpis in ipsum hendrerit cursus ut quis enim.</li>
                            <li>Nulla facilisi. In hac habitasse platea dictumst.</li>
                            <li>Quisque nec leo vel ipsum blandit bibendum at vel nisi.</li>
                            <li>Ut a justo in odio fermentum tristique id et purus.</li>
                            <li>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</li>
                            <li>Integer vitae tortor vel libero rutrum venenatis non eu massa.</li>
                        </ul>
                    </div>               </Card>
            </Container>
            <Container style={{ display: 'flex', justifyContent: 'center', marginTop: "2%" }}>
                <Card style={{ width: '90%', height: "250px" }}>
                    <Card.Title style={{ fontFamily: "inter-bold", marginLeft: "1%", marginTop: "1%", textDecoration: "underline" }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: "1%" }}>
                            Second Delegate Notes
                        </div>
                    </Card.Title>
                    <div style={{ overflow: "auto" }}>
                        <ul style={{ marginTop: "2%" }}>
                            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                            <li>Curabitur tristique massa eu metus faucibus, vel ullamcorper velit tincidunt.</li>
                            <li>Sed fermentum neque eu enim cursus, a congue justo luctus.</li>
                            <li>Vestibulum auctor libero vel libero interdum, nec venenatis dui pellentesque.</li>
                            <li>Proin id turpis in ipsum hendrerit cursus ut quis enim.</li>
                            <li>Nulla facilisi. In hac habitasse platea dictumst.</li>
                            <li>Quisque nec leo vel ipsum blandit bibendum at vel nisi.</li>
                            <li>Ut a justo in odio fermentum tristique id et purus.</li>
                            <li>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</li>
                            <li>Integer vitae tortor vel libero rutrum venenatis non eu massa.</li>
                        </ul>
                    </div>
                </Card>
            </Container>
            <Container style={{ display: 'flex', justifyContent: 'center', marginTop: "2%" }}>
                <Card style={{ width: '90%', height: "250px" }}>
                    <Card.Title style={{ fontFamily: "inter-bold", marginLeft: "1%", marginTop: "1%", textDecoration: "underline" }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: "1%" }}>
                            MoDA Notes
                        </div>
                    </Card.Title>
                    <div style={{ overflow: "auto" }}>
                        <ul style={{ marginTop: "2%" }}>
                            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                            <li>Curabitur tristique massa eu metus faucibus, vel ullamcorper velit tincidunt.</li>
                            <li>Sed fermentum neque eu enim cursus, a congue justo luctus.</li>
                            <li>Vestibulum auctor libero vel libero interdum, nec venenatis dui pellentesque.</li>
                            <li>Proin id turpis in ipsum hendrerit cursus ut quis enim.</li>
                            <li>Nulla facilisi. In hac habitasse platea dictumst.</li>
                            <li>Quisque nec leo vel ipsum blandit bibendum at vel nisi.</li>
                            <li>Ut a justo in odio fermentum tristique id et purus.</li>
                            <li>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</li>
                            <li>Integer vitae tortor vel libero rutrum venenatis non eu massa.</li>
                        </ul>
                    </div>
                </Card>
            </Container>
            <Container style={{ display: 'flex', justifyContent: 'center', marginTop: "2%" }}>
                <Card style={{ width: '90%', height: "250px" }}>
                    <Card.Title style={{ fontFamily: "inter-bold", marginLeft: "1%", marginTop: "1%", textDecoration: "underline" }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: "1%" }}>
                            HoLC Notes
                        </div>
                    </Card.Title>
                    <div style={{ overflow: "auto" }}>
                        <ul style={{ marginTop: "2%" }}>
                            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                            <li>Curabitur tristique massa eu metus faucibus, vel ullamcorper velit tincidunt.</li>
                            <li>Sed fermentum neque eu enim cursus, a congue justo luctus.</li>
                            <li>Vestibulum auctor libero vel libero interdum, nec venenatis dui pellentesque.</li>
                            <li>Proin id turpis in ipsum hendrerit cursus ut quis enim.</li>
                            <li>Nulla facilisi. In hac habitasse platea dictumst.</li>
                            <li>Quisque nec leo vel ipsum blandit bibendum at vel nisi.</li>
                            <li>Ut a justo in odio fermentum tristique id et purus.</li>
                            <li>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</li>
                            <li>Integer vitae tortor vel libero rutrum venenatis non eu massa.</li>
                        </ul>
                    </div>                </Card>
            </Container>
            <Container style={{ display: 'flex', justifyContent: 'center', marginTop: "2%" }}>
                <Card style={{ width: '90%', height: "250px" }}>
                    <Card.Title style={{ fontFamily: "inter-bold", marginLeft: "1%", marginTop: "1%", textDecoration: "underline" }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: "1%" }}>
                            House Rep Notes
                        </div>
                    </Card.Title>
                    <div style={{ overflow: "auto" }}>
                        <ul style={{ marginTop: "2%" }}>
                            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                            <li>Curabitur tristique massa eu metus faucibus, vel ullamcorper velit tincidunt.</li>
                            <li>Sed fermentum neque eu enim cursus, a congue justo luctus.</li>
                            <li>Vestibulum auctor libero vel libero interdum, nec venenatis dui pellentesque.</li>
                            <li>Proin id turpis in ipsum hendrerit cursus ut quis enim.</li>
                            <li>Nulla facilisi. In hac habitasse platea dictumst.</li>
                            <li>Quisque nec leo vel ipsum blandit bibendum at vel nisi.</li>
                            <li>Ut a justo in odio fermentum tristique id et purus.</li>
                            <li>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</li>
                            <li>Integer vitae tortor vel libero rutrum venenatis non eu massa.</li>
                        </ul>
                    </div>
                </Card>
            </Container>
        </div>
    )
}


export default BillPage;