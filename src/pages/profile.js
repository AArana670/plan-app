import React from "react";


const Profile = ({params}) => {
    return (
        <header>
            <h1>{params.username}</h1>
        </header>
    )
}

export default Profile