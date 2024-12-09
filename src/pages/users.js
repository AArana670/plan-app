import React from "react";
import "../styles/users.css"
import ProjectHeader from "../components/mainHeader";
import IconButton from "../components/buttons"

const UserList = ({users, roles}) => {
    var userElems = []

    for (let i in users){
        userElems.push(
        <div className="user" id={users[i].name}>
            {users[i].name}
            <select className="role-select">
                {roles.map((role) => {
                    return <option selected={role==users[i].role}>{role}</option>
                })}
            </select>
        </div>)
    };

    return (
        <div className="userlist">
            {userElems}
        </div>
    )
}

const Users = ({id, params}) => {
    const users = [{name: "Usuario 1", role: "Transportista"}, {name: "Usuario 2", role: "Transportista"}, {name: "Usuario 3", role: "Administrador"}, {name: "Usuario 1", role: "Transportista"}]
    const roles = ["Transportista", "Administrador", "Supervisor", "Operario"]

    return (
        <div className="users-main">
            <ProjectHeader id={params.id} current="users"/>
            <main>
                <UserList users={users} roles={roles}/>
                <div className="buttons">
                    <IconButton id="user-add-btn" src="/icons/user-add.svg"/>
                    <IconButton id="roles-btn" src="/icons/list.svg"/>
                </div>
            </main>
        </div>
    )

}

export default Users