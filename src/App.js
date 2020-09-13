import React from 'react';
import {createMuiTheme, CssBaseline, ThemeProvider} from '@material-ui/core';
import Router from "./services/routes/Router";
import Header from "./components/Header";
import {useSelector} from "react-redux";

function App() {
  const isUserLogged = useSelector(state => state.session.isLogged);

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
        { isUserLogged ? <Header/> : null}
        <Router/>
      </ThemeProvider>
    </div>
  );
}

export default App;
