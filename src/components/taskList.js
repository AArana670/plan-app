import React from "react";
import "../styles/taskList.css"

const TaskList = ({tasks}) => {
    var taskElems = [];

    for (let i in tasks) {
        taskElems.push(
        <div className="task">
            <h3>{tasks[i]["name"]}</h3>
            <p>{tasks[i]["description"]}</p>
        </div>
        );
    }
    return (
        <div className="tasklist">
        {taskElems}
        </div>
    );
};

export default TaskList;