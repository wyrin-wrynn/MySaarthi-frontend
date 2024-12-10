import React, { useState } from 'react';
import { Box, Tabs, Tab} from '@mui/material';
import Grid from '@mui/material/Grid2'
import ActionCard from '../elements/ActionCard';

const LeftDrawer = ({ addElement }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const actions = [
    // Tab 0: Shapes
    [
      {
        id: 'add-rectangle',
        title: 'Rectangle',
        onClick: () =>
          addElement({
            id: `rect-${Date.now()}`,
            type: 'rect',
            x: 20,
            y: 20,
            width: 100,
            height: 50,
            fill: 'blue',
            stroke: 'black',
            strokeWidth: 2,
            draggable: true,
          }),
      },
      {
        id: 'add-circle',
        title: 'Circle',
        onClick: () =>
          addElement({
            id: `circle-${Date.now()}`,
            type: 'circle',
            x: 40,
            y: 40,
            radius: 40,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 2,
            draggable: true,
          }),
      },
    ],
    // Tab 1: Text
    [
      {
        id: 'add-text',
        title: 'Text',
        onClick: () =>
          addElement({
            id: `text-${Date.now()}`,
            type: 'text',
            x: 60,
            y: 60,
            text: 'Sample Text',
            fontSize: 20,
            fontFamily: 'Calibri',
            fontColor: '#000000',
            align: 'left',
            bold: false,
            italic: false,
            underline: false,
            draggable: true,
            scaleX: 1,
            scaleY: 1,
          }),
      },
    ],
    // Tab 2: Images
    [
      {
        id: 'add-image',
        title: 'Image',
        onClick: () =>
          addElement({
            id: `image-${Date.now()}`,
            type: 'image',
            x: 100,
            y: 100,
            src: 'https://konvajs.org/assets/lion.png',
            draggable: true,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            brightness: 0,
            filters: [],
          }),
      },
    ],
  ];

  return (
    <Box>
      <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth" textColor="secondary" indicatorColor="secondary">
        <Tab label="Shapes" />
        <Tab label="Text" />
        <Tab label="Image" />
      </Tabs>
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={1}>
          {actions[tabIndex].map((action) => (
            <Grid item xs={12} key={action.id}>
              <ActionCard title={action.title} onAction={action.onClick} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default LeftDrawer;
