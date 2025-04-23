import './App.css';
import {Switch, Link, Route, Redirect} from "wouter";
//import Home from "./pages";
import Login from "./pages/login";
import Welcome from "./pages/welcome";
import Register from "./pages/register";
import Forgot from "./pages/forgot";
import Projects from "./pages/projects";
import Home from './pages/home';
import Calendar from './pages/calendar';
import Users from './pages/users';
import Roles from './pages/roles';
import Profile from './pages/profile';
import Invite from './pages/invite';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Welcome} />
        <Route path="/register" component={Register} />
        <Route path="/forgot" component={Forgot} />
        <Route path="/projects" component={Projects} />
        <Route path="/project/:id" component={Home} />
        <Route path="/project/:id/calendar" component={Calendar} />
        <Route path="/project/:id/users" component={Users} />
        <Route path="/project/:id/roles" component={Roles} />
        <Route path="/profile/:username" component={Profile} />
        <Route path="/invite/:pId/:rId" component={Invite} />
      </Switch>
    </div>
  );
}

export default App;
