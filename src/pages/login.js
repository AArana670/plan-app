import React from "react";
import "../login.css"

const Login = () => {
    return (
        <div className="split">
            <div className="logo-half">
                <a href='./login' className="logo">
                    <img src="logo.jpg" alt="logo" className="logo-img" />
                    <h1 className="logo-text-1">Plan A</h1>
                </a>
            </div>
            <div className="form-half">
                <h1>Únete ahora</h1>
                <form>
                    <label for="email">Correo electrónico</label>
                    <input id="email" type="text" placeholder="Correo electrónico" />
                    <label for="password">Contraseña</label>
                    <input id="password" type="password" placeholder="Contraseña" />
                    <div className="form-buttons">
                        <button className="main-btn" type="submit">Iniciar sesión</button>
                        <button className="secondary-btn" type="button">Crear cuenta</button>
                    </div>
                </form>
                <a href="/forgot">He olvidado mi contraseña</a>
            </div>
        </div>);
};

export default Login;

