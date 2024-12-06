// src/components/editor/timeline/LaneItem.jsx

import React, { useRef } from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Draggable from "react-draggable";

const LaneItem = ({
  item,
  color,
  label,
  totalDuration,
  onDeleteItem,
  laneId,
  onItemDrag,
}) => {
  const safeTotalDuration =
    isNaN(totalDuration) || totalDuration === 0 ? 1 : totalDuration;

  const leftPercent =
    isNaN(item.start) || isNaN(safeTotalDuration)
      ? 0
      : (item.start / safeTotalDuration) * 100;
  const widthPercent =
    isNaN(item.duration) || isNaN(safeTotalDuration)
      ? 0
      : (item.duration / safeTotalDuration) * 100;

  const nodeRef = useRef(null);

  const handleDrag = (e, data) => {
    const laneWidth = nodeRef.current.parentElement.offsetWidth;
    const deltaXPercent = (data.x / laneWidth) * 100;
    const newLeftPercent = leftPercent + deltaXPercent;
    const newStart = (newLeftPercent / 100) * totalDuration;

    onItemDrag(laneId, item.id, newStart);

    // Prevent default behavior
    e.preventDefault();
  };

  return (
    <Draggable
      axis="x"
      bounds="parent"
      nodeRef={nodeRef}
      onDrag={handleDrag}
      position={{ x: 0, y: 0 }}
    >
      <Box
        ref={nodeRef}
        sx={{
          position: "absolute",
          left: `${leftPercent}%`,
          width: `${widthPercent}%`,
          height: "40px",
          backgroundColor: color,
          color: "white",
          textAlign: "center",
          lineHeight: "40px",
          borderRadius: "4px",
          fontSize: "12px",
          margin: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "5px",
          paddingRight: "5px",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {label}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteItem(laneId, item.id);
          }}
          sx={{ color: "white" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Draggable>
  );
};

export default LaneItem;
