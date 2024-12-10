import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Slider,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

const RightDrawer = ({ selectedElement, onTransform, saveHistory }) => {
  const handleTransform = (key, value) => {
    onTransform(selectedElement.id, { [key]: value });
  };

  const handleSliderChange = (key, value) => {
    handleTransform(key, value); // Update the UI immediately
  };

  const handleSliderChangeCommitted = (key, value) => {
    saveHistory(); // Save history only when the slider interaction is complete
  };

  if (!selectedElement) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" color="textSecondary">
          No element selected
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Properties
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />

      {/* Shared Properties for Rect and Circle */}
      {['rect', 'circle'].includes(selectedElement.type) && (
        <>
          <Typography gutterBottom>Fill Color</Typography>
          <input
            type="color"
            value={selectedElement.fill || '#000000'}
            onChange={(e) => handleTransform('fill', e.target.value)}
            style={{ width: '100%', height: '40px' }}
          />
          <Typography gutterBottom>Stroke Color</Typography>
          <input
            type="color"
            value={selectedElement.stroke || '#000000'}
            onChange={(e) => handleTransform('stroke', e.target.value)}
            style={{ width: '100%', height: '40px' }}
          />
          <Typography gutterBottom>Stroke Width</Typography>
          <Slider
            value={selectedElement.strokeWidth || 0}
            min={0}
            max={20}
            step={1}
            onChange={(e, value) => handleSliderChange('strokeWidth', value)}
            onChangeCommitted={(e, value) => handleSliderChangeCommitted('strokeWidth', value)}
            valueLabelDisplay="auto"
          />
        </>
      )}

      {/* Circle-Specific Properties */}
      {selectedElement.type === 'circle' && (
        <>
          <Typography gutterBottom>Radius</Typography>
          <Slider
            value={selectedElement.radius || 0}
            min={10}
            max={200}
            step={1}
            onChange={(e, value) => handleSliderChange('radius', value)}
            onChangeCommitted={(e, value) => handleSliderChangeCommitted('radius', value)}
            valueLabelDisplay="auto"
          />
        </>
      )}

      {/* Text-Specific Properties */}
      {selectedElement.type === 'text' && (
        <>
          <Typography gutterBottom>Font Family</Typography>
          <FormControl fullWidth>
            <Select
              value={selectedElement.fontFamily || 'Arial'}
              onChange={(e) => handleTransform('fontFamily', e.target.value)}
            >
              {['Calibri', 'Arial', 'Helvetica', 'Times New Roman', 'Courier New'].map((font) => (
                <MenuItem value={font} key={font}>
                  {font}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography gutterBottom>Font Size</Typography>
          <Slider
            value={selectedElement.fontSize || 20}
            min={10}
            max={100}
            step={1}
            onChange={(e, value) => handleSliderChange('fontSize', value)}
            onChangeCommitted={(e, value) => handleSliderChangeCommitted('fontSize', value)}
            valueLabelDisplay="auto"
          />
          <Typography gutterBottom>Font Color</Typography>
          <input
            type="color"
            value={selectedElement.fontColor || '#000000'}
            onChange={(e) => handleTransform('fontColor', e.target.value)}
            style={{ width: '100%', height: '40px' }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedElement.bold || false}
                onChange={(e) => handleTransform('bold', e.target.checked)}
              />
            }
            label="Bold"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedElement.italic || false}
                onChange={(e) => handleTransform('italic', e.target.checked)}
              />
            }
            label="Italic"
          />
        </>
      )}

      {/* Image-Specific Properties */}
      {selectedElement.type === 'image' && (
        <>
          <Typography gutterBottom>Opacity</Typography>
          <Slider
            value={selectedElement.opacity || 1}
            min={0}
            max={1}
            step={0.01}
            onChange={(e, value) => handleSliderChange('opacity', value)}
            onChangeCommitted={(e, value) => handleSliderChangeCommitted('opacity', value)}
            valueLabelDisplay="auto"
          />
          <Typography gutterBottom>Brightness</Typography>
          <Slider
            value={selectedElement.brightness || 0}
            min={-255}
            max={255}
            step={1}
            onChange={(e, value) => handleSliderChange('brightness', value)}
            onChangeCommitted={(e, value) => handleSliderChangeCommitted('brightness', value)}
            valueLabelDisplay="auto"
          />
        </>
      )}
    </Box>
  );
};

export default RightDrawer;
