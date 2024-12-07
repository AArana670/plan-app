import React from "react";
import ProjectHeader from "../components/mainHeader";
import "../styles/main.css";
import { Redirect } from "wouter";

const Main = ({params}) => {
    console.log(params)
    if (!params.id) return <Redirect to="/projects" />;
    return (
        <div className="main">
            <ProjectHeader id={params.id}/>
            <main>
                <h1>Main page</h1>
            </main>
        </div>
    )
}

export default Main