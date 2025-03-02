import React, { useEffect, useState } from "react";
import ProjectHeader from "../components/mainHeader";
import { Dialog } from '@base-ui-components/react/dialog';
import {IconButton} from "../components/buttons";
import "../styles/roles.css";

const RoleDialog = ({roles, setRoles, columns, setAccesses}) => {

    function addRole(e) {
        const newRole = document.getElementById("new-role").value
        if (newRole === "")
            return
        const newRoles = [...roles, newRole]
        setRoles(newRoles)
        setAccesses(newRoles.map(() => columns.map(() => 0)))
    }

    return (
        <div className="popup-main">
            <h3>Crea un nuevo rol</h3>
            <div className="add-role">
                <input placeholder="Nombre" id="new-role" />
                <Dialog.Close className="main-btn" onClick={addRole}>Añadir</Dialog.Close>
            </div>
        </div>
    )
}

function updateAccess(accesses, setAccesses, i, j) {
    const newAccesses = [...accesses]
    newAccesses[i][j] = (accesses[i][j]+1)%3
    setAccesses(newAccesses)
}

const AccessList = ({columns, globalAccess, i}) => {
    const [accesses, setAccesses] = globalAccess
    
    var accessElems = [];
    for (let j in columns){

        const access = accesses[i][j]
        let btnSrc = ""
        if (access === 0)
            btnSrc = "/icons/hidden.svg"
        else if (access === 1)
            btnSrc = "/icons/visible.svg"
        else
            btnSrc = "/icons/edit.svg"

        accessElems.push(
            <div className="access" id={columns[i]}>
                <span>{columns[j]}</span>
                <button className="access-btn" onClick={()=>{updateAccess(accesses, setAccesses, i, j)}}>
                    <img src={btnSrc}/>
                </button>
            </div>
        )
    }

    return (
        <div className="access-list">
            {accessElems}
        </div>
    )
}

const RolesList = ({roles, accesses, setAccesses, columns}) => {

    var roleElems = [];
    for (let i in roles){
        roleElems.push(
            <div className="role" id={roles[i]}>
                <h3>{roles[i]}</h3>
                <hr/>
                <AccessList columns={columns} globalAccess={[accesses, setAccesses]} i={i}/>
            </div>
        )
    }

    return (
        <div className="roles-list">
            {roleElems}
        </div>
    )
}

const Roles = ({params}) => {
    const defaultRoles = ["Transportista", "Administrador", "Supervisor", "Operario"];
    const [roles, setRoles] = useState(defaultRoles);
    const columns = ["Nombre", "Artista", "Peso", "Luz", "Humedad", "Noenqué", "Noencuántos"];
    const defaultAccesses = roles.map(() => columns.map(() => 0));
    const [accesses, setAccesses] = useState(defaultAccesses);

    return (
        <div className="users-main">
            <ProjectHeader id={params.id} current="users"/>
            <main>
                <RolesList roles={roles} accesses={accesses} setAccesses={setAccesses} columns={columns}/>
                <div className="buttons">
                    <Dialog.Root>
                        <Dialog.Trigger className="dialog-btn">
                            <IconButton id="user-add-btn" disabled src="/icons/user-add.svg"/>
                        </Dialog.Trigger>
                        <Dialog.Portal keepMounted>
                            <Dialog.Backdrop className="dialog-background" />
                            <Dialog.Popup className="dialog-main">
                                <RoleDialog roles={roles} setRoles={setRoles} columns={columns} setAccesses={setAccesses}/>
                            </Dialog.Popup>
                        </Dialog.Portal>
                    </Dialog.Root>
                    <a href={"/project/"+params.id+"/users"}>
                        <IconButton id="roles-btn" src="/icons/list.svg"/>
                    </a>
                </div>
            </main>
        </div>
    );
};

export default Roles;