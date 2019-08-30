import React from 'react';
import TopBar from './top-bar.jsx';
import { Link } from 'react-router-dom';
import * as request from 'superagent';

class CarShop extends React.Component{
    constructor(props){
        super(props)
        this.state = { 
            products: [],
            total: 0,
            statusPay: ''
        }
        this.initCar();
        this.payPedido = this.payPedido.bind(this);
    }
    payPedido(){
        let jsonReq = {
            id: localStorage.getItem('idUser'),
            products: this.state.products
        };
        request
        .post('http://localhost:8090/pago-pedido')
        .set('X-API-Key', 'foobar')
        .set('Accept', 'text')
        .send(jsonReq)
        .end((err, res) => {
            if (err || !res.ok) {
                console.log('Error: '+err)
            } else {
                if (res.text == 'OK') {
                    this.setState({ statusPay: 'El pago ha sido exitoso' })
                }
            }
        });
    }
    initCar(){
        let jsonReq = {
            id: localStorage.getItem('idUser')
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
                this.setState({ products: jsonRes });
                let total = 0;
                jsonRes.forEach(subTotal => {
                    let sub = subTotal.precio * subTotal.cantidad;
                    total = total + sub;
                })
                this.setState({ total: total })
            }
        })
    }
    render(){
        return(
            <div className="container">
                <TopBar addNew={0}/>
                <div className="car-productos row bg-light">
                    <div className="col-12">
                        <div className="row">
                            <div className="top-sp left-med col-11">
                                <h2>Carrito de compras</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="car-shop col-11">
                                <div className="all-pedido row">
                                    <div className="all-pedido-products col-6">
                                        <div className="row">
                                            <ProductosPedido products={this.state.products}/>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="row">
                                            <div className="left-med col-11">
                                                <h3>Total: <strong>$ {new Intl.NumberFormat('en-US').format(this.state.total)}</strong></h3>
                                            </div>
                                            <div className="left-med col-11">
                                                <button type="button" className="btn btn-primary">Cancelar</button>
                                                <button type="button" className="btn btn-secondary btn-pagar" onClick={this.payPedido}>Pagar</button>
                                            </div>
                                            <div className="left-med col-11">
                                                <h4>{this.state.statusPay}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class ProductosPedido extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        const rows = [];
        this.props.products.forEach(product => {
            rows.push(
                <Product
                product={product}
                key={product.idpedidos}
                />
            )
        });
        return(
            <div className="left-med col-11">{rows}</div>
        )
    }
}

class Product extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        const product = this.props.product;
        return(
            <div className="producto-pedido row">
                <div className="col-4">
                    <img src={'../assets/'+product.imagen} alt="" className="img-fluid"/>
                </div>
                <div className="col-8">
                    <div className="row">
                        <div className="col-12">
                            <h3>{product.nombre}</h3>
                        </div>
                        <div className="col-12">
                            Ref.<strong>{product.id_producto}</strong>
                        </div>
                        <div className="col-12">
                            Unidades: <strong>{product.cantidad}</strong>
                        </div>
                        <div className="col-12">Costo unitario: $<strong>{new Intl.NumberFormat('en-US').format(product.precio)}</strong>
                        </div>
                        <div className="col-12">
                            Subtotal: $<strong>{new Intl.NumberFormat('en-US').format(product.cantidad * product.precio)}</strong>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CarShop;