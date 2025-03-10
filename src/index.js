import React from 'react';
import ReactDOM from 'react-dom/client';
// import { store } from './components/store/store'
// import { Provider } from 'react-redux'

import App from './App.jsx';

import { store } from './store/store.js'
import { Provider } from 'react-redux'

import {BrowserRouter} from "react-router-dom";
import reportWebVitals from './reportWebVitals.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // StrictMode has been commented due to marker on map while on localhost
  <BrowserRouter>
    <Provider store={store}>
      <App/>
    </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
