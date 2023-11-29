import React from 'react';
import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

// ** READ BELOW **

// this is a sample page for the bill page, it is not connected to the backend
// currently, this is mimicking a situation where the person signed in is a regular user, and is not a first del or higher
// the notes section is currently not connected to the backend, but it is a good example of how we can implement it
// nothing will persist, and "add notes" buttons will have to be added and conditionally rendered later on, this
// is a quick example and is hard coded and not meant to be a long term solution

function Insight() {

    const [addingNotes, setAddingNotes] = React.useState(false);
    const [notes, setNotes] = React.useState([]);

    const handleAddNotes = () => {
        setAddingNotes(!addingNotes);
    }


    return (
        <div className='container my-4'>
            {/* row section for bill stats and text */}
            <div className="row">
                <h1>H.R. 123</h1>
                <h5>Bill Title</h5>
                <br />
                <h5>Latest Actions</h5>
                <ul className='mx-3'>
                    <li>Date</li>
                    <li>Action</li>
                </ul>

                {/* card container for bill text */}
                <div className="card p-3">
                    <h4>Text</h4>
                    <article>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut 
                    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in 
                    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat 
                    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </article>
                </div>
            </div>

            {/* row section for bill personal notes */}
            <div className="row my-3">
                <h1>Personal Notes:</h1>
                {/* textarea full width of row for personal notes */}
                <textarea rows={10} placeholder='Place your personal notes here.' >
                </textarea>
            </div>

            {/* row section for bill first delegate notes */}
            <div className="row my-3">
                <h1>First Delegate Notes:</h1>
                {/* textarea full width of row for first delegate notes */}
                <textarea rows={10} placeholder='Your First Delegate notes will show here.' >
                </textarea>
            </div>

            {/* row section for bill second delegate notes */}
            <div className="row my-3">
                <h1>Second Delegate Notes:</h1>
                {/* textarea full width of row for second delegate notes */}
                <textarea rows={10} placeholder='Your Second Delegate notes will show here' >
                </textarea>
            </div>

            {/* row section for bill Member of District Assembly notes */}
            <div className="row my-3">
                <h1>MoDa Notes:</h1>
                {/* textarea full width of row for MoDa notes */}
                <textarea rows={10} placeholder='Your Member Of District Assembly notes will show here.' >
                </textarea>
            </div>

            {/* row section for bill Co-Rep notes */}
            <div className="row my-3">
                <h1>Co-Rep Notes:</h1>
                {/* textarea full width of row for Co-Rep notes */}
                <textarea rows={10} placeholder='Your Cop-Rep notes will show here.' >
                </textarea>
            </div>

            {/* row section for bill House Rep note */}
            <div className="row my-3">
                <h1>House Rep Notes:</h1>
                {/* textarea full width of row for House Rep notes */}
                <textarea rows={10} placeholder='Your House Rep notes will show here.' >
                </textarea>
            </div>

        </div>
    )
}


export default Insight;