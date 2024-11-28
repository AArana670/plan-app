import './App.css';
import {Switch, Link, Route} from "wouter";
//import Home from "./pages";
import Login from "./pages/login";
import Welcome from "./pages/welcome";
import Register from "./pages/register";
import Forgot from "./pages/forgot";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Welcome} />
        <Route path="/register" component={Register} />
        <Route path="/forgot" component={Forgot} />
      </Switch>
    </div>
  );
}

export default App;
