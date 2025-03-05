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

const NewProjectDialog = () => {

  return (
      <div className="popup-main">
          <h3>Crea un nuevo proyecto</h3>
          <div className="project-form">
              <div className="project-fields">
                  <input type="text" placeholder="Nombre del proyecto" />
                  <hr/>
                  <textarea placeholder="descripción" />
              </div>
          </div>
          <Dialog.Close className="main-btn">Crear proyecto</Dialog.Close>
      </div>
  )

}

const CardList = ({cards}) => {
  var cardElems = [];

  for (let i in cards) {
    cardElems.push(
      <a className="card" href={"/project/"+cards[i]}>
        <img src="https://picsum.photos/200" alt={cards[i]}/>
        <h2>{cards[i]}</h2>
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
  const cards = ["Project A", "Project B", "Project C", "Project D", "Project E", "Project F", "Project G", "Project H"];
  const tasks = [{name: "Task A", description: "Albion Online es un MMORPG no lineal en el que escribes tu propia historia sin limitarte a seguir un camino prefijado."}, {name: "Task B", description: "Albion Online es un MMORPG no lineal en el que escribes tu propia historia sin limitarte a seguir un camino prefijado."}, {name: "Task C", description: "Albion Online es un MMORPG no lineal en el que escribes tu propia historia sin limitarte a seguir un camino prefijado."}, {name: "Task D", description: "Albion Online es un MMORPG no lineal en el que escribes tu propia historia sin limitarte a seguir un camino prefijado."}, {name: "Task E", description: "Albion Online es un MMORPG no lineal en el que escribes tu propia historia sin limitarte a seguir un camino prefijado."}];
  
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
              <NewProjectDialog/>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
        <CardList cards={cards}/>
        <br/>
        <br/>
        <FullCalendar plugins={[ listPlugin, interactionPlugin ]} events={events} initialView="listWeek" firstDay={1} height="30vh" locale={esLocale} eventClick={showEvent}/>
        <DateEventsDialog selectedDate={selectedDate} visible={dateEventsVisible} setVisible={setDateEventsVisible} dateEvents={dateEvents}/>
      </main>
    </div>
  );
};

export default Projects