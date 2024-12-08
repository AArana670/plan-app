import React from "react";
import "../styles/login.css"
import { LogoHalf } from "../components/logoHalf";

const Login = () => {
    return (
        <div className="split">
            <LogoHalf/>
            <div className="form-half">
                <h1>Únete ahora</h1>
                <form className="login">
                    <label for="email">Correo electrónico</label>
                    <input id="email" type="text" placeholder="Correo electrónico" />
                    <label for="password">Contraseña</label>
                    <input id="password" type="password" placeholder="Contraseña" />
                    <div className="form-buttons">
                        <button className="main-btn" type="submit">Iniciar sesión</button>
                        <a href="/register">
                            <button className="secondary-btn" type="button">Crear cuenta</button>
                        </a>
                    </div>
                </form>
                <a href="/forgot">He olvidado mi contraseña</a>
            </div>
        </div>);
};

export default Login;

