import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Routescomponent from './routeComponent';
import reportWebVitals from './reportWebVitals';
import store, { persistor } from "./store";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { v4 } from 'uuid';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
const id = v4();

serviceWorkerRegistration.register();

const socket = new WebSocket('wss://seal-app-ugskj.ondigitalocean.app/');



root.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <Routescomponent id={id} socket={socket} />
      </Provider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();