import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import {makeStyles} from "@material-ui/styles";
import PersonIcon from '@material-ui/icons/Person';
import HomeIcon from '@material-ui/icons/Home';
import {useHistory} from "react-router-dom";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

const MenuItem = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const menuItems = [
    {title: 'Home', icon: <HomeIcon />, link: "/home"},
    {title: 'Users', icon: <PersonIcon />, link: "/userList"},
  ];

  const browseTo = (route) => {
    history.push(route);
  }

  return (
    <div
      className={classes.list}
      role="presentation"
      onClick={props.toggleDrawer(false)}
      onKeyDown={props.toggleDrawer(false)}
    >
      <List>
        {menuItems.map(({title, icon, link}, index) => (
          <ListItem button key={index} onClick={() => browseTo(link)}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={title} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default MenuItem;