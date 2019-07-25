import React, { Component, Fragment, Suspense } from "react";

import Routes from "./routes";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import "flag-icon-css/css/flag-icon.min.css";
import "normalize.css";
import "./index.css";
import "@inrupt/solid-style-guide";

library.add(fas);
library.add(faGithub);
class App extends Component {
  render() {
    return (
      <Suspense>
        <Fragment>
          <Routes />
        </Fragment>
      </Suspense>
    );
  }
}

export default App;
