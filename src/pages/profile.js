import React from "react";
import ProjectHeader from "../components/mainHeader";
import "../styles/profile.css"


const changeProfile = (e) => {
    e.preventDefault();
    alert("Feature not implemented yet");
}

function cancel() {
    window.location.href = "/projects";
}

function getUserInfo() {
    const username = sessionStorage.getItem('username');
    const image = "/icons/user-circle.svg"
    const email = sessionStorage.getItem('email');
    return {username, image, email};
}

const Profile = ({params}) => {

    const {username, image, email} = getUserInfo();

    return (
        <div className="profile-main">
            <ProjectHeader id={params.id} current="profile" />
            <main>
                <form className="profile-form" onSubmit={changeProfile}>
                    <div id="form-head">
                        <img className="profile-image" src="https://picsum.photos/200" alt="user" />
                        <div id="username-field">
                            <label for="username">Nombre de usuario</label>
                            <input id="username" className="profile-input" type="text" placeholder="Nombre de usuario" />
                        </div>
                    </div>

                        <label for="email">Correo electrónico</label>
                        <input id="email" className="profile-input" type="text" placeholder="Correo electrónico" />
                        
                        <label for="password">Contraseña</label>
                        <input id="password" className="profile-input" type="password" placeholder="Contraseña" />
                    <div className="profile-buttons">
                        <input type="submit" className="main-btn" value="Guardar" />
                        <input type="button" className="secondary-btn" onClick={cancel} value="Cancelar" />
                    </div>
                </form>
            </main>
        </div>
    )
}

export default Profile