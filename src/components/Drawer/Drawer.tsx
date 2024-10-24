import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import CloseIcon from '@mui/icons-material/Close';
import { isMobile } from '../../App';
export const DrawerComponent = ({open, setOpen, children}) => {

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

 
  return (
    <div>
      <Drawer open={open} onClose={toggleDrawer(false)}>
      <Box sx={{ width: isMobile ? '100vw' : '400px', height: '100%' }} role="presentation">
     
      {children}
    </Box>
      </Drawer>
    </div>
  );
}
