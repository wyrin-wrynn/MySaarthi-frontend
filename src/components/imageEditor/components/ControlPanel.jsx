// components/imageEditor/components/ControlPanel.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Slider,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import Grid from '@mui/material/Grid2'
import ActionCard from './elements/ActionCard'

const fontFamilies = [
  'Calibri', 'Arial', 'Helvetica', 'Times New Roman', 'Courier New',
  'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman',
  'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'
];

const ControlPanel = ({
  selectedElement,
  onTransform,
  undo,
  redo,
  historyStep,
  historyLength,
  addElement,
  handleSaveAsJPG,
  stageSize
}) => {
  // State to manage the selected tab
  const [tabIndex, setTabIndex] = useState(0);

  // Handler for tab change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Handlers to add different elements
  const addRectangle = () => {
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
    });
  };

  const addCircle = () => {
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
    });
  };

  const addText = () => {
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
    });
  };

  const addImage = () => {
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
    });
  };

  // Define the action arrays
  const shapesActions = [
    {
      id: 'add-rectangle',
      title: 'Rectangle',
      onClick: addRectangle,
    },
    {
      id: 'add-circle',
      title: 'Circle',
      onClick: addCircle,
    },
  ];

  const textActions = [
    {
      id: 'add-text',
      title: 'Text',
      onClick: addText,
    },
    // Add more text actions here if needed
  ];

  const imageActions = [
    {
      id: 'add-image',
      title: 'Image',
      onClick: addImage,
    },
    // Add more image actions here if needed
  ];

  // Handlers for properties (unchanged)
  const handleFillChange = (color) => selectedElement && onTransform(selectedElement.id, { fill: color });
  const handleStrokeChange = (color) => selectedElement && onTransform(selectedElement.id, { stroke: color });
  const handleStrokeWidthChange = (value) => selectedElement && onTransform(selectedElement.id, { strokeWidth: value });
  const handleFontFamilyChange = (e) => selectedElement && onTransform(selectedElement.id, { fontFamily: e.target.value });
  const handleFontSizeChange = (value) => selectedElement && onTransform(selectedElement.id, { fontSize: value });
  const handleFontColorChange = (color) => selectedElement && onTransform(selectedElement.id, { fontColor: color });
  const handleBoldChange = (e) => selectedElement && onTransform(selectedElement.id, { bold: e.target.checked });
  const handleItalicChange = (e) => selectedElement && onTransform(selectedElement.id, { italic: e.target.checked });
  const handleUnderlineChange = (e) => selectedElement && onTransform(selectedElement.id, { underline: e.target.checked });
  const handleOpacityChange = (e, newValue) => selectedElement && onTransform(selectedElement.id, { opacity: newValue });
  const handleBrightnessChange = (e, newValue) => {
    if (!selectedElement) return;
    let newFilters = [...(selectedElement.filters || [])];
    const brightnessFilterIndex = newFilters.indexOf('Brightness');
    if (newValue !== 0) {
      if (brightnessFilterIndex === -1) newFilters.push('Brightness');
    } else {
      if (brightnessFilterIndex !== -1) newFilters.splice(brightnessFilterIndex, 1);
    }
    onTransform(selectedElement.id, { brightness: newValue, filters: newFilters });
  };

  return (
    <Box sx={{margin: 1, boxSizing: 'border-box' }}>
      {/* Tab Navigation */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="secondary"
        indicatorColor="secondary"
        sx={{ marginBottom: 1 }}
      >
        <Tab label="Shapes" />
        <Tab label="Text" />
        <Tab label="Image" />
      </Tabs>

      {/* Tab Content with Grid Layout */}
      <Box>
        <Grid container spacing={1}>
          {tabIndex === 0 && shapesActions.map(action => (
            <Grid item size={6} key={action.id}>
              <ActionCard title={action.title} onAction={action.onClick} />
            </Grid>
          ))}

          {tabIndex === 1 && textActions.map(action => (
            <Grid item size={6} key={action.id}>
              <ActionCard title={action.title} onAction={action.onClick} />
            </Grid>
          ))}

          {tabIndex === 2 && imageActions.map(action => (
            <Grid item size={6} key={action.id}>
              <ActionCard title={action.title} onAction={action.onClick} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ marginY: 2 }} />

      {/* Undo, Redo, and Save Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth>
          <Typography variant="subtitle1" gutterBottom>
            History
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={undo}
                disabled={historyStep <= 0}
              >
                Undo
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={redo}
                disabled={historyStep >= historyLength - 1}
              >
                Redo
              </Button>
            </Grid>
          </Grid>
        </FormControl>
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handleSaveAsJPG}
        >
          Save as JPG
        </Button>
      </Box>

      {/* Properties Panel */}
      {selectedElement && (
        <Box sx={{ padding: 1, marginTop: 4 }}>
          <Typography variant="h6" gutterBottom>
            Properties
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />

          {/* Rectangle Properties */}
          {selectedElement.type === 'rect' && (
            <>
              <Typography variant="subtitle1">Rectangle</Typography>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Fill Color</Typography>
                <input
                  type="color"
                  value={selectedElement.fill}
                  onChange={(e) => handleFillChange(e.target.value)}
                  style={{ width: '100%', height: '40px', border: 'none', padding: 0 }}
                />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Border Color</Typography>
                <input
                  type="color"
                  value={selectedElement.stroke || '#000000'}
                  onChange={(e) => handleStrokeChange(e.target.value)}
                  style={{ width: '100%', height: '40px', border: 'none', padding: 0 }}
                />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Border Width</Typography>
                <Slider
                  value={selectedElement.strokeWidth}
                  min={0}
                  max={20}
                  step={1}
                  onChange={(e, val) => handleStrokeWidthChange(val)}
                  valueLabelDisplay="auto"
                />
              </Box>
            </>
          )}

          {/* Circle Properties */}
          {selectedElement.type === 'circle' && (
            <>
              <Typography variant="subtitle1">Circle</Typography>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Fill Color</Typography>
                <input
                  type="color"
                  value={selectedElement.fill}
                  onChange={(e) => handleFillChange(e.target.value)}
                  style={{ width: '100%', height: '40px', border: 'none', padding: 0 }}
                />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Border Color</Typography>
                <input
                  type="color"
                  value={selectedElement.stroke || '#000000'}
                  onChange={(e) => handleStrokeChange(e.target.value)}
                  style={{ width: '100%', height: '40px', border: 'none', padding: 0 }}
                />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Border Width</Typography>
                <Slider
                  value={selectedElement.strokeWidth}
                  min={0}
                  max={20}
                  step={1}
                  onChange={(e, val) => handleStrokeWidthChange(val)}
                  valueLabelDisplay="auto"
                />
              </Box>
            </>
          )}

          {/* Text Properties */}
          {selectedElement.type === 'text' && (
            <>
              <Typography variant="subtitle1">Text</Typography>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Font Family</Typography>
                <FormControl fullWidth>
                  <Select
                    value={selectedElement.fontFamily}
                    onChange={handleFontFamilyChange}
                  >
                    {fontFamilies.map((font) => (
                      <MenuItem key={font} value={font}>
                        {font}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Font Size</Typography>
                <Slider
                  value={selectedElement.fontSize}
                  min={10}
                  max={100}
                  step={1}
                  onChange={(e, val) => handleFontSizeChange(val)}
                  valueLabelDisplay="auto"
                />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Font Color</Typography>
                <input
                  type="color"
                  value={selectedElement.fontColor || '#000000'}
                  onChange={(e) => handleFontColorChange(e.target.value)}
                  style={{ width: '100%', height: '40px', border: 'none', padding: 0 }}
                />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedElement.bold}
                      onChange={handleBoldChange}
                    />
                  }
                  label="Bold"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedElement.italic}
                      onChange={handleItalicChange}
                    />
                  }
                  label="Italic"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedElement.underline}
                      onChange={handleUnderlineChange}
                    />
                  }
                  label="Underline"
                />
              </Box>
            </>
          )}

          {/* Image Properties */}
          {selectedElement.type === 'image' && (
            <>
              <Typography variant="subtitle1">Image</Typography>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Opacity</Typography>
                <Slider
                  value={selectedElement.opacity}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={handleOpacityChange}
                  valueLabelDisplay="auto"
                />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Brightness</Typography>
                <Slider
                  value={selectedElement.brightness}
                  min={-255}
                  max={255}
                  step={1}
                  onChange={handleBrightnessChange}
                  valueLabelDisplay="auto"
                />
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ControlPanel;
