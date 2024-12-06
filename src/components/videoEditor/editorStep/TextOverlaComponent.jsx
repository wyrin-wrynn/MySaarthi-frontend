// src/components/common/TextOverlayComponent.jsx

import React from "react";
import { Box } from "@mui/material";

const TextOverlayComponent = ({ text }) => (
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "64px",
      fontWeight: "bold",
      color: "white",
      textShadow: "0 0 5px black",
    }}
  >
    {text}
  </Box>
);

export default TextOverlayComponent;
