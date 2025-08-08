import React from "react"
import "../styles/login.css"
import { LogoHalf } from "../components/logoHalf"
import axios from "axios"

const ErrorMessage = ({message}) => {
    if (!message) return null
    return (
        <div className="error-message">
            {message}
        </div>
    )
}

const Login = () => {

    const [errorMsg, setErrorMsg] = React.useState(null)

    async function login(e) {
        e.preventDefault()
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value

        try{
            const res = await axios.post(process.env.REACT_APP_SERVER+"/api/login", { email, password })
            const data = await res.data;
            if (res.status === 200) {
                sessionStorage.setItem("userId", data.user.id)
                sessionStorage.setItem("username", data.user.username)
                window.location.href = "/projects"
            } else {
                alert("Error al iniciar sesión")
            }
        } catch (error) {
            setErrorMsg(error.response.data.error)
        }
    }

    return (
        <div className="split">
            <LogoHalf/>
            <div className="form-half">
                <h1>Únete ahora</h1>
                <ErrorMessage message={errorMsg}/>
                <form className="login" onSubmit={login}>
                    <label for="email">Correo electrónico</label>
                    <input id="email" name="email" type="text" placeholder="Correo electrónico" />
                    <label for="password">Contraseña</label>
                    <input id="password" name="password" type="password" placeholder="Contraseña" />
                    <div className="form-buttons">
                        <button className="main-btn" type="submit">Iniciar sesión</button>
                        <a href="/register">
                            <button className="secondary-btn" type="button">Crear cuenta</button>
                        </a>
                    </div>
                </form>
                {/*<a href="/forgot">He olvidado mi contraseña</a>*/}
            </div>
        </div>)
};

export default Login

