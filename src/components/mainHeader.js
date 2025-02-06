import React from "react";
import "../styles/mainHeader.css";
import { Redirect } from "wouter";
import { Sidebar } from 'primereact/sidebar';
import { useState } from 'react';
        

const Notifications = ({alert}) => {
  if (alert==0) return (
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

const ProjectHeader = ({id, current, params}) => {
  let [visibleChat, setVisibleChat] = useState(false);

  if (!id) {
    return (
      <header className="header">
        <a className="header-menu" href="/projects">
          <img src="/icons/menu.svg" alt="Menu" />
        </a>
        <div>
          <Notifications alert={1}/>
          <div className="header_user">
            <img src="/icons/user-circle.svg" alt="user" />
          </div>
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
        <a className="header-calendar" href={current=="calendar" ? "javascript:void(0)" : "/project/"+id+"/calendar"}>
          <img src="/icons/calendar.svg" alt="calendar" />
        </a>
        <a className="header-users" href={current=="users" ? "javascript:void(0)" : "/project/"+id+"/users"}>
          <img src="/icons/users.svg" alt="users" />
        </a>
        <button className="header-btn">
          <img src="/icons/chat.svg" alt="chat" onClick={() => setVisibleChat(!visibleChat)} />
        </button>
      </div>
      <div>
        <Notifications alert={5}/>
        <a className="header-user" href={current=="profile" ? "javascript:void(0)" : "/project/"+id+"/profile"}>
          <img src="/icons/user-circle.svg" alt="profile" />
        </a>
      </div>
      <Sidebar visible={visibleChat} position="right" onHide={() => setVisibleChat(false)}
        content={()=>(
        <div className="chat">
          <h2>Right Sidebar</h2>
          <h3>{id}</h3>
          <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>)}/>
    </header>
  );
};

export default ProjectHeader