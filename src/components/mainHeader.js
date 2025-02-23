import React from "react";
import "../styles/mainHeader.css";
//import { Redirect } from "wouter";
import { Sidebar } from 'primereact/sidebar';
import { useState } from 'react';
import { Menu } from '@base-ui-components/react/menu';


function Chat({id}) {
  const messages = [{type: "comment", sender: "U1", column: "Luz", row: "Estatua 2", value: "290", message: "Yo opino que opinar es necesario porque tengo inteligencia y por eso siempre opino."},
                    {type: "message", sender: "U2", message: "Ok, nos vemos luego."}, 
                    {type: "message", sender: "U1", message: "Nada, solo quedarme en casa."}, 
                    {type: "message", sender: "U2", message: "¿Qué planes tienes para hoy?"}, 
                    {type: "message", sender: "U1", message: "Bien también."}, 
                    {type: "message", sender: "U2", message: "Bien, y tú?"}, 
                    {type: "message", sender: "U1", message: "Hola, ¿cómo estás?"}]

  const chat = messages.map((message) => {
    if (message.type==="comment") {
      return (
        <div className="chat-message">
          <div className="chat-sender" alt={message.sender}>{message.sender}</div>
          <div className="chat-comment">
            <div className="chat-comment-header">
              <span className="chat-comment-key">Ha comentado en <b>{message.column}</b> de <b>{message.row}</b> </span>
              <span className="chat-comment-value">{message.value}</span>
            </div>
            <div className="chat-text">{message.message}</div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="chat-message">
          <div className="chat-sender" alt={message.sender}>{message.sender}</div>
          <div className="chat-text">{message.message}</div>
        </div>
      )
    }
  })

  return(
  <div className="chat">
    {chat}
  </div>);
}

const signOut= () => {
  sessionStorage.removeItem('userId');
  window.location.href = "/login";
}

function Profile({userId}) {
  return (
    <Menu.Root>
      <Menu.Trigger className="header-btn">
        <img src="/icons/user-circle.svg" alt="profile" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className="profile-menu" sideOffset={8}>
          <Menu.Popup className="profile-options">
            <a href={"/profile/"+userId}><Menu.Item className="profile-option">Perfil</Menu.Item></a>
            <a href={"/settings"}><Menu.Item className="profile-option">Ajustes</Menu.Item></a>
            <Menu.Item className="profile-option" onClick={signOut}>Cerrar Sesión</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

const Notifications = ({alert}) => {
  if (alert===0) return (
  <div className="header-notifications">
    <button className="header-btn">
      <img src="/icons/notifications.svg" alt="notifications" />
    </button>
  </div>)
  return (
  <div className="header-notifications">
    <button className="header-btn">
      <img src="/icons/notifications.svg" alt="notifications" />
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

const ProjectHeader = ({id, current, params}) => {
  let [visibleChat, setVisibleChat] = useState(false);
  let userId = getUserId();

  if (!id) {
    return (
      <header className="header">
        <a className="header-menu" href="/projects">
          <img src="/icons/menu.svg" alt="Menu" />
        </a>
        <div>
          <Notifications alert={1}/>
          <Profile userId={userId} current={current}/>
        </div>
      </header>
    );
  }
  return (
    <header className="header">
      <div>
        <a className="header-menu" href="/projects">
          <img src="/icons/menu.svg" alt="menu" />
        </a>
        <h2 className="project-name">{id}</h2>
      </div>
      <div className="project-sections">
        <a className="header-home" href={"/project/"+id}>
          <img src="/icons/home.svg" alt="home" />
        </a>
        <a className="header-calendar" href={current==="calendar" ? "javascript:void(0)" : "/project/"+id+"/calendar"}>
          <img src="/icons/calendar.svg" alt="calendar" />
        </a>
        <a className="header-users" href={current==="users" ? "javascript:void(0)" : "/project/"+id+"/users"}>
          <img src="/icons/users.svg" alt="users" />
        </a>
        <button className="header-btn header-chat">
          <img src="/icons/chat.svg" alt="chat" onClick={() => setVisibleChat(!visibleChat)} />
        </button>
      </div>
      <div>
        <Notifications alert={5}/>
        <Profile userId={userId} current={current}/>
      </div>
      <Sidebar visible={visibleChat} position="right" onHide={() => setVisibleChat(false)}
        content={()=>(
        <Chat id={id}/>)}/>
    </header>
  );
};

export default ProjectHeader