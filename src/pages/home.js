import React from "react";
import ProjectHeader from "../components/mainHeader";
import {IconButton} from "../components/buttons";
import "../styles/home.css";
import { Redirect } from "wouter";

function Cell({value}) {
    console.log(value)
    return (
        <th className="cell">
            <input type="text" onFocus={(event) => event.target.select()} className="cell-input" value={value}/>
        </th>
    )
}

const Excel = ({columns, rows, params}) => {
    var colElems = [];
    for (let i in columns){
        colElems.push(<Cell value={columns[i]}/>)
    }

    var content = [];
    for (let i in rows){
        let row = []
        console.log(rows[i])
        for (let j in columns){
            const col = columns[j]
            console.log(col)
            row.push(<Cell value={rows[i][col] || ""}/>)
        }
        content.push(
        <tr className="excel-row">
            {row}
        </tr>)
    }
    return (
    <table row className="excel">
        <tr className="excel-row">
            {colElems}
        </tr>
        {content}
    </table>)
}

const Home = ({params}) => {
    const workColumns = ["Nombre", "Artista", "Peso", "Luz", "Humedad", "Noenqué", "Noencuántos"]
    const otherColumns = ["Nombre", "Artista", "Peso", "Luz", "Humedad", "Noenqué", "Noencuántos"]
    const works = [{Nombre: "Estatua 1", Artista: "Halfonso", Peso: "20", Luz: "250", Humedad: "5", Noenqué: "210"}, {Nombre: "Estatua 2", Artista: "Halfonso", Peso: "20", Luz: "320", Humedad: "5", Noenqué: "195"}, {Nombre: "Cuadro 1", Artista: "Halfonso", Peso: "20", Luz: "250", Humedad: "5", Noenqué: "203", Noencuántos: "52"}]
    const others = [{Nombre: "Estatua 1", Artista: "Halfonso", Peso: "20", Luz: "250", Humedad: "5", Noenqué: "210"}, {Nombre: "Estatua 2", Artista: "Halfonso", Peso: "20", Luz: "320", Humedad: "5", Noenqué: "195"}, {Nombre: "Cuadro 1", Artista: "Halfonso", Peso: "20", Luz: "250", Humedad: "5", Noenqué: "203", Noencuántos: "52"}]

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
                <Excel columns={workColumns} rows={works}/>
                <hr/>
                <header>
                    <h2>Otros elementos</h2>
                    <IconButton id="scan-works" src="/icons/document.svg"/>
                </header>
                <Excel columns={otherColumns} rows={others}/>
            </main>
        </div>
    )
}

export default Home