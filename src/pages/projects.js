import React from "react";
import Header from "../components/mainHeader";
import {MainButton} from "../components/buttons";
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import listPlugin from '@fullcalendar/list';
import { Dialog as TriggerableDialog } from 'primereact/dialog';
import esLocale from '@fullcalendar/core/locales/es';
import TaskList from "../components/taskList";
import { Dialog } from '@base-ui-components/react/dialog';
import { Menu } from '@base-ui-components/react/menu';
import "../styles/projects.css";


const DateEventsDialog = ({visible, setVisible, selectedDate, dateEvents}) => {
    return (
        <TriggerableDialog visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
        content={({ hide }) => (
            <div className="dialog-body">
                <h3>{selectedDate}</h3>
                <div className="event-list" onSubmit={()=>{return false}}>
                    {dateEvents.map((event) => 
                        <div className="event">
                            <div className="event-maindata">
                                <h4 className="event-title">{event.title}</h4>
                                <span className="event-time">{"09:00"}</span>
                                <span> - </span>
                                <span className="event-time">{"11:00"}</span>
                            </div>
                            <p className="event-description">
                                {"awdosfksejwfoigj esjgvnsgndfogfj ewfpovjbgpfgeowfjv nfo ppovb vbn pofjkbgpfv  bnfefd bvfpokjb mnv pfjvn pobjvv bn ovpjdbn po dfn pojn pojn ponbpovjn pojnrgend fbkkfvo nbfdvpbo mnv òknfopb nm wefkjl mn eponwefpo mn v fn blpsfmnkdvl lpofmn"}
                            </p>
                        </div>
                    )}
                </div>
                <button className="main-btn" onClick={hide}>Ok</button>
            </div>
        )}>
        </TriggerableDialog>
    )
}

const NewProjectDialog = ({onSubmit}) => {
  return (
    <div className="popup-main">
        <h3>Crea un nuevo proyecto</h3>
        <form className="project-form">
            <div className="project-fields">
              <input type="text" id="name" placeholder="Nombre del proyecto" />
              <hr/>
              <textarea id="description" placeholder="descripción" />
            </div>
          <Dialog.Close className="main-btn" onClick={(e)=>{onSubmit(e.target.parentNode.name.value, e.target.parentNode.description.value)}}>Crear proyecto</Dialog.Close>
        </form>
      </div>
  )

}

const DeleteProjectDialog = ({selectedProject, onSubmit, visible, setVisible}) => {
  
  return (
  <TriggerableDialog visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
    content={({ hide }) => (
      <div className="popup-main">
        <div className="project-form">
          <h3>{"¿Estás seguro de que quieres eliminar " + selectedProject + "?"}</h3>
          <div className="delete-options">
            <button className="secondary-btn" onClick={hide}>Cancelar</button>
            <button className="main-btn" onClick={(e)=>{onSubmit(selectedProject); hide(e)}}>Eliminar proyecto</button>
          </div>
        </div>
      </div>
  )}>
  </TriggerableDialog>
  )
}

const RenameProjectDialog = ({selectedProject, onSubmit, visible, setVisible}) => {
  
  return (
  <TriggerableDialog visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
    content={({ hide }) => (
      <div className="popup-main">
          <h3>Renombrar proyecto</h3>
          <form className="project-form" onSubmit={(e)=>e.preventDefault()}>
            <input id="newName" type="text" placeholder={selectedProject} />
            <div className="dialog-buttons">
              <button className="secondary-btn" onClick={hide}>Cancelar</button>
              <button className="main-btn" onClick={(e)=>{onSubmit(selectedProject, e.target.parentNode.parentNode.newName.value); hide(e)}}>Confirmar</button>
            </div>
          </form>
      </div>
    )}>
    </TriggerableDialog>
  )
}


const CardList = ({cards, setSelectedProject, setDeleteVisible, setRenameVisible}) => {
  var cardElems = [];

  for (let i in cards) {
    cardElems.push(
      <a className="card" href={"/project/"+cards[i]}>
        <img src="https://picsum.photos/200" alt={cards[i]}/>
        <div className="card-overlay">
          <h2>{cards[i]}</h2>
          <Menu.Root>
            <Menu.Trigger className="project-menu-btn">
              <img src="/icons/more.svg" alt="profile" />
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner className="dropdown-menu" sideOffset={8}>
                <Menu.Popup className="dropdown-options">
                  <Menu.Item className="dropdown-option" onClick={(e)=>{setSelectedProject(cards[i]); setRenameVisible(true)}}>Renombrar</Menu.Item>
                  <Menu.Item className="dropdown-option" onClick={(e)=>{setSelectedProject(cards[i]); setDeleteVisible(true)}}>Eliminar</Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        </div>
      </a>
    );
  }

  return (
    <div className="cardlist">
      {cardElems}
    </div>
  );
};

const Projects = () => {
  const projectNames = ["Project A", "Project B", "Project C", "Project D", "Project E", "Project F", "Project G", "Project H"];
  const [projects, setProjects] = React.useState(projectNames);

  //datos de ejemplo
  const events = [
    { title: 'event 1', date: '2025-03-01' },
    { title: 'event 2', date: '2025-03-02' },
    { title: 'event 3', date: '2025-03-02' },
    { title: 'event 4', date: '2025-03-02' }
  ]

  const [selectedDate, setSelectedDate] = React.useState(null);
  const [dateEventsVisible, setDateEventsVisible] = React.useState(false);
  const [dateEvents, setDateEvents] = React.useState([]);
  
  function showEvent (info){
      const event = info.event
      
      setSelectedDate(event.startStr);
      setDateEvents([event])
      setDateEventsVisible(!dateEventsVisible);
  }

  function deleteProject(project) {
    setProjects(projects.filter((p) => p !== project));
  }
  const [deleteVisible, setDeleteVisible] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState(null);

  function renameProject(project, newName) {
    setProjects(projects.map((p) => p === project ? newName : p));
  }
  const [renameVisible, setRenameVisible] = React.useState(false);

  function addProject(name, description) {
    setProjects([...projects, name]);
    return false;
  }
  
  return (
    <div>
      <Header />
      <main className="projects-main">
        <Dialog.Root>
          <Dialog.Trigger className="dialog-btn">
            <MainButton id="new-project" text="Nuevo Proyecto"/>
          </Dialog.Trigger>
          <Dialog.Portal keepMounted>
            <Dialog.Backdrop className="dialog-background" />
            <Dialog.Popup className="dialog-main">
              <NewProjectDialog onSubmit={addProject}/>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
        <CardList cards={projects} setSelectedProject={setSelectedProject} setDeleteVisible={setDeleteVisible} setRenameVisible={setRenameVisible}/>
        <br/>
        <br/>
        <FullCalendar plugins={[ listPlugin, interactionPlugin ]} events={events} initialView="listWeek" firstDay={1} height="30vh" locale={esLocale} eventClick={showEvent}/>
        <DateEventsDialog selectedDate={selectedDate} visible={dateEventsVisible} setVisible={setDateEventsVisible} dateEvents={dateEvents}/>
        <RenameProjectDialog selectedProject={selectedProject} onSubmit={renameProject} visible={renameVisible} setVisible={setRenameVisible}/>
        <DeleteProjectDialog selectedProject={selectedProject} onSubmit={deleteProject} visible={deleteVisible} setVisible={setDeleteVisible}/>
      </main>
    </div>
  );
};

export default Projects