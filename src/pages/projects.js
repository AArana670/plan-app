import React from "react";
import Header from "../components/mainHeader";
import {MainButton} from "../components/buttons";
import TaskList from "../components/taskList";
import "../styles/projects.css"

const CardList = ({cards}) => {
  var cardElems = [];

  for (let i in cards) {
    cardElems.push(
      <a className="card" href={"/project/"+cards[i]}>
        <img src="https://picsum.photos/200" alt={cards[i]}/>
        <h2>{cards[i]}</h2>
      </a>
    );
  }

  return (
    <div className="cardlist">
      {cardElems}
    </div>
  );
};

const Projects = () => {
  const cards = ["Project A", "Project B", "Project C", "Project D", "Project E", "Project F", "Project G", "Project H"];
  const tasks = [{name: "Task A", description: "Albion Online es un MMORPG no lineal en el que escribes tu propia historia sin limitarte a seguir un camino prefijado."}, {name: "Task B", description: "Albion Online es un MMORPG no lineal en el que escribes tu propia historia sin limitarte a seguir un camino prefijado."}, {name: "Task C", description: "Albion Online es un MMORPG no lineal en el que escribes tu propia historia sin limitarte a seguir un camino prefijado."}, {name: "Task D", description: "Albion Online es un MMORPG no lineal en el que escribes tu propia historia sin limitarte a seguir un camino prefijado."}, {name: "Task E", description: "Albion Online es un MMORPG no lineal en el que escribes tu propia historia sin limitarte a seguir un camino prefijado."}];
  return (
    <div>
      <Header />
      <main className="projects-main">
      <MainButton id="new-project" text="Nuevo Proyecto"/>
        <CardList cards={cards}/>
        <TaskList tasks={tasks}/>
      </main>
    </div>
  );
};

export default Projects