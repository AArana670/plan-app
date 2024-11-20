import './App.css';
import {Switch, Link, Route} from "wouter";
//import Home from "./pages";
import Login from "./pages/login";
import Welcome from "./pages/welcome";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Welcome} />
      </Switch>
    </div>
  );
}

export default App;
