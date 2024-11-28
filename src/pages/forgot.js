import React from "react";
import "../styles/forgot.css"
import { LogoHalf } from "../components/logoHalf";

const Forgot = () => {
    return (
        <div className="split">
            <LogoHalf/>
            <div className="form-half">
                <h1>Recuperar contraseña</h1>
                <form>
                    <label for="email">Correo electrónico</label>
                    <input id="email" type="text" placeholder="Correo electrónico" />
                    <button className="main-btn" type="button">Recuperar contraseña</button>
                </form>
                <a href="/login">Volver al inicio de sesión</a>
            </div>
        </div>);
}

export default Forgot