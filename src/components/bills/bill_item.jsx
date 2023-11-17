import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
// import { pod, authenticate } from '../store/userSlice.js';
// import { baseURL } from '../store/conf.js'


import Form from 'react-bootstrap/Form';

function Bill_Item ({bill, index}){
    return (
        <tr key={index}>
            <td>H.R. {bill.number} - {index}</td>
            <td> <Link to={'/'}>{bill.title}</Link> </td>
            <td>{bill.schedule_date}</td>
            <td>{bill.advice}</td>
            
            <td>{['radio'].map((type) => (
                <div key={`inline-${type}`} className="mb-3">
                    <Form>
                        <Form.Check
                            inline
                            label="YEA"
                            name="group1"
                            type={type}
                            id={index}
                        />
                        <br />
                        <Form.Check
                            inline
                            label="NAY"
                            name="group1"
                            type={type}
                            id={index}
                        />
                        <br />
                        <Form.Check
                            inline
                            label="PRESENT"
                            name="group1"
                            type={type}
                            id={index}
                            defaultChecked
                        />
                        <br />
                        <Form.Check
                            inline
                            label="PROXY"
                            name="group1"
                            type={type}
                            id={index}
                            defaultChecked
                        />
                    </Form>
                </div>
            ))}</td>
        
            <td>
                <span className='border border-dark px-5'>{bill.yea_votes_count}</span>
                <br />
                <span className='border border-dark px-5'>{bill.nay_votes_count}</span>
                <br />
                <span className='border border-dark px-5'>{bill.present_votes_count}</span>
                <br />
                <span className='border border-dark px-5'>{bill.proxy_votes_count}</span>
                <br />
            </td>
            <td>
                <span className='border border-dark px-5'>{bill.yea_votes_count}</span>
                <br />
                <span className='border border-dark px-5'>{bill.nay_votes_count}</span>
                <br />
                <span className='border border-dark px-5'>{bill.present_votes_count}</span>
                <br />
                <span className='border border-dark px-5'>{bill.proxy_votes_count}</span>
                <br />
            </td>
            <td><Link to={`/bill`}> More </Link> </td>
        </tr>
    )
}

export default Bill_Item;