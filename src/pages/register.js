import React from "react";
import "../styles/register.css"
import { LogoHalf } from "../components/logoHalf";
import axios from "axios";

const Register = () => {

    async function register(e) {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const repeatPassword = document.getElementById("repeat-password").value;
        if (password !== repeatPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
            const res = await axios.post("http://localhost:8080/api/register", { email, password });
            const data = await res.data;

            if (res.status === 200) {
                console.log(res)
                sessionStorage.setItem("userId", data.userId);
                window.location.href = "/projects";
            }
    }

    return (
        <div className="split">
            <LogoHalf/>
            <div className="form-half">
                <h1>Crea una cuenta</h1>
                <form className="register" onSubmit={register}>
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