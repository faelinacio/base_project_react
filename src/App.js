import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { CssBaseline } from "@material-ui/core";
import Router from "./services/routes/Router";

function App() {

  const darkTheme = createMuiTheme({
    palette: {
      type: 'dark'
    }
  });

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline/>

        <Router/>
      </ThemeProvider>
    </div>
  );
}

export default App;
