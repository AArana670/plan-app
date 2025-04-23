import React, { useEffect, useState } from "react";
import axios from 'axios'

const Invite = ({params}) => {
if (!sessionStorage.getItem('userId')) {
  window.location.href = '/login'
} else {
  axios.put('http://localhost:8080/api/projects',
    {projectId: params.pId, roleId: params.rId}, {headers: {'user-id': sessionStorage.getItem('userId')}})
  .then((res) => {
    window.location.href = '/projects'
  })
}

return (
  <div>
    <h1>Te han invitado a {params.id}</h1>
  </div>
)}

export default Invite