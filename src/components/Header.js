import React from "react";
import {AppBar, Toolbar, Typography,} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import UserMenu from "./UserMenu";
import Menu from "./Menu";

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
}));

const Header = () => {
  const classes = useStyles();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Menu/>
        <Typography variant="h6" color="inherit">Header</Typography>

        <div className={classes.grow}/>

        <UserMenu/>
      </Toolbar>
    </AppBar>
  );
}

export default Header;