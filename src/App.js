import './App.css';
import {Switch, Link, Route, Redirect} from "wouter";
//import Home from "./pages";
import Login from "./pages/login";
import Welcome from "./pages/welcome";
import Register from "./pages/register";
import Forgot from "./pages/forgot";
import Projects from "./pages/projects";
import Main from './pages/main';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Welcome} />
        <Route path="/register" component={Register} />
        <Route path="/forgot" component={Forgot} />
        <Route path="/projects" component={Projects} />
        <Route path="/project/:id" component={Main} />
        <Route path="/project/:id/calendar" component={Main} />
      </Switch>
    </div>
  );
}

export default App;
