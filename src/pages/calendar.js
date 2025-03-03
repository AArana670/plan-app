import React from "react";
import "../styles/calendar.css"
import ProjectHeader from "../components/mainHeader";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import listPlugin from '@fullcalendar/list';
import { Dialog } from 'primereact/dialog';
import * as events from 'events';

const NewEventDialog = ({info, selectedDate, visible, setVisible}) => {
    const columns = ["Nombre", "Artista", "Peso", "Luz", "Humedad", "Noenqué", "Noencuántos"]

    return (
        <Dialog visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
        content={({ hide }) => (
            <div className="">
                <h3>{selectedDate}</h3>
                <form className="new-event" onSubmit={()=>{return false}}>
                    <div className="new-event-maindata">
                        <input placeholder="Título" />
                        <select id="tag">
                            {[<option selected></option>, ...columns.map((tag) => <option>{tag}</option>)]}
                        </select>
                        <input type="number" className="time-input" min={0} max={23} placeholder="00" />
                        <span>:</span>
                        <input type="number" className="time-input" min={0} max={59} placeholder="00" />
                        <span> - </span>
                        <input type="number" className="time-input" min={0} max={23} placeholder="00" />
                        <span>:</span>
                        <input type="number" className="time-input" min={0} max={59} placeholder="00" />
                    </div>
                    <textarea placeholder="Descripción" />
                    <button type="submit" className="main-btn" onClick={hide}>Fuera</button>
                </form>
            </div>
        )}>
        </Dialog>
    )
}

function openDate (info, events, setSelectedDate, newEventVisible, setNewEventVisible){
    const selectedEvents = events.filter((event) => event.date === info.dateStr);
    
    if (selectedEvents.length > 0)
        alert("Feature not implemented yet")
    else
        newEvent(info, setSelectedDate, newEventVisible, setNewEventVisible);

    setSelectedDate(info.dateStr);
}

function newEvent (info, setSelectedDate, newEventVisible, setNewEventVisible){
    setNewEventVisible(!newEventVisible);
    setSelectedDate(info.dateStr);
}

const Calendar = ({params}) => {

    const [selectedDate, setSelectedDate] = React.useState(null);
    const [newEventVisible, setNewEventVisible] = React.useState(false);

    //datos de ejemplo
    const events = [
        { title: 'event 1', date: '2025-03-01' },
        { title: 'event 2', date: '2025-03-02' }
    ]

    return (
    <div>
        <ProjectHeader id={params.id} current="calendar"/>
        <main className="calendar-main">
            <FullCalendar plugins={[ listPlugin ]} events={events} initialView="listWeek" firstDay={1} height="30vh" />
            <br/>
            <FullCalendar plugins={[ dayGridPlugin, interactionPlugin ]} events={events} initialView="dayGridMonth" firstDay={1} height="50vh" dateClick={(info)=>{openDate(info, events, setSelectedDate, newEventVisible, setNewEventVisible)}} />
            <NewEventDialog selectedDate={selectedDate} visible={newEventVisible} setVisible={setNewEventVisible}/>
        </main>
    </div>
    );
};

export default Calendar