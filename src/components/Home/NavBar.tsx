import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Box,
  ListSubheader,
} from '@mui/material';
import { red } from '@mui/material/colors';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import TopicIcon from '@mui/icons-material/Topic';
import { styled } from '@mui/system';

interface NavBarProps {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const CustomDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    background-color: #1a1d2d;
    color: #9ea3b8;
    width: 250px;
  }
`;

const CustomListItemIcon = styled(ListItemIcon)`
  color: #9ea3b8;
  min-width: 32px; // Adjust the icon size
  padding-left: 20px;
  svg {
    font-size: 1.25rem; // Adjust the icon size
  }
`;

const CustomListItemText = styled(ListItemText)`
  .MuiTypography-root {
    font-size: 0.875rem; // Adjust the text size
    font-weight: 600;
  }
  padding-left: 10px;
`;

const NavBar: React.FC<NavBarProps> = ({ drawerOpen, setDrawerOpen }) => {
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  return (
    <CustomDrawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <List
          sx={{ flex: 1 }}
          subheader={
            <ListSubheader sx={{ backgroundColor: '#1A1D2D', color: 'white' }}>
              <ListItem sx={{ pt: 4, pb: 2 }}>
                <Avatar
                  sx={{ bgcolor: red[500], fontWeight: 'bold', fontSize: 18 }}
                >
                  U
                </Avatar>
              </ListItem>
            </ListSubheader>
          }
        >
          <ListItem button>
            <CustomListItemIcon>
              <TopicIcon />
            </CustomListItemIcon>
            <CustomListItemText primary="Topic center" />
          </ListItem>
          <ListItem button>
            <CustomListItemIcon>
              <HomeIcon />
            </CustomListItemIcon>
            <CustomListItemText primary="Home" />
          </ListItem>
          <ListItem button>
            <CustomListItemIcon>
              <ExploreIcon />
            </CustomListItemIcon>
            <CustomListItemText primary="Explore" />
          </ListItem>
          <ListItem button>
            <CustomListItemIcon>
              <FolderIcon />
            </CustomListItemIcon>
            <CustomListItemText primary="Saved folder" />
          </ListItem>
        </List>

        <List sx={{ flex: 0 }}>
          <ListItem button>
            <CustomListItemIcon>
              <SettingsIcon />
            </CustomListItemIcon>
            <CustomListItemText primary="Settings" />
          </ListItem>
          <ListItem button>
            <CustomListItemIcon>
              <ExitToAppIcon />
            </CustomListItemIcon>
            <CustomListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </CustomDrawer>
  );
};

export default NavBar;
