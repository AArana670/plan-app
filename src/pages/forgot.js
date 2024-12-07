import React from "react";
import "../styles/forgot.css"
import { LogoHalf } from "../components/logoHalf";

function Form({step}) {
    switch (step)
    {
        case 1:
            return(
                <form>
                    <label for="email">Correo electrónico</label>
                    <input id="email" type="text" placeholder="Correo electrónico" />
                    <button className="main-btn" type="button">Recuperar contraseña</button>
                </form>)
        case 2:
            return(
                <form>
                    <label for="code">Código de verificación</label>
                    <input id="code" type="number" placeholder="Código de verificación" />
                </form>)
        case 3:
            return(
                <form>
                    <label for="password">Nueva contraseña</label>
                    <input id="password" type="password" placeholder="Contraseña" />
                    <label for="repeat-password">Repetir contraseña</label>
                    <input id="repeat-password" type="password" placeholder="Contraseña" />
                    <button className="main-btn" type="submit">Actualizar contraseña</button>
                </form>)
        default:
            return <h1>Error</h1>
    }
}

const Forgot = () => {
    return (
        <div className="split">
            <LogoHalf/>
            <div className="form-half">
                <h1>Recuperar contraseña</h1>
                <Form step={3}/>
                <a href="/login">Volver al inicio de sesión</a>
            </div>
        </div>);
}

export default Forgot