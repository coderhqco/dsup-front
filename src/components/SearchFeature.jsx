import React from "react";
import { useSelector } from 'react-redux';
import { Container, Form } from "react-bootstrap";

function SearchFeature() {
    const bills = useSelector((state) => state.bills.bills);

    return (
        <div className="h-screen flex items-center justify-center">
            <Container>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Search for a Bill</Form.Label>
                        <Form.Control placeholder="SEARCH FUNCTION CURRENTLY IN BETA" />
                    </Form.Group>
                </Form>
            </Container>
        </div>
    )
}

export default SearchFeature;