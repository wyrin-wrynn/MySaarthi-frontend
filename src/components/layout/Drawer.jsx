import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FolderIcon from "@mui/icons-material/Folder";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ImageIcon from "@mui/icons-material/ImageAspectRatio"
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom"; // Import Link from React Router

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const MenuItem = ({to, icon: IconComponent, label}) => {
  return(
    <ListItem disablePadding>
    <ListItemButton component={Link} to={to}>
      <ListItemIcon>
        <IconComponent />
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  </ListItem>
  );
}

const menuItems  = [
  { to: '/', icon: FolderIcon, label: 'Home' },
  { to: '/video', icon: VideoLibraryIcon, label: 'Create Video' },
  { to: '/image-editor', icon: ImageIcon, label: 'Create Image'}
]

const Drawer = ({ open, handleDrawerClose }) => {
  const theme = useTheme();

  return (
    <MuiDrawer
      variant="permanent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...(open
          ? { ...openedMixin(theme), "& .MuiDrawer-paper": openedMixin(theme) }
          : { ...closedMixin(theme), "& .MuiDrawer-paper": closedMixin(theme) }),
      }}
    >
      {/* Header */}
      <DrawerHeader>
        <Box display="flex" alignItems="center">
          {open && <Typography variant="h6"></Typography>}
        </Box>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />

      {/* Middle Sections */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 1 }}>
        {/* Section 1: Create */}
        <List>
        {menuItems.map((item) => (
        <MenuItem key={item.label} to={item.to} icon={item.icon} label={item.label} />
      ))}
        </List>

        <Divider />
        <Divider />
      </Box>

      {/* Footer */}
      <Box sx={{ padding: 2, display: "flex", alignItems: "center" }}>
        <Avatar src="https://via.placeholder.com/40" sx={{ mr: open ? 1 : 0 }} />
        {open && (
          <Box>
            <Typography variant="body1">Akhil</Typography>
            <Typography variant="body2" color="text.secondary">
              akhil1988@gmail.com
            </Typography>
          </Box>
        )}
      </Box>
    </MuiDrawer>
  );
};

export default Drawer;
