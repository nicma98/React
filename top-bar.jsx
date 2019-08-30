import React from 'react';
import { Link } from 'react-router-dom';
import * as request from 'superagent';

class TopBar extends React.Component{
    constructor(props){
        super(props);
        this.state = { 
            carShop: 0
        };
        this.initTopBar(localStorage.getItem('idUser'))
    }
    initTopBar(i){
        let jsonReq = {
            id: i
        }
        request
        .post('http://localhost:8090/car-shop')
        .set('X-API-Key', 'foobar')
        .set('Accept', 'text')
        .send(jsonReq)
        .end((err, res) => {
            if (err || !res.ok) {
                console.log('Error: '+err)
            } else {
                let jsonRes = JSON.parse(res.text);
                let aux = 0;
                jsonRes.forEach(product => {
                    aux = aux + product.cantidad
                });
                this.setState({ carShop: aux })
            }
        })
    }
    render(){
        return(
            <div className="row">
                <div className="col-12">
                    <div className="row top-bar">
                        <div className="col-10">
                            <div className="row">
                                <div className="sp-top offset-1 col-11">
                                    <h1>La Bodega</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="row icons-nav">
                                <div className="col icon">
                                    <Link to={"/home"}>
                                        <img src="./assets/home-icon.png" alt="" className="img-fluid"/>
                                    </Link>
                                </div>
                                <div className="col icon">
                                    <Link to={"/car-shop"}>
                                        <img src="./assets/shopping-cart-black-shape.png" alt="" className="img-fluid"/>
                                        <span className="alert-productos badge badge-warning">{parseFloat(this.state.carShop) + parseFloat(this.props.addNew)}</span>
                                    </Link>
                                </div>
                                <div className="col icon">
                                    <Link to={"/"}>
                                        <img src="./assets/logout.png" alt="" className="img-fluid"/>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TopBar;