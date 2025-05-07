import React, { useEffect } from "react";
import "../styles/mainHeader.css";
//import { Redirect } from "wouter";
import { Sidebar } from 'primereact/sidebar';
import { useState } from 'react';
import { Menu } from '@base-ui-components/react/menu';
import axios from 'axios';
import Identicon from "identicon.js";


function Chat({id}) {
  const postMessage = (e) => {
    e.preventDefault();
    const message = e.target[0].value;
    e.target[0].value = "";
    axios.post(process.env.REACT_APP_SERVER+'/api/projects/'+id+'/messages', {text: message}, {headers: {"user-id": sessionStorage.getItem('userId')}})
      .then((res) => {
        if (res.status != 200) return;
        setMessages([{type: "message", userId: sessionStorage.getItem('userId'), sender: sessionStorage.getItem('username'), text: message}, ...messages]);
      })
  }
  
  const [messages, setMessages] = useState([])
  
  useEffect(() => {
    axios.get(process.env.REACT_APP_SERVER+'/api/projects/'+id+'/messages', {headers: {"user-id": sessionStorage.getItem('userId')}}).then((res) => {
      setMessages(res.data.messages);
    })
  }, [])
  
  const [authorImages, setAuthorImages] = useState(messages.map(()=>0))
  
  useEffect(() => {
    //https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
    const promises = messages.map((message) => window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(message.username))
                          .then((hashBuffer) => {
                            const hashArray = Array.from(new Uint8Array(hashBuffer))

                            // convert bytes to hex string                  
                            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
                            return new Identicon(hashHex.padStart(15, ' '), {'background': [hashArray[0], hashArray[1], hashArray[2], 100]})
                          }))
    Promise.all(promises).then((hashes) => {
      setAuthorImages(hashes)
    })
  }, [messages])

  const chat = messages.map((message) => {
    const imgHash = new Identicon(message.userId.toString().padStart(15, '0')).toString();
    if (message['comment_value']) {
      return (
        <div className="sidebar-message">
          <img className="sidebar-message-sender" alt={message.username} src={"data:image/png;base64," + authorImages[messages.indexOf(message)]}/>
          <div className="chat-comment">
            <div className="comment-header">
              <span className="comment-key">Ha comentado en <b>{message.name}</b> de <b>{message.value}</b> </span>
              <span className="sidebar-message-value">{message.comment_value}</span>
            </div>
            <div className="chat-text">{message.text}</div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="sidebar-message">
          <img className="sidebar-message-sender" alt={message.username} src={"data:image/png;base64," + authorImages[messages.indexOf(message)]}/>
          <div className="chat-text">{message.text}</div>
        </div>
      )
    }
  })

  return(
  <div className="sidebar">
    <div className="sidebar-list">
      {chat}
    </div>
    <form className="chat-form" onSubmit={postMessage}>
      <input type="text" className="chat-input" placeholder="Escribe un mensaje..."></input>
    </form>
  </div>);
}

function signOut() {
  sessionStorage.removeItem('userId')
  sessionStorage.removeItem('username')
  sessionStorage.removeItem('lastNotification')
  window.location.href = "/login"
}

function Profile({userId, username}) {

  const [picture, setPicture] = useState(0)
  window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(username))
        .then((hashBuffer) => {
          const hashArray = Array.from(new Uint8Array(hashBuffer));

          // convert bytes to hex string                  
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          setPicture(new Identicon(hashHex.padStart(15, ' '), {'background': [hashArray[0], hashArray[1], hashArray[2], 255]}))
        })

  return (
    <Menu.Root>
      <Menu.Trigger className="header-btn">
        <img src={"data:image/png;base64," + picture} alt="profile" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className="dropdown-menu" sideOffset={8}>
          <Menu.Popup className="dropdown-options">
            <a href={"/profile/"+userId}><Menu.Item className="dropdown-option">Perfil</Menu.Item></a>
            {/*<a href={"/settings"}><Menu.Item className="profile-option">Ajustes</Menu.Item></a>*/}
            <Menu.Item className="dropdown-option" onClick={signOut}>Cerrar Sesión</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function updateLastNotification(id, messages, setLastNotification){
  if (!sessionStorage.getItem('lastNotification')){
    setLastNotification(0)
    sessionStorage.setItem('lastNotification', 0)
  }
  if (id && sessionStorage.getItem('lastNotification') < messages[0].id){
    axios.put(process.env.REACT_APP_SERVER+'/api/users/'+sessionStorage.getItem('userId')+'/notifications', 
    {[id]: messages[0].id}, {headers: {"user-id": sessionStorage.getItem('userId')}}).then((res) => {
      if (res.status == 200) {
        setLastNotification(messages[0].id);
        sessionStorage.setItem('lastNotification', messages[0].id);
      }
    })
  }
}

function Notifications({id, messages}) {

  const [authorImages, setAuthorImages] = useState(messages.map(()=>0))

  useEffect(() => {
    //https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
    const promises = messages.map((message) => window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(message.username))
                          .then((hashBuffer) => {
                            const hashArray = Array.from(new Uint8Array(hashBuffer))

                            // convert bytes to hex string                  
                            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
                            return new Identicon(hashHex.padStart(15, ' '), {'background': [hashArray[0], hashArray[1], hashArray[2], 100]})
                          }))
    Promise.all(promises).then((hashes) => {
      setAuthorImages(hashes)
    })
  }, [messages])

  const notifications = messages.map((message) => {
    if (message.comment_cell) {
      return (
        <div className="sidebar-message">
          <img className="sidebar-message-sender" alt={message.username} src={"data:image/png;base64," + authorImages[messages.indexOf(message)]}/>
          <div className="notifications-comment">
            <div className="comment-header">
              <span className="comment-key">Ha comentado en <b>{message.comment.name}</b> de <b>{message.comment.value}</b> </span>
              <span className="sidebar-message-value">{message.comment_value}</span>
            </div>
            <div className="notifications-text">{message.text}</div>
          </div>
        </div>
      )
    } else if (message.new_value) {
      const imgHash = new Identicon(message.change_author.toString().padStart(15, '0')).toString();
      return (
        <div className="sidebar-message">
          <img className="sidebar-message-sender" alt={message.change_author} src={"data:image/png;base64," + authorImages[messages.indexOf(message)]}/>
          <div className="change-header">
            <span className="change-key">Ha modificado en <b>{message.name}</b> de <b>{message.value}</b> </span>
            <div className="change-body">
              <span className="sidebar-message-value">{message.old_value}</span>
              <span className="change-key"> a </span>
              <span className="sidebar-message-value">{message.new_value}</span>
            </div>
          </div>
        </div>
      )
    }
  })

  return(
  <div className="sidebar sidebar-list">
    {notifications}
  </div>);
}

function NotificationsBtn({alert, onClick}) {
  if (alert===0) return (
  <div className="header-notifications">
    <button className="header-btn">
      <img src="/icons/notifications.svg" alt="notifications" onClick={onClick} />
    </button>
  </div>)
  return (
  <div className="header-notifications">
    <button className="header-btn">
      <img src="/icons/notifications.svg" alt="notifications" onClick={onClick} />
      <div className="alert">
        {alert}
      </div>
    </button>
  </div>)
}

async function getProjectName(id) {
  if (id){
    if (!sessionStorage.getItem('projectId') || sessionStorage.getItem('projectId')!= id){
      sessionStorage.setItem('projectId', id);
      await axios.get(process.env.REACT_APP_SERVER+'/api/projects/'+id, {headers: {'user-id': sessionStorage.getItem('userId')}}).then((res) => {
        sessionStorage.setItem('projectName', res.data.project.name);
      });
    }
    return sessionStorage.getItem('projectName');
  }
}

const ProjectHeader = ({id, current, isAdmin, params}) => {
  const [visibleChat, setVisibleChat] = useState(false)
  const [visibleNotifications, setVisibleNotifications] = useState(false)
  
  const userId = sessionStorage.getItem('userId');
  const username = sessionStorage.getItem('username');
  
  const [projectName, setProjectName] = useState(null)
  useEffect(() => {
    getProjectName(id).then((name) => {
      setProjectName(name);
    });
  }, [])

  const [admin, setAdmin] = useState(isAdmin)

  useEffect(() => {
    if (sessionStorage.getItem('projectId')){
      axios.get(process.env.REACT_APP_SERVER+'/api/users/'+sessionStorage.getItem('userId')+'/roles', {headers: {'user-id': sessionStorage.getItem('userId')}}).then((res) => {
        setAdmin(res.data.roles.find((role) => role.project_id == sessionStorage.getItem('projectId')).name === 'admin')
        setLastNotification(res.data.roles.find((role) => role.project_id == sessionStorage.getItem('projectId')).last_notification)
      })
    } else {
      setAdmin(false)
    }
  }, [])

  const [notifications, setNotifications] = useState([])

  const [lastNotification, setLastNotification] = useState(sessionStorage.getItem('lastNotification'))
  const newNotifications = notifications.filter((notification) => notification.id > lastNotification).length

  useEffect(() => {
    if (id){
      axios.get(process.env.REACT_APP_SERVER+'/api/projects/'+id+'/notifications', {headers: {'user-id': sessionStorage.getItem('userId')}}).then((res) => {
        setNotifications(res.data.notifications)
      })
    } else {
      axios.get(process.env.REACT_APP_SERVER+'/api/users/'+sessionStorage.getItem('userId')+'/notifications', {headers: {'user-id': sessionStorage.getItem('userId')}}).then((res) => {
        setNotifications(res.data.notifications)
      })
    }
}, [])

  
  if (!id) {
    return (
      <header className="header">
        <a className="header-menu" href="/projects">
          <img src="/icons/menu.svg" alt="Menu" />
        </a>
        <div>
          <NotificationsBtn alert={0} onClick={() => {setVisibleNotifications(!visibleNotifications); updateLastNotification(id, notifications, setLastNotification)}}/>
          <Profile userId={userId} username={username} current={current}/>
        </div>
        <Sidebar visible={visibleNotifications} position="right" onHide={() => setVisibleNotifications(false)}
          content={()=>(
            <Notifications id={id} messages={notifications}/>)}/>
      </header>
    )
  }

  return (
    <header className="header">
      <div>
        <a className="header-menu" href="/projects" onClick={()=>{sessionStorage.removeItem('projectId'); sessionStorage.removeItem('projectName'); sessionStorage.removeItem('lastNotification')}}>
          <img src="/icons/menu.svg" alt="menu" />
        </a>
        <h2 className="project-name">{projectName}</h2>
      </div>
      <div className="project-sections">
        <a className="header-home" href={"/project/"+id}>
          <img src="/icons/home.svg" alt="home" />
        </a>
        <a className="header-calendar" href={current==="calendar" ? "javascript:void(0)" : "/project/"+id+"/calendar"}>
          <img src="/icons/calendar.svg" alt="calendar" />
        </a>
        {admin? <a className="header-users" href={current==="users" ? "javascript:void(0)" : "/project/"+id+"/users"}>
          <img src="/icons/users.svg" alt="users" />
        </a> : null}
        <button className="header-btn header-chat">
          <img src="/icons/chat.svg" alt="chat" onClick={() => setVisibleChat(!visibleChat)} />
        </button>
      </div>
      <div>
        <NotificationsBtn alert={newNotifications} onClick={() => {setVisibleNotifications(!visibleNotifications); updateLastNotification(id, notifications, setLastNotification)}}/>
        <Profile userId={userId} username={username} current={current}/>
      </div>
      <Sidebar visible={visibleChat} position="right" onHide={() => setVisibleChat(false)}
        content={()=>(
        <Chat id={id}/>)}/>
      <Sidebar visible={visibleNotifications} position="right" onHide={() => setVisibleNotifications(false)}
        content={()=>(
        <Notifications id={id} messages={notifications}/>)}/>
    </header>
  )
}

export default ProjectHeader