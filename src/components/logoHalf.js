import React from "react";
import "../styles/logoHalf.css"

export function LogoHalf(){
    return (
    <div className="logo-half">
        <a href='./login' className="logo">
            <img src="logo.jpg" alt="logo" className="logo-img" />
            {/*<h1 className="logo-text-1">Plan A</h1>*/}
        </a>
    </div>)
}