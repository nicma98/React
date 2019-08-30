import React from 'react';
import TopBar from './top-bar.jsx';
import { Link } from 'react-router-dom';
import * as request from 'superagent';

class Home extends React.Component{
    constructor(props){
        super(props);
        this.initProducts();
        this.state = { 
            products: [],
            filterText: '',
            addProd: 0
        };
        this.handleFilterProduct = this.handleFilterProduct.bind(this);
        this.addProductCar = this.addProductCar.bind(this);
    }
    initProducts(){
        request
        .get('http://localhost:8090/getProducts')
        .set('X-API-Key', 'foobar')
        .set('Accept', 'text')
        .end((err, res) => {
            if (err || !res.ok) {
                console.log('Error: '+err)
            } else {
                let jsonRes = JSON.parse(res.text);
                this.setState({ products: jsonRes })
            }
        })
    }
    handleFilterProduct(filterText){
        this.setState(
            {filterText: filterText}
        );
    }
    addProductCar(cantidad,idProduct,precio){
        let idUser = localStorage.getItem('idUser');
        let cantidadCar = parseFloat(this.state.addProd) + parseFloat(cantidad);
        this.setState({ addProd: cantidadCar })
        let jsonReq = {
            idUser: idUser,
            id: idProduct,
            cantidad: cantidad,
            precio: precio,
        }
        request
        .post('http://localhost:8090/add-product')
        .set('X-API-Key', 'foobar')
        .set('Accept', 'text')
        .send(jsonReq)
        .end((err, res) => {
            if (err || !res.ok) {
                console.log('Error: '+err)
            } else {
                let jsonRes = JSON.parse(res.text);
            }
        })

    }
    render(){
        return(
            <div className="container">
                <TopBar addNew={this.state.addProd}></TopBar>
                <div className="cat-productos row bg-light">
                    <div className="top-sp col-6 left-med">
                        <h2>Catalogo de productos</h2>
                    </div>
                    <div className="top-sp col-5">
                        <div className="row">
                            <div className="col-12">
                                <SearchBar filterText={this.state.filterText} onFilterTextChange={this.handleFilterProduct}></SearchBar>
                            </div>
                        </div>
                    </div>
                    <div className="col-11 all-products">
                        <ProductTable
                        shopProduct={this.addProductCar}
                        products={this.state.products}
                        filterText={this.state.filterText}/>
                    </div>
                </div>
            </div>
        );
    }
}

class SearchBar extends React.Component {
    constructor(props){
        super(props);
        this.handleFilterProduct = this.handleFilterProduct.bind(this);
    }
    handleFilterProduct(e) {
        this.props.onFilterTextChange(e.target.value.toLowerCase());
      }
    render(){
        return(
            <form className="form-inline">                    
                <input className="form-control col-8" type="search" placeholder="Search" aria-label="Search" name="filterProducts" value={this.props.filterText} onChange={this.handleFilterProduct}/>
                <button className="btn btn-outline-success col-3" type="submit" >Search</button>
            </form>
        );
    }
}

class ProductRow extends React.Component {
    constructor(props){
        super(props);
        this.addProduct = this.addProduct.bind(this);
    }
    addProduct(cantidad,idProduct,precio){
        this.props.getProduct(cantidad,idProduct,precio);
    }
    render() {
      const product = this.props.product;
      return (
        <div className="col-4">
            <div className="row producto top-sp">
                <div className="col-11 left-med">
                    <img  src={'./assets/'+product.imagen} alt={product.nombre} className="img-fluid"/>
                </div>
                <div className="col-11 left-med">
                    <h4>{product.nombre}</h4>
                </div>
                <div className="col-11 left-med">
                    <p>Precio: ${product.precio}</p>
                </div>
                <div className="col-11 left-med">
                    <p>Unidades disponibles: {product.q_disponibles}</p>
                </div>
                <div className="top-sp col-11 left-med">
                    <div className="row">
                        <div className="col-4 btns-product">
                            <button type="button" className="btn btn-primary">
                                <Link to={"/ver-mas/"+product.idproductos}>Ver más</Link>
                            </button>
                        </div>
                        <div className="form-group col-8 btns-product">
                            <AddProduct q_disponibles={product.q_disponibles} idProduct={product.idproductos} onAddProduct={this.addProduct} precio={product.precio}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
    }
}

class ProductTable extends React.Component {
    constructor(props){
        super(props);
        this.newProduct = this.newProduct.bind(this) 
    }
    newProduct(cantidad,idProduct,precio){
        this.props.shopProduct(cantidad,idProduct,precio);
    }
    render() {
      const filterText = this.props.filterText;
  
      const rows = [];
  
      this.props.products.forEach((product) => {
        if (product.nombre.toLowerCase().indexOf(filterText) === -1) {
          return;
        }
        rows.push(
          <ProductRow
            getProduct={this.newProduct}
            product={product}
            key={product.idproductos}
          />
        );
      });
  
      return (
          <div className="row">{rows}</div>
      );
    }
}

class AddProduct extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            cantidad: '',
            idProduct: this.props.idProduct,
            precio: this.props.precio
        }
        this.handleCantidad = this.handleCantidad.bind(this)
        this.addProduct = this.addProduct.bind(this)
    }
    addProduct(e){
        this.props.onAddProduct(this.state.cantidad,this.state.idProduct,this.state.precio)
        e.preventDefault();
    }
    handleCantidad(e){
        const value = e.target.value;
        this.setState({cantidad: value})
    }
    render(){
        const q_disponibles = this.props.q_disponibles

        return (
            <form className="row" onSubmit={this.addProduct}>
                <div className="btns-product col-5">
                    <button type="submit" className="btn btn-secondary btn-adicionar" onClick={this.addProduct}>Añadir</button>
                </div>
                <div className="btns-product col-7">
                    <input type="number" id="cantidad"  min="1" max={q_disponibles} className="form-control" name="cantidad" value={this.state.cantidad} onChange={this.handleCantidad}/>
                </div>
            </form>
        );
    }
}

export default Home;