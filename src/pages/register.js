import React from "react";
import "../styles/register.css"
import { LogoHalf } from "../components/logoHalf";

const Register = () => {
    return (
        <div className="split">
            <LogoHalf/>
            <div className="form-half">
                <h1>Crea una cuenta</h1>
                <form className="register">
                    <label for="email">Correo electrónico</label>
                    <input id="email" type="text" placeholder="Correo electrónico" />
                    <label for="password">Contraseña</label>
                    <input id="password" type="password" placeholder="Contraseña" />
                    <label for="repeat-password">Repetir contraseña</label>
                    <input id="repeat-password" type="password" placeholder="Contraseña" />
                    <button className="main-btn" type="submit">Crear cuenta</button>
                    
                </form>
                <a href="/login">Ya tengo una cuenta</a>
            </div>
        </div>);
}

export default Register