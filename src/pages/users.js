import React, { useState } from "react";
import "../styles/users.css"
import ProjectHeader from "../components/mainHeader";
import {IconButton} from "../components/buttons";
import { Dialog } from '@base-ui-components/react/dialog';
import '../styles/sidebar.css';

const InviteDialog = ({id, roles}) => {

    function copy(){
        navigator.clipboard.writeText("plan.app/invite/"+id)
    }

    return (
        <div className="popup-main">
            <h3>Invitar a {id}</h3>
            <div className="invite-options">
                <div className="invite-option">
                    <input placeholder="correo electrónico" />
                    <select className="role-select" id={"invite-role"}>
                        {roles.map((role) => {
                            return <option>{role}</option>
                        })}
                    </select>
                    <Dialog.Close className="main-btn">Invitar</Dialog.Close>
                </div>
                <hr/>
                <div className="invite-option">
                    <p>Enlace de invitación</p>
                    <input disabled id="invite-link" value={"plan.app/invite/"+id} />
                    <Dialog.Close className="main-btn" onClick={copy}>Copiar Enlace</Dialog.Close>
                </div>
            </div>
        </div>
    )

}

const UserList = ({users, roles}) => {

    function updateUsers(event) {
        console.log(event.target.value)
        let newUsers = [...usersValue]
        newUsers[event.target.id.split("-")[1]].role = event.target.value
        setUsers(newUsers)
    }
    
    const [usersValue, setUsers] = useState(users);

    var userElems = []

    for (let i in usersValue){
        userElems.push(
        <div className="user" id={usersValue[i].name}>
            {usersValue[i].name}
            <select className="role-select" id={"select-"+i} onChange={updateUsers}>
                {roles.map((role) => {
                    return <option selected={role===usersValue[i].role}>{role}</option>
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
    const users = [{name: "Usuario 1", role: "Transportista"}, {name: "Usuario 2", role: "Transportista"}, {name: "Usuario 3", role: "Administrador"}, {name: "Usuario 4", role: "Transportista"}]
    const roles = ["Transportista", "Administrador", "Supervisor", "Operario"]

    return (
        <div className="users-main">
            <ProjectHeader id={params.id} current="users"/>
            <main>
                <UserList users={users} roles={roles}/>
                <div className="buttons">
                    <Dialog.Root>
                        <Dialog.Trigger className="dialog-btn">
                            <IconButton id="user-add-btn" disabled src="/icons/user-add.svg"/>
                        </Dialog.Trigger>
                        <Dialog.Portal keepMounted>
                            <Dialog.Backdrop className="dialog-background" />
                            <Dialog.Popup className="dialog-main">
                                <InviteDialog id={params.id} roles={roles}/>
                            </Dialog.Popup>
                        </Dialog.Portal>
                    </Dialog.Root>
                    <IconButton id="roles-btn" src="/icons/list.svg"/>
                </div>
            </main>
        </div>
    )

}

export default Users