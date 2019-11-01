import "./styles.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/app";
import Store from "./store";

import data from "./../data/data";
console.log(data);

var globals = {
  store: new Store(data),
  version: process.env.npm_package_version
};

ReactDOM.render(
  React.createElement(App, { store: globals.store }),
  document.getElementById("app")
);

export { globals };
