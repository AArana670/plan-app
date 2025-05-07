import React, { useEffect, useState } from "react";
import ProjectHeader from "../components/mainHeader";
import { Dialog } from '@base-ui-components/react/dialog';
import {IconButton} from "../components/buttons";
import "../styles/roles.css";
import axios from "axios";

const RoleDialog = ({roles, setRoles, id}) => {
    console.log(roles)

    function addRole(e) {
        const newRole = document.getElementById("new-role").value
        if (newRole === "")
            return
        axios.post(process.env.REACT_APP_SERVER+"/api/projects/"+id+"/roles", {
            name: newRole
        }).then((res) => {
            const roleId = res.data.roleId
            const newRoles = {...roles}
            newRoles[newRole] = {id: roleId, accesses: {}}
            for (let i in newRoles['admin'].accesses){
                newRoles[newRole].accesses[i]= {level: 0}
            }
            setRoles(newRoles)
        })
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

function updateAccess(roles, setRoles, r, j, projectId) {
    const newLevel = (roles[r].accesses[j].level+1)%3
    const body = {}
    body[roles[r].accesses[j].id] = newLevel
    axios.put(process.env.REACT_APP_SERVER+"/api/projects/"+projectId+"/roles/"+roles[r].id, {
        permissions: body
    }).then((res) => {
        if (res.status == 200){
            const newRoles = {...roles}
            newRoles[r].accesses[j].level = newLevel
            setRoles(newRoles)
        }
    })
    
}

const AccessList = ({roles, setRoles, r, projectId}) => {
    const role = roles[r]

    var accessElems = [];
    for (let j in role.accesses){

        const level = role.accesses[j].level
        let btnSrc = ""
        if (level === 0)
            btnSrc = "/icons/hidden.svg"
        else if (level === 1)
            btnSrc = "/icons/visible.svg"
        else
            btnSrc = "/icons/edit.svg"

        accessElems.push(
            <div className="access" id={j}>
                <span>{j}</span>
                <button className="access-btn" onClick={()=>{updateAccess(roles, setRoles, r, j, projectId)}}>
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

const RolesList = ({roles, setRoles, projectId}) => {

    var roleElems = [];
    for (let r in roles){
        roleElems.push(
            <div className="role" id={r}>
                <h3>{r}</h3>
                <hr/>
                <AccessList roles={roles} setRoles={setRoles} r={r}/>
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
    const [roles, setRoles] = useState({});
    useEffect(() => {
        axios.get(process.env.REACT_APP_SERVER+"/api/projects/"+params.id+"/roles", {headers: {"user-id":sessionStorage.userId}}).then(async (res) => {
            let firstRoles = {}
            for (let i in res.data.roles){
                const role = res.data.roles[i]
                firstRoles[role.name] = axios.get(process.env.REACT_APP_SERVER+"/api/projects/"+params.id+"/roles/"+role.id, {headers: {"user-id":sessionStorage.userId}}).then((res) => {
                    const accesses = {}
                    for (let i in res.data.permissions) {
                        const access = res.data.permissions[i]
                        accesses[access.name] = {id: access.attribute_id, level: access.level}
                    }
                    return [role.name, {id: role.id, accesses: accesses}]
                })
            }
            await Promise.all(Object.values(firstRoles)).then((newRoles) => {
                setRoles(Object.fromEntries(newRoles))
            })
        })
    }, [])

    return (
        <div className="users-main">
            <ProjectHeader id={params.id} current="users"/>
            <main>
                <RolesList roles={roles} setRoles={setRoles}/>
                <div className="buttons">
                    <Dialog.Root>
                        <Dialog.Trigger className="dialog-btn">
                            <IconButton id="user-add-btn" disabled src="/icons/user-add.svg"/>
                        </Dialog.Trigger>
                        <Dialog.Portal keepMounted>
                            <Dialog.Backdrop className="dialog-background" />
                            <Dialog.Popup className="dialog-main">
                                <RoleDialog roles={roles} setRoles={setRoles} id={params.id}/>
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