import React, { useEffect, useState } from "react";
import axios from 'axios'
import '../styles/invite.css'

const Invite = ({params}) => {
  
  async function join(e){
    await axios.put(process.env.REACT_APP_SERVER+'/api/projects',
      {projectId: params.pId, roleId: params.rId}, {headers: {'user-id': sessionStorage.getItem('userId')}}).then((res) => {
        if (res.status === 200){
          sessionStorage.setItem('projectId', params.pId)
          window.location.href = '/projects'
        }
      })
    }

  if (!sessionStorage.getItem('userId')) {
    window.location.href = '/login'
  }

  const [projectName, setProjectName] = useState(params.pId)
  useEffect(() => {
    axios.get(process.env.REACT_APP_SERVER+'/api/projects/'+params.pId, 
      {headers: {'user-id': sessionStorage.getItem('userId')}})
      .then((res) => {
        console.log(res.data)
        setProjectName(res.data.project.name)
      })
  }, [])

  return (
    <main className="invite-main">
      <div>
        <h2>Te han invitado a {projectName}</h2>
        <button className="main-btn" onClick={join}>Unirse</button>
      </div>
    </main>
)}

export default Invite