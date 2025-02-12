import React from "react";
import "../styles/calendar.css"
import ProjectHeader from "../components/mainHeader";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';

const Calendar = ({params}) => {
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
            <FullCalendar plugins={[ dayGridPlugin ]} events={events} initialView="dayGridMonth" firstDay={1} height="50vh" />
        </main>
    </div>
    );
};

export default Calendar