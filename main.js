import React from 'react';
import { render } from 'react-dom';
import LoginUser from './app.jsx';
import Home from './home.jsx';
import VerMas from './ver-mas.jsx';
import CarShop from './car-shop.jsx';
import { Router, Route } from "react-router-dom";
import { createBrowserHistory } from 'history';
import './node_modules/bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';
import './css/style.login.css';
import './css/style.home.css';
import './css/style.top-bar.css';
import './css/style.car-shop.css'

const history = createBrowserHistory();

render(
    <Router history={history}>
        <Route path="/" exact component={LoginUser}/>
        <Route path="/home" component={Home}/>
        <Route path="/ver-mas/:id" component={VerMas}/>
        <Route path="/car-shop" component={CarShop}/>
    </Router>,
    document.getElementById('app')
);