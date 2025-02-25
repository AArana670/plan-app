import React, { useState } from "react";
import ProjectHeader from "../components/mainHeader";
import {IconButton} from "../components/buttons";
import { Dialog } from '@base-ui-components/react/dialog';
import "../styles/home.css";
import { Redirect } from "wouter";


const UploadDialog = ({grid, setGrid}) => {

    function uploadFile(event) {
        alert("Feature not implemented yet")
        event.preventDefault();
        /*const file = event.target.files[0]
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split('\n');
            const headers = lines[0].split(',');
            const rows = [];
            for (let i = 1; i < lines.length; i++) {
                const obj = {};
                const currentLine = lines[i].split(',');
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentLine[j];
                }
                rows.push(obj);
            }
            setGrid({columns: headers, rows: rows})
        };
        reader.readAsText(file);*/
    }


    return (
        <div className="popup-main">
            <div className="upload-area" onDrop={uploadFile}>
                <h2>Sube un archivo </h2>
            </div>
        </div>
    )

}

function Cell({row, col, value, onChangeFun}) {
    return (
        <th className="cell">
            <input type="text" id={row+"-"+col} onChange={onChangeFun} onFocus={(event) => event.target.select()} className="cell-input" defaultValue={value}/>
        </th>
    )
}

const Excel = ({columns, setColumns, rows, setRows, params}) => {

    function addColumn(event) {
        setColumns([...columns, event.target.value])
    }

    function updateColumn(event) {
        let newColumns = [...columns]
        const col = event.target.id.split("-")[1]
        newColumns[col] = event.target.value
        setColumns(newColumns)
    }

    function addRow(event) {
        let newRow = {}
        const col = event.target.id.split("-")[1]
        newRow[col] = event.target.value
        setRows([...rows, newRow])
    }

    var colElems = [];
    for (let i in columns){
        colElems.push(<Cell row={0} col={i} onChangeFun={updateColumn} value={columns[i]}/>)
    }
    colElems.push(<Cell row={0} col={columns.length} onChangeFun={addColumn} className="extra-row extra-col" value={""}/>)

    var content = [];
    for (let i in rows){
        let row = []
        for (let j in columns){
            const col = columns[j]
            row.push(<Cell value={rows[i][col] || ""}/>)
        }

        //Add an empty column to the table, so that it can be clicked to create a new attribute
        row.push(<Cell className="extra-row" value={""}/>)

        content.push(
        <tr className="excel-row">
            {row}
        </tr>)
    }

    //Add an empty row to the table, so that it can be clicked to create a new object
    var extraRow = [];
    for (let i in columns){
        const col = columns[i]
        extraRow.push(<Cell row={rows.length} col={col} onChangeFun={addRow} className="extra-row" value={""}/>)
    }
    extraRow.push(<Cell className="extra-row extra-col" value={""}/>)

    return (
    <table row className="excel">
        <tr className="excel-row">
            {colElems}
        </tr>
        {content}
        <tr className="excel-row">
            {extraRow}
        </tr>
    </table>)
}

const Home = ({params}) => {
    const defaultWorkColumns = ["Nombre", "Artista", "Peso", "Luz", "Humedad", "Noenqué", "Noencuántos"]
    const defaultWorks = [{Nombre: "Estatua 1", Artista: "Halfonso", Peso: "20", Luz: "250", Humedad: "5", Noenqué: "210"}, {Nombre: "Estatua 2", Artista: "Halfonso", Peso: "20", Luz: "320", Noenqué: "195"}, {Nombre: "Cuadro 1", Artista: "Halfonso", Peso: "20", Luz: "250", Humedad: "5", Noenqué: "203", Noencuántos: "52"}]
    const [workColumns, setWorkColumns] = useState(defaultWorkColumns)
    const [works, setWorks] = useState(defaultWorks)

    const defaultOthers = [{Nombre: "Estatua 1", Artista: "Halfonso", Peso: "20", Luz: "250", Humedad: "5", Noenqué: "210"}, {Nombre: "Estatua 2", Artista: "Halfonso", Peso: "20", Luz: "320", Humedad: "5", Noenqué: "195"}, {Nombre: "Cuadro 1", Artista: "Halfonso", Peso: "20", Luz: "250", Humedad: "5", Noenqué: "203", Noencuántos: "52"}]
    const [otherColumns, setOtherColumns] = useState(defaultWorkColumns)
    const [others, setOthers] = useState(defaultOthers)

    
    if (!params.id) return <Redirect to="/projects" />;
    return (
        <div>
            <ProjectHeader id={params.id} current="main"/>
            <main className="home-main">
                <header>
                    <h2>Obras</h2>
                    <Dialog.Root>
                        <Dialog.Trigger className="dialog-btn">
                        <IconButton id="scan-works" src="/icons/document.svg"/>
                        </Dialog.Trigger>
                        <Dialog.Portal keepMounted>
                            <Dialog.Backdrop className="dialog-background" />
                            <Dialog.Popup className="dialog-main">
                                <UploadDialog id={params.id}/>
                            </Dialog.Popup>
                        </Dialog.Portal>
                    </Dialog.Root>
                </header>
                <Excel columns={workColumns} setColumns={setWorkColumns} rows={works} setRows={setWorks}/>
                <hr/>
                <header>
                    <h2>Otros elementos</h2>
                    <IconButton id="scan-works" src="/icons/document.svg"/>
                </header>
                <Excel columns={otherColumns} setColumns={setOtherColumns} rows={others} setRows={setOthers}/>
            </main>
        </div>
    )
}

export default Home