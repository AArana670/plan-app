import React from "react";
import "../styles/calendar.css"
import ProjectHeader from "../components/mainHeader";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

const Calendar = ({params}) => {
    return (
    <div>
        <ProjectHeader id={params.id} current="calendar"/>
        <main className="calendar">
            <FullCalendar plugins={[ dayGridPlugin ]} initialView="dayGridMonth" />
        </main>
    </div>
    );
};

export default Calendar