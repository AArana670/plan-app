import React from "react";
import "../styles/calendar.css"
import ProjectHeader from "../components/mainHeader";

const Calendar = ({params}) => {
    return (
    <div>
        <ProjectHeader id={params.id} current="calendar"/>
        <main className="calendar">
            <h1>Calendar</h1>
        </main>
    </div>
    );
};

export default Calendar