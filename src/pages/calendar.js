import React, { useEffect, useState } from "react";
import "../styles/calendar.css"
import ProjectHeader from "../components/mainHeader";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import listPlugin from '@fullcalendar/list';
import { Dialog } from 'primereact/dialog';
import esLocale from '@fullcalendar/core/locales/es';
import axios from 'axios';
import { useSearch } from "wouter";

function addEvent(e, date) {
    e.preventDefault()
    const form = e.target.form
    console.log(form)
    const title = form[0].value
    const tag = form[1].value
    const start = form[2].value+':'+form[3].value
    const end = form[4].value+':'+form[5].value
    const description = form[6].value
    axios.post('http://localhost:8080/api/projects/'+ sessionStorage.getItem('projectId') +'/events', 
    {name: title, tag: tag, date: date, start: start, end: end, description: description},
    {headers: {'user-id': sessionStorage.getItem('userId')}}).then((res) => {
        if (res.status == 200){
            form.reset()
            const event = {title: title, date: date, tag: tag, start: start, end: end, description: description}
        }
    })
}

const NewEventDialog = ({selectedDate, visible, setVisible}) => {
    const [tags, setTags] = useState([])
    
    useEffect(()=>{axios.get('http://localhost:8080/api/projects/'+sessionStorage.getItem('projectId')+'/attributes', 
        {headers: {'user-id': sessionStorage.getItem('userId')}}).then((response) => {
        setTags(response.data.attributes)
    })}, [])

    return (
        <Dialog visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
        content={({ hide }) => (
            <div className="dialog-body">
                <h3>{selectedDate}</h3>
                <form className="new-event">
                    <div className="new-event-maindata">
                        <input placeholder="Título" />
                        <select id="tag">
                            {[<option selected></option>, ...tags.map((tag) => <option value={tag.id}>{tag.name}</option>)]}
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
                    <button type="submit" className="main-btn" onClick={(e) => {addEvent(e, selectedDate); hide(e)}}>Crear</button>
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
                                <span className="event-time">{event.start}</span>
                                <span> - </span>
                                <span className="event-time">{event.end}</span>
                            </div>
                            <p className="event-description">
                                {event.description}
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

    const [events, setEvents] = React.useState([]);
    React.useEffect(() => {
        axios.get('http://localhost:8080/api/projects/'+params.id+'/events', {headers: {"user-id":sessionStorage.userId}}).then((res) => {
        console.log(res)
        setEvents(res.data.events);
        })
    }, []);

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