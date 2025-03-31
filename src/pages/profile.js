import React from "react";
import ProjectHeader from "../components/mainHeader";
import "../styles/profile.css"
import axios from 'axios';


const changeProfile = (e) => {
    e.preventDefault();
    console.log(e.target.username.value, e.target.email.value, e.target.password.value)
    const body = {}
    //if (e.target.username.value)
    //    body['username'] = e.target.username.value
    if (e.target.email.value)
        body['email'] = e.target.email.value
    if (e.target.password.value)
        body['password'] = e.target.password.value
    axios.put('http://localhost:8080/api/users/'+sessionStorage.userId, body).then((data) => {
        console.log(data)
        window.location.href = "/projects";
    }).catch((error) => {
        console.log(error)
    })
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
                <form className="profile-form" autoComplete="off" onSubmit={changeProfile}>
                    <div id="form-head">
                        <img className="profile-image" src="https://picsum.photos/200" alt="user" />
                        <div id="username-field">
                            <label for="username">Nombre de usuario</label>
                            <input id="username" name="username" autoComplete="off" className="profile-input" type="text" placeholder="Nombre de usuario" />
                        </div>
                    </div>

                        <label for="email">Correo electrónico</label>
                        <input id="email" name="email" className="profile-input" type="text" placeholder="Correo electrónico" />
                        
                        <label for="password">Contraseña</label>
                        <input id="password" name="password" autoComplete="new-password" className="profile-input" type="password" placeholder="Contraseña" />
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