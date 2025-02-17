import React from "react";
import ProjectHeader from "../components/mainHeader";
import "../styles/profile.css"


const changeProfile = (e) => {
    e.preventDefault();
    console.log("change profile");
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
        <div>
            <ProjectHeader id={params.id} current="profile" />
            <main className="profile-main">
                <form onSubmit={changeProfile}>
                    <img src={image} alt="user" />
                    <input type="text" placeholder="Nombre de usuario" />
                    <input type="text" placeholder="Correo electrónico" />
                    <input type="password" placeholder="Contraseña" />
                    <input type="submit" value="Guardar" />
                </form>
            </main>
        </div>
    )
}

export default Profile