import React from "react";
import ProjectHeader from "../components/mainHeader";
import {IconButton} from "../components/buttons";
import "../styles/home.css";
import { Redirect } from "wouter";

function Cell({value}) {
    console.log(value)
    return (
        <th className="cell">
            <input type="text" className="cell-input" value={value}/>
        </th>
    )
}

const Excel = ({columns, rows, params}) => {
    var colElems = [];
    for (let i in columns){
        colElems.push(<Cell value={columns[i]}/>)
    }
    return (
    <table row className="excel">
        <tr className="excel-row">
            {colElems}
        </tr>
    </table>)
}

const Home = ({params}) => {
    const workColumns = ["Nombre", "Artista", "Peso", "Luz", "Humedad", "Noenqué", "Noencuántos"]
    const otherColumns = ["Nombre", "Artista", "Peso", "Luz", "Humedad", "Noenqué", "Noencuántos"]
    const works = [{nombre: "Estatua 1", artista: "Halfonso", peso: "20", luz: "250", humedad: "5", noenque: "210"}, {nombre: "Estatua 2", artista: "Halfonso", peso: "20", luz: "320", humedad: "5", noenque: "195"}, {nombre: "Cuadro 1", artista: "Halfonso", peso: "20", luz: "250", humedad: "5", noenque: "203", noencuantos: "52"}]
    const others = []

    console.log(params)
    if (!params.id) return <Redirect to="/projects" />;
    return (
        <div>
            <ProjectHeader id={params.id} current="main"/>
            <main className="home-main">
                <header>
                    <h2>Obras</h2>
                    <IconButton id="scan-works" src="/icons/document.svg"/>
                </header>
                <Excel columns={workColumns}/>
                <hr/>
                <header>
                    <h2>Otros elementos</h2>
                    <IconButton id="scan-works" src="/icons/document.svg"/>
                </header>
                <Excel />
            </main>
        </div>
    )
}

export default Home