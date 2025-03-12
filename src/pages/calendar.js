import React from "react";
import "../styles/calendar.css"
import ProjectHeader from "../components/mainHeader";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import listPlugin from '@fullcalendar/list';
import { Dialog } from 'primereact/dialog';
import esLocale from '@fullcalendar/core/locales/es';
import * as events from 'events';

function addEvent(e, date) {
    e.preventDefault()
    const form = e.target
    const title = form[0].value
    const tag = form[1].value
    const start = form[2].value
    const end = form[3].value
    const description = form[4].value
    const event = {title: title, date: date, tag: tag, start: start, end: end, description: description}
}

const NewEventDialog = ({selectedDate, visible, setVisible}) => {
    const columns = ["Nombre", "Artista", "Peso", "Luz", "Humedad", "Noenqué", "Noencuántos"]

    return (
        <Dialog visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
        content={({ hide }) => (
            <div className="dialog-body">
                <h3>{selectedDate}</h3>
                <form className="new-event" onSubmit={(e) => {addEvent(e, selectedDate)}}>
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
                    <button type="submit" className="main-btn" onClick={hide}>Crear</button>
                </form>
            </div>
        )}>
        </Dialog>
    )
}

const DateEventsDialog = ({visible, setVisible, selectedDate, dateEvents, newVisible, setNewVisible}) => {
    return (
        <Dialog visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
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
                <button className="main-btn" onClick={(e)=>{setNewVisible(!newVisible); hide(e);}}>Nuevo evento</button>
            </div>
        )}>
        </Dialog>
    )
}

const Calendar = ({params}) => {

    const [selectedDate, setSelectedDate] = React.useState(null);
    const [newEventVisible, setNewEventVisible] = React.useState(false);
    const [dateEventsVisible, setDateEventsVisible] = React.useState(false);
    const [dateEvents, setDateEvents] = React.useState([]);
    
    function openDate (info, events, setSelectedDate){
        const selectedEvents = events.filter((event) => event.date === info.dateStr);
        
        if (selectedEvents.length > 0){
            setDateEvents(selectedEvents);
            setDateEventsVisible(!dateEventsVisible);
        } else
            setNewEventVisible(!newEventVisible);

        setSelectedDate(info.dateStr);
    }

    //datos de ejemplo
    const events = [
        { title: 'event 1', date: '2025-03-01' },
        { title: 'event 2', date: '2025-03-02' },
        { title: 'event 3', date: '2025-03-02' },
        { title: 'event 4', date: '2025-03-02' }
    ]

    return (
    <div>
        <ProjectHeader id={params.id} current="calendar"/>
        <main className="calendar-main">
            <FullCalendar plugins={[ listPlugin, interactionPlugin ]} events={events} initialView="listWeek" firstDay={1} height="30vh" locale={esLocale} dateClick={(info)=>{openDate(info, events, setSelectedDate, newEventVisible, setNewEventVisible)}}/>
            <br/>
            <FullCalendar plugins={[ dayGridPlugin, interactionPlugin ]} events={events} initialView="dayGridMonth" firstDay={1} height="50vh" locale={esLocale} dateClick={(info)=>{openDate(info, events, setSelectedDate, newEventVisible, setNewEventVisible)}} />
            <NewEventDialog selectedDate={selectedDate} dateEvents={dateEvents} visible={newEventVisible} setVisible={setNewEventVisible}/>
            <DateEventsDialog selectedDate={selectedDate} visible={dateEventsVisible} setVisible={setDateEventsVisible} newVisible={newEventVisible} setNewVisible={setNewEventVisible} dateEvents={dateEvents}/>
        </main>
    </div>
    );
};

export default Calendar