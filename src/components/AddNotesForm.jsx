import React from 'react';
import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const AddNotesForm = ( { setNotes }) => {
    const [noteInput, setNoteInput] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setNotes(prevNotes => [...prevNotes, noteInput]);
        setNoteInput('');
     }
     

    return (
        <Container>
            <input type="text" value={noteInput} onChange={e => setNoteInput(e.target.value)} />
            <button onClick={handleSubmit}>Submit</button>
        </Container>
    )
}

export default AddNotesForm;