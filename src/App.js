import React from 'react';
import {createMuiTheme, CssBaseline, ThemeProvider} from '@material-ui/core';
import Router from "./services/routes/Router";

function App() {

  const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: "#37474F",
      },
      secondary: {
        main: "#bcc7cb",
      },
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
