import React from "react";
import { Route, Switch } from "react-router-dom";
import Airlines from "./Airlines/Airlines";
import Airline from "./Airline/Airline";

function App() {
  return (
    <Switch>
      {/* all airlines */}
      <Route exact path="/" component={Airlines} />
      {/* each individual airline/ airline#show */}
      <Route exact path="/airlines/:slug" component={Airline} />
    </Switch>
  );
}

export default App;
