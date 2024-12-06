import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "./Drawer";
import AppBar from "./Appbar";
import Playground from "./Playground";

const Layout = () => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar open={open} handleDrawerOpen={handleDrawerOpen} />
      <Drawer open={open} handleDrawerClose={handleDrawerClose} />
      <Playground>
      </Playground>
    </Box>
  );
};

export default Layout;
