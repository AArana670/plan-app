import React, { useState } from "react";
import ProjectHeader from "../components/mainHeader";
import {IconButton} from "../components/buttons";
import { Dialog } from '@base-ui-components/react/dialog';
import { Dialog as TriggerableDialog } from 'primereact/dialog';
import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
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

/*function Cell({row, col, value, onChangeFun}) {
    return (
        <th className="cell">
            <input type="text" id={row+"-"+col} onChange={onChangeFun} onFocus={(event) => event.target.select()} className="cell-input" defaultValue={value}/>
        </th>
    )
}*/

function hasPermission(subject) {
    return false
}

const CommentDialog = ({selectedCell, visible, setVisible}) => {
    return (
      <TriggerableDialog visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
        content={({ hide }) => (
          <div className="popup-main">
              <h3>{"Comenta en " + selectedCell.column + " de " + selectedCell.row}</h3>
              <form className="project-form" onSubmit={(e)=>e.preventDefault()}>
                <textarea id="comment" />
                <div className="dialog-buttons">
                  <button className="secondary-btn" onClick={hide}>Cancelar</button>
                  <button className="main-btn" onClick={hide}>Enviar</button>
                </div>
              </form>
          </div>
        )}>
        </TriggerableDialog>
      )
}

const Tabs = ({values, names, selected, setSelected}) => {
    return (
      <div className="tabs-header">
          <button className={"tab" + (values[0]===selected? " selected-tab" : "")} onClick={(e)=>setSelected(values[0])}>{names[0]}</button>
          <button className={"tab" + (values[1]===selected? " selected-tab" : "")} onClick={(e)=>setSelected(values[1])}>{names[1]}</button>
          <button className={"tab" + (values[2]===selected? " selected-tab" : "")} onClick={(e)=>setSelected(values[2])}>{names[2]}</button>
      </div>
    );
  };

const Spreadsheet = ({columns, setColumns, rows, setRows, params}) => {

    const getColumns = (columnNames) => columnNames.map((column) => {return { columnId: column, width: 150, resizable: true }})

    const headerRow = (columnNames) => {return {rowId: "header", cells: columnNames.map((column) => {return { type: hasPermission("admin")? "text": "header", text: column }})}}
    
    const [commentVisible, setCommentVisible] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);

    const applyChangesToRows = (
        changes,
        prevRows
      ) => {
        changes.forEach((change) => {
          const idx = change.rowId;
          const fieldName = change.columnId;
          prevRows[idx][fieldName] = change.newCell.text;
        });
        return [...prevRows];
      };

    const handleChanges = (changes) => { 
        setRows((rows) => applyChangesToRows(changes, rows));
        console.log(rows)
    };

    const handleContextMenu = (
        selectedRowIds,
        selectedColIds,
        selectionMode,
        menuOptions,
        selectedRanges
      ) => {
        return [{
            id: "addRow",
            label: "Añadir fila debajo",
            handler: () => {
                const newRows = [...rows]
                newRows.splice((selectedRanges[0][0].rowId)+1, 0, {})
                setRows(newRows)
            }
          },
          {
            id: "addColumn",
            label: "Añadir columna a la derecha",
            handler: () => {
                const newColumns = [...columns]
                newColumns.splice(columns.indexOf(selectedRanges[0][0].columnId)+1, 0, "")
                setColumns(newColumns)
            }
          },
          {
            id: "comment",
            label: "Comentar celda",
            handler: () => {
                const row = selectedRanges[0][0].rowId
                const column = selectedRanges[0][0].columnId
                const value = rows[row][column]
                setSelectedCell({row: rows[row][columns[0]], column: column, value: value})
                setCommentVisible(true)
            }
          }];
      }

    const getRows = (items, columns) => [
        headerRow(columns),
        ...items.map((item, idx) => ({
          rowId: idx,
          cells: columns.map((col)=> {return {type: "text", text: item[col]? String(item[col]): ""}} )
          /*cells: [
            { type: "text", text: item.name },
            { type: "text", text: item.surname }
          ]*/
        })),
        {
            rowId: "newRow",
            cells: columns.map((col)=> {return {type: "text", text: ""}})
        }
    ];

    const columnNames = [...columns]
    columnNames.push("") //Add empty column

    return  <div>
                <ReactGrid rows={getRows(rows, columnNames)} columns={getColumns(columnNames)} onCellsChanged={handleChanges} onContextMenu={handleContextMenu} />
                <CommentDialog selectedCell={selectedCell} visible={commentVisible} setVisible={setCommentVisible}/>
            </div>

    /*function addColumn(event) {
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
    </table>)*/
}

const Home = ({params}) => {
    const defaultWorkColumns = ["Nombre", "Artista", "Peso", "Luz", "Humedad", "Noenqué", "Noencuántos"]
    const defaultWorks = [{Nombre: "Estatua 1", Artista: "Halfonso", Peso: "20", Luz: "250", Humedad: "5", Noenqué: "210"}, {Nombre: "Estatua 2", Artista: "Halfonso", Peso: "20", Luz: "320", Noenqué: "195"}, {Nombre: "Cuadro 1", Artista: "Halfonso", Peso: "20", Luz: "250", Humedad: "5", Noenqué: "203", Noencuántos: "52"}]
    const [workColumns, setWorkColumns] = useState(defaultWorkColumns)
    const [works, setWorks] = useState(defaultWorks)

    const defaultOthers = [{Nombre: "Estatua 1", Artista: "Halfonso", Peso: "20", Luz: "250", Humedad: "5", Noenqué: "210"}, {Nombre: "Estatua 2", Artista: "Halfonso", Peso: "20", Luz: "320", Humedad: "5", Noenqué: "195"}, {Nombre: "Cuadro 1", Artista: "Halfonso", Peso: "20", Luz: "250", Humedad: "5", Noenqué: "203", Noencuántos: "52"}]
    const [otherColumns, setOtherColumns] = useState(defaultWorkColumns)
    const [others, setOthers] = useState(defaultOthers)

    const defaultBudget = [{Nombre: "Ilumniación", Coste: "200"}, {Nombre: "Transporte", Coste: "250"}]
    const defaultBudgetColumns = ["Nombre", "Coste"]
    const [budgetColumns, setBudgetColumns] = useState(defaultBudgetColumns)
    const [budget, setBudget] = useState(defaultBudget)

    const [selectedTab, setSelectedTab] = useState("works")
    const tabValues = ["works", "budget", "others"]
    const tabNames = ["Obras", "Presupuesto", "Otros"]
    const current = tabValues.indexOf(selectedTab)

    if (!params.id) return <Redirect to="/projects" />;
    return (
        <div>
            <ProjectHeader id={params.id} current="main"/>
            <main className="home-main">
                <Tabs values={tabValues} names={tabNames} selected={selectedTab} setSelected={setSelectedTab}/>
                <header>
                    <h2>{tabNames[current]}</h2>
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
                <Spreadsheet columns={selectedTab=="works" ? workColumns : selectedTab=="budget" ? budgetColumns : otherColumns} setColumns={selectedTab=="works" ? setWorkColumns : selectedTab=="budget" ? setBudgetColumns : setOtherColumns} rows={selectedTab=="works" ? works : selectedTab=="budget" ? budget : others} setRows={selectedTab=="works" ? setWorks : selectedTab=="budget" ? setBudget : setOthers}/>
            </main>
        </div>
    )
}

export default Home