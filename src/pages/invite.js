import React, { useEffect, useState } from "react";
import axios from 'axios'
import '../styles/invite.css'

const Invite = ({params}) => {
  
  async function join(e){
    await axios.put('http://localhost:8080/api/projects/'+params.pId,
      {projectId: params.pId, roleId: params.rId}, {headers: {'user-id': sessionStorage.getItem('userId')}})
      window.location.href = '/projects'
    }

  if (!sessionStorage.getItem('userId')) {
    window.location.href = '/login'
  }

  const [projectName, setProjectName] = useState(params.pId)
  useEffect(() => {
    axios.get('http://localhost:8080/api/projects/'+params.pId, 
      {headers: {'user-id': sessionStorage.getItem('userId')}})
      .then((res) => {
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