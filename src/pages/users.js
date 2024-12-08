import React from "react";
import "../styles/users.css"
import ProjectHeader from "../components/mainHeader";

const UserList = ({users}) => {
    return (
        <div className="userlist">
            {users}
        </div>
    )
}

const Users = ({id, params}) => {
    const users = []

    return (
        <div>
            <ProjectHeader id={params.id} current="users"/>
            <main className="users-main">
                <UserList users={users}/>
                <div className="buttons">

                </div>
            </main>
        </div>
    )

}

export default Users