import React, {useState} from 'react';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from "./MenuItem";

const Menu = () => {
  const [state, setState] = useState({
    showMenu: false
  });

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, showMenu: open });
  };

  return (
    <>
      <Button onClick={toggleDrawer(true)}><MenuIcon/></Button>
      <Drawer anchor='left' open={state.showMenu} onClose={toggleDrawer(false)}>
        <MenuItem toggleDrawer={toggleDrawer}/>
      </Drawer>
    </>
  );
}

export default  Menu;