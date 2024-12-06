// src/components/editor/timeline/Lane.jsx

import React from "react";
import { Box } from "@mui/material";
import LaneItem from "./LaneItem";

const Lane = ({
  laneId,
  items,
  color,
  icon: Icon,
  totalDuration,
  label,
  onDeleteItem,
  onItemDrag,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: "60px",
        margin: "0",
        position: "relative",
      }}
    >
      {/* Icon for the lane */}
      <Box
        sx={{
          width: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0",
        }}
      >
        <Icon sx={{ fontSize: "30px", color }} />
      </Box>
      {/* Lane for items */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          height: "40px",
          marginLeft: "10px",
          margin: "0",
          padding: "0",
        }}
      >
        {items.map((item) => (
          <LaneItem
            key={item.id}
            item={item}
            color={color}
            label={label}
            totalDuration={totalDuration}
            onDeleteItem={onDeleteItem}
            laneId={laneId}
            onItemDrag={onItemDrag}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Lane;
