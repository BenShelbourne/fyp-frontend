import React, { Component } from 'react';

import { BrowserRouter } from "react-router-dom";
import Tab from "./Tab";
import Routers from "./Routes";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css';

class App extends Component {
  render() {
    return (
        <div>
            <BrowserRouter>
                <div>
                    <Routers/>
                    <Tab/>
                </div>
            </BrowserRouter>
        </div>
    );
  }
}

export default App;
