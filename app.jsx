import React from 'react';
import * as request from 'superagent';

class LoginUser extends React.Component{
    constructor(){
        super();
        this.state = { 
            email: '',
            password: '',
            idUser: ''
        };
        this.handleChangeLogin = this.handleChangeLogin.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);   
    }

    handleChangeLogin(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });        
    }

    handleSubmit(event) {
        let jsonReq = {
            email: this.state.email,
            pass: this.state.password
        }
        request
        .post('http://localhost:8090/')
        .send(jsonReq)
        .set('X-API-Key', 'foobar')
        .set('Accept', 'text')
        .end((err, res) => {
            if (err || !res.ok) {
                console.log('Error: '+err)
            } else {
                let jsonRes = JSON.parse(res.text);
                if (jsonRes.msg == 'OK') {
                   this.setState({ idUser: jsonRes.id_user });
                   this.dataUser();
                   this.props.history.push('/home');                  
                } else {
                    alert('Usuario o contraseña incorrecta')
                }          
            }
        })
        event.preventDefault();
    }

    

    dataUser(){
        const { idUser } = this.state;
        localStorage.setItem('idUser', idUser);        
    }

    render(){
        return(
            <div className="container">
                <div className="row">
                    <div className="text-center col-4 offset-4">
                        <div className="row login-shop">
                            <div className="col-12">
                                <h3>Inicio de Sesión</h3>
                            </div>
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-12">
                                        <form onSubmit={this.handleSubmit}>
                                            <div className="text-left form-group">
                                                <label htmlFor="email">Correo Electronico</label>
                                                <input type="email" className="form-control" id="email" placeholder="ejemplo@email.com" name="email" required value={this.state.email} onChange={this.handleChangeLogin}/>
                                                <small id="email" className="form-text text-muted">Ingresa el e-mail con el que registraste tu cuenta.</small>
                                            </div>
                                            <div className="text-left form-group">
                                                <label htmlFor="password">Contraseña</label>
                                                <input type="password" className="form-control" id="password" aria-describedby="emailHelp" placeholder="" name="password" required value={this.state.password} onChange={this.handleChangeLogin}/>
                                            </div>
                                            <div className="alert alert-danger" role="alert">Usuario o Contraseña incorrecto, por favor verifique la información.</div>
                                            <button type="submit" className="btn btn-success center-block">Enviar</button>
                                        </form>
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


export default LoginUser;