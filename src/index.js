import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './Home';
import reportWebVitals from './reportWebVitals';
import Header from "./components/Header";
import Footer from "./components/Footer";
import ClaimYourSeat from './components/Claim-Your-Seat'
import EnterTheFloor from './components/Enter-the-Floor'
import Error from './components/Error';
import {BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header></Header>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home/>}/>
          <Route path="/claim-your-seat" element={<ClaimYourSeat/>}/>
          <Route path="/enter-the-floor" element={<EnterTheFloor/>}/>
          <Route path='*' element={< Error/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
      
    <Footer></Footer>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
