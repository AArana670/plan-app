import React, { useEffect, useState } from "react";
import ProjectHeader from "../components/mainHeader";
import {IconButton} from "../components/buttons";
import { Dialog } from '@base-ui-components/react/dialog';
import { Dialog as TriggerableDialog } from 'primereact/dialog';
import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import "../styles/home.css";
import { Redirect } from "wouter";
import axios from "axios";


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

const CommentDialog = ({selectedCell, visible, setVisible, columns, rows}) => {
    const postComment = (e) => {
        const text = e.target.form[0].value
        axios.post(process.env.REACT_APP_SERVER+'/api/projects/'+ sessionStorage.getItem('projectId') +'/messages', 
        {text: text, comment: {column: selectedCell.column, row: selectedCell.row, value: selectedCell.value}},
        {headers: {'user-id': sessionStorage.getItem('userId')}})
    }

    return (
      <TriggerableDialog visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}
        content={({ hide }) => (
          <div className="popup-main">
              <h3>{"Comenta en " + columns.find((col)=>col.id === selectedCell.column).name + " de " + Object.values(rows.find((row)=>row.id === selectedCell.row))[0]}</h3>
              <form className="project-form" onSubmit={(e)=>e.preventDefault()}>
                <textarea id="comment" />
                <div className="dialog-buttons">
                  <button className="secondary-btn" onClick={hide}>Cancelar</button>
                  <button className="main-btn" onClick={(e)=>{postComment(e); hide(e)}}>Enviar</button>
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

const Spreadsheet = ({group, columns, setColumns, rows, setRows, pId, isAdmin}) => {

    const getColumns = (columnNames) => columnNames.map((column) => {return { columnId: column.id, width: 150, resizable: true }})

    const headerRow = (columnNames) => {return {rowId: "header", cells: columnNames.map((column) => {return { type: isAdmin? "text": "header", text: column.name }})}}
    
    const [commentVisible, setCommentVisible] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);

    const applyChangesToRows = (changes) => {
        const newRows = [...rows]
        changes.forEach(async (change) => {
            const idx = change.rowId
            const fieldName = change.columnId
            if (idx == 'newRow'){
                const newRow = {}
                newRow[fieldName] = change.newCell.text
                await axios.post(process.env.REACT_APP_SERVER+'/api/projects/'+pId+'/items', 
                    {attributes: newRow, spreadsheet: group+''}, {headers: {'user-id': sessionStorage.getItem('userId')}}).then((res)=>{
                        if (res.status==200){
                            newRow['id'] = res.data.id
                            newRows.push(newRow)
                        }
                    }).catch((e)=>{})
            }else {
                axios.put(process.env.REACT_APP_SERVER+'/api/projects/'+pId+'/items/'+idx, 
                    {attributes: {[fieldName]: change.newCell.text}}, {headers: {'user-id': sessionStorage.getItem('userId')}}).then((res)=>{
                        if (res.status==200){
                            newRows.map((item)=>{if (item.id === idx) item[fieldName] = change.newCell.text; return item})
                        }
                    }).catch((e)=>{})
            }
        });
        setRows(newRows)
    }
    
    const applyChangesToColumns = (changes) => {
        const newColumns = [...columns]
        const promises = []
        changes.forEach((change) => {
            const fieldName = change.columnId;
            if (fieldName == ''){ //New column
                promises.push(axios.post(process.env.REACT_APP_SERVER+'/api/projects/'+pId+'/attributes', 
                    {name: change.newCell.text, spreadsheet: group+''}, {headers: {'user-id': sessionStorage.getItem('userId')}}).then((res)=>{
                        if (res.status == 200){
                            newColumns.push({id: res.data.attributeId, name: change.newCell.text, project_id: pId, spreadsheet: group+''})
                        }
                    }))
            }else if (change.newCell.text == '') //Cannot set an empty column name
                return
            else if (change.newCell.text in columns){ //Cannot set repeated names
                return
            } else {
                promises.push(axios.put(process.env.REACT_APP_SERVER+'/api/projects/'+pId+'/attributes', 
                    {name: change.newCell.text}).then(((res)=>{
                        if (res.status == 200){
                            newColumns[newColumns.find((col)=>col.text==fieldName)].name=change.newCell.text
                        }
                    })))
            }
        });
        Promise.all(promises).then((results) => {
            setColumns(newColumns)
        })
    }

    const handleChanges = (changes) => {
        const columnChanges = changes.filter((change) => change.rowId == 'header')
        applyChangesToColumns(columnChanges) //Change on column name
        const rowChanges = changes.filter((change) => change.rowId != 'header')
        applyChangesToRows(rowChanges)
    };

    const handleContextMenu = (
        selectedRowIds,
        selectedColIds,
        selectionMode,
        menuOptions,
        selectedRanges
      ) => {
        return [/*{
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
          },*/
          {
            id: "comment",
            label: "Comentar celda",
            handler: () => {
                const row = selectedRanges[0][0].rowId
                const column = selectedRanges[0][0].columnId
                const value = rows.find((item)=>item.id===row)[column]
                setSelectedCell({row: row, column: column, value: value})
                setCommentVisible(true)
            }
          }];
      }

    const getRows = (items, columns) => [
        headerRow(columns),
        ...items.map((item) => ({
          rowId: item.id,
          cells: columns.map((col)=> {return {type: "text", text: item[col.id]? String(item[col.id]): ""}} )
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
    columnNames.push({id: "", name: ""}) //Add empty column

    return  <div>
                <ReactGrid rows={getRows(rows, columnNames)} columns={getColumns(columnNames)} onCellsChanged={handleChanges} onContextMenu={handleContextMenu} />
                <CommentDialog selectedCell={selectedCell} visible={commentVisible} setVisible={setCommentVisible} columns={columns} rows={rows}/>
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
    const [isAdmin, setAdmin] = useState(false)
    useEffect(() => {
        axios.get(process.env.REACT_APP_SERVER+'/api/users/'+sessionStorage.getItem('userId')+'/roles', {headers: {'user-id': sessionStorage.getItem('userId')}}).then((res) => {
            setAdmin(res.data.roles.find((role) => role.project_id == params.id).name === 'admin')
        })
    }, [])

    const [workColumns, setWorkColumns] = useState([])
    const [works, setWorks] = useState([])

    const [otherColumns, setOtherColumns] = useState([])
    const [others, setOthers] = useState([])

    const [budgetColumns, setBudgetColumns] = useState([])
    const [budget, setBudget] = useState([])

    useEffect(() => {
        axios.get(process.env.REACT_APP_SERVER+'/api/projects/'+params.id+'/attributes', {headers: {'user-id': sessionStorage.getItem('userId')}}).then((res) => {
            if (res.data.attributes.length > 0){
                setWorkColumns(res.data.attributes.filter((attr)=>attr.spreadsheet==='1'))
                setBudgetColumns(res.data.attributes.filter((attr)=>attr.spreadsheet==='2'))
                setOtherColumns(res.data.attributes.filter((attr)=>attr.spreadsheet==='3'))
                const ids = res.data.attributes.map((attr) => attr.id)
                axios.get(process.env.REACT_APP_SERVER+'/api/projects/'+params.id+'/items', {headers: {'user-id': sessionStorage.getItem('userId'), 'attributes': ids.join(',')}})
                    .then((resItems) => {
                        setWorks(resItems.data.items.filter((item)=>item.spreadsheet==='1'))
                        setBudget(resItems.data.items.filter((item)=>item.spreadsheet==='2'))
                        setOthers(resItems.data.items.filter((item)=>item.spreadsheet==='3'))
                    })
            }
        })
    }, [])

    const [selectedTab, setSelectedTab] = useState("works")
    const tabValues = ["works", "budget", "others"]
    const tabNames = ["Obras", "Presupuesto", "Otros"]
    const current = tabValues.indexOf(selectedTab)

    if (!params.id) return <Redirect to="/projects" />;
    return (
        <div>
            <ProjectHeader id={params.id} current="main" isAdmin={isAdmin}/>
            <main className="home-main">
                <Tabs values={tabValues} names={tabNames} selected={selectedTab} setSelected={setSelectedTab}/>
                <header>
                    <h2>{tabNames[current]}</h2>
                    {/*<Dialog.Root>
                        <Dialog.Trigger className="dialog-btn">
                        <IconButton id="scan-works" src="/icons/document.svg"/>
                        </Dialog.Trigger>
                        <Dialog.Portal keepMounted>
                            <Dialog.Backdrop className="dialog-background" />
                            <Dialog.Popup className="dialog-main">
                                <UploadDialog id={params.id}/>
                            </Dialog.Popup>
                        </Dialog.Portal>
                    </Dialog.Root>*/}
                </header>
                <div className="spreadsheet">
                    <Spreadsheet group={tabValues.indexOf(selectedTab)+1} columns={selectedTab=="works" ? workColumns : selectedTab=="budget" ? budgetColumns : otherColumns} setColumns={selectedTab=="works" ? setWorkColumns : selectedTab=="budget" ? setBudgetColumns : setOtherColumns} rows={selectedTab=="works" ? works : selectedTab=="budget" ? budget : others} setRows={selectedTab=="works" ? setWorks : selectedTab=="budget" ? setBudget : setOthers} pId={params.id} isAdmin={isAdmin}/>
                </div>
            </main>
        </div>
    )
}

export default Home