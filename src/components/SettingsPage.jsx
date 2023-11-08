import { Container, Form, Table } from "react-bootstrap";

function SettingsPage() {

    return (
        <div>
            <Container>
                <h2>User Settings</h2>
                <div>
                    <Table striped bordered hover responsive>
                        <tbody>
                            <td>Bold Font</td>
                            <td>Bold the font of entire application to increase visibility.</td>
                            <td>
                                <Form>
                                    <Form.Check type="switch" id="custom-switch" />
                                </Form>
                            </td>
                        </tbody>
                    </Table>
                </div>
            </Container>
        </div>
    )
}

export default SettingsPage;