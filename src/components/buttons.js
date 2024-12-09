import React from "react";
import "../styles/buttons.css"

export function MainButton(params) {
    return (
        <button id={params.id} className="main-btn">
            {params.text}
        </button>
    )
}

export function IconButton(params) {
    return (
        <button id={params.id} className="icon-btn">
            <img src={params.src}/>
        </button>
    )
}