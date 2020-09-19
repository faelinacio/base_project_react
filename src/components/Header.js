import React from "react";
import {AppBar, Toolbar, Typography,} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import UserMenu from "./UserMenu";
import Menu from "./Menu";

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    marginLeft: 15,
    flexGrow: 1,
  }
}));

const Header = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Menu/>

          <Typography className={classes.title} variant="h6" color="inherit">{props.title}</Typography>

          <UserMenu/>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;