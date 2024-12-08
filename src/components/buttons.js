import React from "react";
import "../styles/buttons.css"

const MainButton = (params) => {
    return (
        <button id={params.id} className="main-btn">
            {params.text}
        </button>
    )
}

const IconButton = (params) => {
    return (
        <button id={params.id} className="icon-btn">
            <img src={params.src}/>
        </button>
    )
}

export default (MainButton, IconButton)