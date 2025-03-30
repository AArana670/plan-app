import React from "react";
import "../styles/login.css"
import { LogoHalf } from "../components/logoHalf";
import axios from "axios";

const Login = () => {
    async function login(e) {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        const res = await axios.post("http://localhost:8080/api/login", { email, password });
        const data = await res.data;
        if (res.status === 200) {
            sessionStorage.setItem("userId", data.user.id);
            window.location.href = "/projects";
        } else {
            alert("Error al iniciar sesión");
        }
    }

    return (
        <div className="split">
            <LogoHalf/>
            <div className="form-half">
                <h1>Únete ahora</h1>
                <form className="login" onSubmit={login}>
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

