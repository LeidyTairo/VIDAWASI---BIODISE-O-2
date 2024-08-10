import React from "react";
import './../styles/main.css'
import { Link, useNavigate } from "react-router-dom";

const Main = () => {
    const navigate = useNavigate();
    return (
        <section className="main-container">
            <ul className="ul-container">
                <Link to="/">Inicio</Link>
                <Link to="/">Sobre Nosotros</Link>
                <Link to="/login">Iniciar Sesión</Link>
                <Link to="/create-account">Crear Cuenta</Link>
            </ul>
            <img src={require('../img/fondo.jpeg')}alt="fondo-qualikay" id="img-main"/>
            <h1 className="main-h2">
                QHA<span className="white-letter">LIKAY</span>  
            </h1>
            <button id="button-main" onClick={()=>navigate("/create-account")}>Empezar</button>
        </section>
    )
}

export default Main;