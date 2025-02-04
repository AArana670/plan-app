import React, { useState } from "react";
import "../styles/users.css"
import ProjectHeader from "../components/mainHeader";
import {IconButton} from "../components/buttons"
import { Dialog } from '@base-ui-components/react/dialog';
import styles from '../styles/index.module.css';

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
    const users = [{name: "Usuario 1", role: "Transportista"}, {name: "Usuario 2", role: "Transportista"}, {name: "Usuario 3", role: "Administrador"}, {name: "Usuario 1", role: "Transportista"}]
    const roles = ["Transportista", "Administrador", "Supervisor", "Operario"]

    return (
        <div className="users-main">
            <ProjectHeader id={params.id} current="users"/>
            <main>
                <UserList users={users} roles={roles}/>
                <div className="buttons">
                    <Dialog.Root>
                        <Dialog.Trigger className={styles.Button}>
                            <IconButton id="user-add-btn" src="/icons/user-add.svg"/>
                        </Dialog.Trigger>
                        <Dialog.Portal keepMounted>
                            <Dialog.Backdrop className={styles.Backdrop} />
                            <Dialog.Popup className={styles.Popup}>
                                <div className="popup-main">
                                    <input placeholder="Enter your name" />
                                    <input placeholder="Enter your email" />
                                    <div>
                                        <Dialog.Close className="main-btn">Close</Dialog.Close>
                                    </div>
                                </div>
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