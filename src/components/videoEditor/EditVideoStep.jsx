// src/components/editor/EditVideoStep.jsx

import React, { useState, useRef, useCallback, useEffect } from "react";
import PlayerSection from "./editorStep/PlayerSection";
import Timeline from "./editorStep/timeline/Timeline";
import { Sequence, Video, Audio } from "remotion";
import { Box, Button } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import TextOverlayComponent from "./editorStep/TextOverlaComponent";
import calculateTotalDuration from "./editorStep/utils/calculateTotalDuration";
import rescaleTimeline from "./editorStep/utils/rescaleTimeline";

const defaultData = {
  scenes: [
    {
      id: "scene1",
      video: [
        { id: "video1", src: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4", duration: 120 },
        { id: "video2", src: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4", duration: 150 }
      ],
      audio: [
        { id: "audio1", src: "https://samplelib.com/lib/preview/mp3/sample-3s.mp3", duration: 270 }
      ],
      text: [
        { id: "text1", text: "Scene 1 Text", duration: 120 }
      ]
    },
    {
      id: "scene2",
      video: [
        { id: "video3", src: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4", duration: 200 }
      ],
      audio: [],
      text: [
        { id: "text2", text: "Scene 2 Text", duration: 200 }
      ]
    }
  ]
};

const EditVideoStep = (preloadedData ) => {

  const data = preloadedData || defaultData

  const [lanes, setLanes] = useState([
    {
      id: "video",
      items: [],
      color: "blue",
      icon: MovieIcon,
      label: "Clip",
    },
    {
      id: "audio",
      items: [],
      color: "green",
      icon: MusicNoteIcon,
      label: "Audio",
    },
    {
      id: "text",
      items: [],
      color: "purple",
      icon: TextFieldsIcon,
      label: "Text",
    },
  ]);
  const [totalDuration, setTotalDuration] = useState(1); // Default to 1 to prevent errors
  const [currentFrame, setCurrentFrame] = useState(0);
  const playerRef = useRef(null);

  

    // Handler to update item's start time when dragged
    const handleItemDrag = (laneId, itemId, newStart) => {
      setLanes((prevLanes) => {
        const updatedLanes = prevLanes.map((lane) => {
          if (lane.id === laneId) {
            const updatedItems = lane.items.map((item) => {
              if (item.id === itemId) {
                return { ...item, start: Math.max(0, newStart) };
              }
              return item;
            });
            return { ...lane, items: updatedItems };
          }
          return lane;
        });
  
        const newTotalDuration = calculateTotalDuration(updatedLanes);
        setTotalDuration(newTotalDuration);
        return updatedLanes;
      });
    };

  // Add a new item to a specific lane
  const addItemToLane = (laneId, newItem) => {
    setLanes((prevLanes) => {
      const updatedLanes = prevLanes.map((lane) => {
        if (lane.id === laneId) {
          const lastItem = lane.items[lane.items.length - 1];
          const start = lastItem ? lastItem.start + lastItem.duration : 0;

          const duration = newItem.duration || 100; // Default duration
          return {
            ...lane,
            items: [
              ...lane.items,
              {
                ...newItem,
                id: `${lane.id}-${lane.items.length + 1}`,
                start,
                duration,
              },
            ],
          };
        }
        return lane;
      });

      const newTotalDuration = calculateTotalDuration(updatedLanes);
      const scaledLanes = rescaleTimeline(updatedLanes, newTotalDuration);

      setTotalDuration(newTotalDuration);
      return scaledLanes;
    });
  };

  // Handler to delete an item from a lane
  const deleteItemFromLane = (laneId, itemId) => {
    setLanes((prevLanes) => {
      const updatedLanes = prevLanes.map((lane) => {
        if (lane.id === laneId) {
          const updatedItems = lane.items.filter((item) => item.id !== itemId);
          return { ...lane, items: updatedItems };
        }
        return lane;
      });

      const newTotalDuration = calculateTotalDuration(updatedLanes);
      const scaledLanes = rescaleTimeline(updatedLanes, newTotalDuration);

      setTotalDuration(newTotalDuration);
      return scaledLanes;
    });
  };

  // Handler for drag and drop events
  const onDragEnd = (result) => {
    if (!result.destination) return; // Dropped outside the list

    const { source, destination } = result;

    // Handle rearranging within the same lane
    if (source.droppableId === destination.droppableId) {
      setLanes((prevLanes) => {
        const laneIndex = prevLanes.findIndex(
          (lane) => lane.id === source.droppableId
        );
        const lane = prevLanes[laneIndex];
        const items = Array.from(lane.items);
        const [movedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, movedItem);

        // Update start times based on new order
        let cumulativeStart = 0;
        const updatedItems = items.map((item) => {
          const updatedItem = { ...item, start: cumulativeStart };
          cumulativeStart += item.duration;
          return updatedItem;
        });

        const updatedLane = { ...lane, items: updatedItems };
        const updatedLanes = [...prevLanes];
        updatedLanes[laneIndex] = updatedLane;

        const newTotalDuration = calculateTotalDuration(updatedLanes);
        const scaledLanes = rescaleTimeline(updatedLanes, newTotalDuration);

        setTotalDuration(newTotalDuration);
        return scaledLanes;
      });
    } else {
      // Handle moving items across lanes
      setLanes((prevLanes) => {
        const sourceLaneIndex = prevLanes.findIndex(
          (lane) => lane.id === source.droppableId
        );
        const destLaneIndex = prevLanes.findIndex(
          (lane) => lane.id === destination.droppableId
        );
        const sourceLane = prevLanes[sourceLaneIndex];
        const destLane = prevLanes[destLaneIndex];

        const sourceItems = Array.from(sourceLane.items);
        const [movedItem] = sourceItems.splice(source.index, 1);
        const destItems = Array.from(destLane.items);
        destItems.splice(destination.index, 0, movedItem);

        // Update start times in source lane
        let cumulativeStart = 0;
        const updatedSourceItems = sourceItems.map((item) => {
          const updatedItem = { ...item, start: cumulativeStart };
          cumulativeStart += item.duration;
          return updatedItem;
        });

        // Update start times in destination lane
        cumulativeStart = 0;
        const updatedDestItems = destItems.map((item) => {
          const updatedItem = { ...item, start: cumulativeStart };
          cumulativeStart += item.duration;
          return updatedItem;
        });

        const updatedLanes = [...prevLanes];
        updatedLanes[sourceLaneIndex] = {
          ...sourceLane,
          items: updatedSourceItems,
        };
        updatedLanes[destLaneIndex] = {
          ...destLane,
          items: updatedDestItems,
        };

        const newTotalDuration = calculateTotalDuration(updatedLanes);
        const scaledLanes = rescaleTimeline(updatedLanes, newTotalDuration);

        setTotalDuration(newTotalDuration);
        return scaledLanes;
      });
    }
  };

  const Composition = useCallback(
    () => (
      <>
        {lanes.map((lane) =>
          lane.items.map((item) => {
            const from = isNaN(item.start) ? 0 : item.start;
            const durationInFrames = isNaN(item.duration) ? 1 : item.duration;

            return (
              <Sequence
                key={item.id}
                from={from}
                durationInFrames={durationInFrames}
              >
                {lane.id === "video" ? (
                  <Video src={item.src} />
                ) : lane.id === "audio" ? (
                  <Audio src={item.src} />
                ) : (
                  <TextOverlayComponent text="Sample Text" />
                )}
              </Sequence>
            );
          })
        )}
      </>
    ),
    [lanes]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const frame = playerRef.current.getCurrentFrame();
        setCurrentFrame(frame || 0);
      }
    }, 1000 / 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ padding: "20px" }}>
      <Box
        sx={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <PlayerSection
          playerRef={playerRef}
          Composition={Composition}
          totalDuration={totalDuration}
        />
        <Timeline
          lanes={lanes}
          currentFrame={currentFrame}
          totalDuration={totalDuration}
          onDeleteItem={deleteItemFromLane}
          onDragEnd={onDragEnd}
        />
        <Box sx={{ marginTop: "20px", textAlign: "center" }}>
          <Button
            onClick={() =>
              addItemToLane("video", {
                duration: 150,
                src: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
              })
            }
            variant="contained"
            color="primary"
            startIcon={<MovieIcon />}
            sx={{ marginRight: "10px" }}
          >
            Add Clip
          </Button>
          <Button
            onClick={() =>
              addItemToLane("audio", {
                duration: 150,
                src: "https://samplelib.com/lib/preview/mp3/sample-3s.mp3",
              })
            }
            variant="contained"
            color="success"
            startIcon={<MusicNoteIcon />}
            sx={{ marginRight: "10px" }}
          >
            Add Audio Clip
          </Button>
          <Button
            onClick={() =>
              addItemToLane("text", { duration: 150, text: "Sample Text" })
            }
            variant="contained"
            color="secondary"
            startIcon={<TextFieldsIcon />}
          >
            Add Text Overlay
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditVideoStep;
