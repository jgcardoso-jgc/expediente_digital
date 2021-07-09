import React, {Component} from "react";
import logo from "./logo.svg";
import { Link } from 'react-router-dom';
import "./App.css";

class Login extends Component {

  render() {
    return <div id="incode" className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Link to="/hello"> <button type="button">
          Login
     </button></Link>
      </header>
    </div>
  }
};
export default Login;
