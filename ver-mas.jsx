import React from 'react';
import TopBar from './top-bar.jsx';
import * as request from 'superagent';
import { Router, Route, Link } from 'react-router-dom';

class VerMas extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: this.props.match.params.id,
            product: []
        }
        this.initProduct()
    }
    initProduct(){
        let jsonReq = {
            id: this.state.id
        }
        request
        .post('http://localhost:8090/detail-product')
        .set('X-API-Key', 'foobar')
        .set('Accept', 'text')
        .send(jsonReq)
        .end((err, res) => {
            if (err || !res.ok) {
                console.log('Error: '+err)
            } else {
                let jsonRes = JSON.parse(res.text);
                this.setState({ product: jsonRes[0] })
            }
        })
    }
    render(){
        return(
            <div className="container">
                <TopBar></TopBar>
                <div className="ver-mas row bg-light">
                    <div className="col-11 left-med">
                        <div className="row">
                            <div className="top-sp col-12">
                                <h2>{this.state.product.nombre}</h2>
                            </div>
                            <div className="top-sp col-6">
                                <img src={'../assets/' + this.state.product.imagen} alt={this.state.product.nombre} className="img-fluid"/>
                            </div>
                            <div className="top-sp col-6">
                                <div className="row">
                                    <div className="col-10 offset-1">
                                        <p>Precio: ${this.state.product.precio}</p>
                                        <p>Unidades disponibles: {this.state.product.q_disponibles}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="top-sp col-12">
                                <button type="button" className="btn btn-primary">
                                    <Link to="/home">Atras</Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default VerMas;