import React from "react";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

const Playground = () => {

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 2,
      }}
    >
      {/* Spacer to account for the AppBar height */}
      <Box
        sx={{
          height: (theme) => theme.mixins.toolbar.minHeight,
        }}
      />

      {/* Dynamic Content Loaded via Outlet */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
        }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Playground;
