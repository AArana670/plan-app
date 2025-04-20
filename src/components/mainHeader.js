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
    axios.post('http://localhost:8080/api/projects/'+id+'/messages', {text: message}, {headers: {"user-id": sessionStorage.getItem('userId')}})
      .then((res) => {
        if (res.status != 200) return;
        setMessages([{type: "message", sender: sessionStorage.getItem('username'), text: message}, ...messages]);
      })
  }
  
  const [messages, setMessages] = useState([])
  
  useEffect(() => {
    axios.get('http://localhost:8080/api/projects/'+id+'/messages', {headers: {"user-id": sessionStorage.getItem('userId')}}).then((res) => {
      setMessages(res.data.messages);
    })
  }, [])
  
  const chat = messages.map((message) => {
    if (message['comment_value']) {
      return (
        <div className="sidebar-message">
          <div className="sidebar-message-sender" alt={message.username}>{message.username}</div>
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
          <div className="sidebar-message-sender" alt={message.username}>{message.username}</div>
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

const signOut= () => {
  sessionStorage.removeItem('userId');
  window.location.href = "/login";
}

function Profile({userId}) {
  const imgHash = new Identicon(userId.toString().padStart(15, '0')).toString();

  return (
    <Menu.Root>
      <Menu.Trigger className="header-btn">
        <img src={"data:image/png;base64," + imgHash} alt="profile" />
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

function Notifications({id, messages}) {

  const notifications = messages.map((message) => {
    if (message.type==="comment") {
      return (
        <div className="sidebar-message">
          <div className="sidebar-message-sender" alt={message.sender}>{message.sender}</div>
          <div className="notifications-comment">
            <div className="comment-header">
              <span className="comment-key">Ha comentado en <b>{message.column}</b> de <b>{message.row}</b> </span>
              <span className="sidebar-message-value">{message.value}</span>
            </div>
            <div className="notifications-text">{message.message}</div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="sidebar-message">
          <span className="sidebar-message-sender" alt={message.sender}>{message.sender}</span>
          <div className="change-header">
            <span className="change-key">Ha modificado en <b>{message.column}</b> de <b>{message.row}</b> </span>
            <div className="change-body">
              <span className="sidebar-message-value">{message.oldValue}</span>
              <span className="change-key"> a </span>
              <span className="sidebar-message-value">{message.newValue}</span>
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

function getUserId() {
  const userId = sessionStorage.getItem('userId');
  return userId;
}

async function getProjectName(id) {
  if (id){
    if (!sessionStorage.getItem('projectId') || sessionStorage.getItem('projectId')!= id){
      sessionStorage.setItem('projectId', id);
      await axios.get('http://localhost:8080/api/projects/'+id, {headers: {'user-id': sessionStorage.getItem('userId')}}).then((res) => {
        sessionStorage.setItem('projectName', res.data.project.name);
      });
    }
    return sessionStorage.getItem('projectName');
  }
}

const ProjectHeader = ({id, current, isAdmin=false, params}) => {
  const [visibleChat, setVisibleChat] = useState(false)
  const [visibleNotifications, setVisibleNotifications] = useState(false)
  const userId = getUserId()
  
  const [projectName, setProjectName] = useState(null)
  useEffect(() => {
    getProjectName(id).then((name) => {
      setProjectName(name);
    });
  }, [])

  const messages = [{type: "comment", sender: "U1", column: "Luz", row: "Estatua 2", value: "290", message: "Yo opino que opinar es necesario porque tengo inteligencia y por eso siempre opino."},
    {type: "change", sender: "U2", column: "Luz", row: "Estatua 2", oldValue: "290", newValue: "320"}]
  
  if (!id) {
    return (
      <header className="header">
        <a className="header-menu" href="/projects">
          <img src="/icons/menu.svg" alt="Menu" />
        </a>
        <div>
          <NotificationsBtn alert={1} onClick={() => setVisibleNotifications(!visibleNotifications)}/>
          <Profile userId={userId} current={current}/>
        </div>
        <Sidebar visible={visibleNotifications} position="right" onHide={() => setVisibleNotifications(false)}
          content={()=>(
            <Notifications id={id} messages={messages}/>)}/>
      </header>
    )
  }

  return (
    <header className="header">
      <div>
        <a className="header-menu" href="/projects" onClick={()=>{sessionStorage.removeItem('projectId'); sessionStorage.removeItem('projectName')}}>
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
        {isAdmin? <a className="header-users" href={current==="users" ? "javascript:void(0)" : "/project/"+id+"/users"}>
          <img src="/icons/users.svg" alt="users" />
        </a> : null}
        <button className="header-btn header-chat">
          <img src="/icons/chat.svg" alt="chat" onClick={() => setVisibleChat(!visibleChat)} />
        </button>
      </div>
      <div>
        <NotificationsBtn alert={5} onClick={() => setVisibleNotifications(!visibleNotifications)}/>
        <Profile userId={userId} current={current}/>
      </div>
      <Sidebar visible={visibleChat} position="right" onHide={() => setVisibleChat(false)}
        content={()=>(
        <Chat id={id}/>)}/>
      <Sidebar visible={visibleNotifications} position="right" onHide={() => setVisibleNotifications(false)}
        content={()=>(
        <Notifications id={id} messages={messages}/>)}/>
    </header>
  )
}

export default ProjectHeader