import {Avatar, IconButton, Menu, MenuItem} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import AuthService from "../services/AuthService";

const UserMenu = () => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const session = useSelector(state => state.session);

  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const _logout = () => {
    dispatch(AuthService.logout());
  }

  useEffect(() => {
    //every session change, do not kep menu open!
    handleClose();
  }, [session]);

  return (
    <div>
      <IconButton
        aria-owns={open ? "menu-appbar" : undefined}
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit">
        <Avatar alt={session.user.name} src={session.user.picture}/>
      </IconButton>

      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{vertical: "top", horizontal: "right"}}
        transformOrigin={{vertical: "top", horizontal: "right"}}
        open={open}
        onClose={handleClose}>
        <MenuItem onClick={() => _logout()}>Logout</MenuItem>
      </Menu>
    </div>
  )
}

export default UserMenu;