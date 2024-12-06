import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const drawerWidth = 240;

const AppBarHeader = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const AppBar = ({ open, handleDrawerOpen }) => {
  const [status, setStatus] = useState("Dead");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/heartbeat`, {
          headers: { accept: "application/json" },
        });
        const data = await response.json();
        if (data.status === "alive") {
          setStatus("Alive");
        } else {
          setStatus("Dead");
        }
      } catch (error) {
        console.error("Error fetching status:", error);
        setStatus("Dead");
      }
    };

    // Call the API on component mount
    fetchStatus();

    // Set up an interval to call the API every minute
    const interval = setInterval(fetchStatus, 60000); // 60000ms = 1 minute

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [API_BASE_URL]);

  return (
    <AppBarHeader position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ marginRight: 5, ...(open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          MySaarthi
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body1" color={status === "Alive" ? "inherit" : "error"}>
            {status}
          </Typography>
        </Box>
      </Toolbar>
    </AppBarHeader>
  );
};

export default AppBar;
