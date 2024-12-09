import React from "react";
import ProjectHeader from "../components/mainHeader";
import {IconButton} from "../components/buttons";
import "../styles/home.css";
import { Redirect } from "wouter";

const Excel = ({params}) => {
    return (
    <div>
        <h3>Excel</h3>
    </div>)
}

const Home = ({params}) => {
    console.log(params)
    if (!params.id) return <Redirect to="/projects" />;
    return (
        <div>
            <ProjectHeader id={params.id} current="main"/>
            <main className="home-main">
                <header>
                    <h1>Obras</h1>
                    <IconButton id="scan-works" src="/icons/document.svg"/>
                </header>
                <Excel />
                <hr/>
                <header>
                    <h1>Otros elementos</h1>
                    <IconButton id="scan-works" src="/icons/document.svg"/>
                </header>
                <Excel />
            </main>
        </div>
    )
}

export default Home