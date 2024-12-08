import React from "react";
import "../styles/mainHeader.css";
import { Redirect } from "wouter";

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
        <a className="header-calendar" href={"/project/"+id+"/calendar"}>
          <img src="/icons/calendar.svg" alt="calendar" />
        </a>
        <a className="header-users" href={"/project/"+id+"/users"}>
          <img src="/icons/users.svg" alt="users" />
        </a>
        <button className="header-btn">
          <img src="/icons/chat.svg" alt="chat" />
        </button>
      </div>
      <div>
        <Notifications alert={5}/>
        <div className="header-user">
          <img src="/icons/user-circle.svg" alt="user" />
        </div>
      </div>
    </header>
  );
};

export default ProjectHeader