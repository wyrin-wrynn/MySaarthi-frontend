// components/imageEditor/components/ControlPanel.jsx
import React from 'react';
import {
  Box,
  Button,
  Typography,
  Divider,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Slider
} from '@mui/material';

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

  const addRectangle = () => {
    addElement({
      id: `rect-${Date.now()}`,
      type: 'rect',
      x: Math.random() * (stageSize.width - 100),
      y: Math.random() * (stageSize.height - 50),
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
      x: Math.random() * (stageSize.width - 80),
      y: Math.random() * (stageSize.height - 80),
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
      x: Math.random() * (stageSize.width - 200),
      y: Math.random() * (stageSize.height - 50),
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
      x: Math.random() * (stageSize.width - 200),
      y: Math.random() * (stageSize.height - 200),
      src: 'https://konvajs.org/assets/lion.png',
      draggable: true,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      brightness: 0,
      filters: [],
    });
  };

  // Handlers for properties
  const handleFillChange = (color) => selectedElement && onTransform(selectedElement.id, { fill: color });
  const handleStrokeChange = (color) => selectedElement && onTransform(selectedElement.id, { stroke: color });
  const handleStrokeWidthChange = (value) => selectedElement && onTransform(selectedElement.id, { strokeWidth: value });
  const handleFontFamilyChange = (e) => selectedElement && onTransform(selectedElement.id, { fontFamily: e.target.value });
  const handleFontSizeChange = (value) => selectedElement && onTransform(selectedElement.id, { fontSize: value });
  const handleFontColorChange = (color) => selectedElement && onTransform(selectedElement.id, { fontColor: color });
  const handleAlignChange = (e) => selectedElement && onTransform(selectedElement.id, { align: e.target.value });
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
    <Box sx={{ padding: 1, width: '200px' }}>
      <Button variant="contained" color="primary" fullWidth onClick={addRectangle} sx={{ marginBottom: 2 }}>Add Rectangle</Button>
      <Button variant="contained" color="primary" fullWidth onClick={addCircle} sx={{ marginBottom: 2 }}>Add Circle</Button>
      <Button variant="contained" color="primary" fullWidth onClick={addText} sx={{ marginBottom: 2 }}>Add Text</Button>
      <Button variant="contained" color="primary" fullWidth onClick={addImage} sx={{ marginBottom: 2 }}>Add Image</Button>
      <Divider sx={{ marginY: 2 }} />
      <Button variant="contained" color="secondary" fullWidth onClick={undo} disabled={historyStep <= 0} sx={{ marginBottom: 2 }}>Undo</Button>
      <Button variant="contained" color="secondary" fullWidth onClick={redo} disabled={historyStep >= historyLength - 1} sx={{ marginBottom: 2 }}>Redo</Button>
      <Button variant="contained" color="success" fullWidth onClick={handleSaveAsJPG} sx={{ marginTop: 2 }}>Save as JPG</Button>
      
      {selectedElement && (
        <Box sx={{ padding: 1, marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>Properties</Typography>
          <Divider sx={{ marginBottom: 2 }} />

          {selectedElement.type === 'rect' && (
            <>
              <Typography variant="subtitle1">Rectangle</Typography>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Fill Color</Typography>
                <input type="color" value={selectedElement.fill} onChange={(e) => handleFillChange(e.target.value)} style={{ width: '100%', height: '40px' }} />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Border Color</Typography>
                <input type="color" value={selectedElement.stroke || '#000000'} onChange={(e) => handleStrokeChange(e.target.value)} style={{ width: '100%', height: '40px' }} />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Border Width</Typography>
                <Slider value={selectedElement.strokeWidth} min={0} max={20} step={1} onChange={(e, val) => handleStrokeWidthChange(val)} valueLabelDisplay="auto" />
              </Box>
            </>
          )}

          {selectedElement.type === 'circle' && (
            <>
              <Typography variant="subtitle1">Circle</Typography>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Fill Color</Typography>
                <input type="color" value={selectedElement.fill} onChange={(e) => handleFillChange(e.target.value)} style={{ width: '100%', height: '40px' }} />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Border Color</Typography>
                <input type="color" value={selectedElement.stroke || '#000000'} onChange={(e) => handleStrokeChange(e.target.value)} style={{ width: '100%', height: '40px' }} />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Border Width</Typography>
                <Slider value={selectedElement.strokeWidth} min={0} max={20} step={1} onChange={(e, val) => handleStrokeWidthChange(val)} valueLabelDisplay="auto" />
              </Box>
            </>
          )}

          {selectedElement.type === 'text' && (
            <>
              <Typography variant="subtitle1">Text</Typography>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Font Family</Typography>
                <FormControl fullWidth>
                  <Select value={selectedElement.fontFamily} onChange={handleFontFamilyChange}>
                    {fontFamilies.map((font) => <MenuItem key={font} value={font}>{font}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Font Size</Typography>
                <Slider value={selectedElement.fontSize} min={10} max={100} step={1} onChange={(e, val) => handleFontSizeChange(val)} valueLabelDisplay="auto" />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Font Color</Typography>
                <input type="color" value={selectedElement.fontColor || '#000000'} onChange={(e) => handleFontColorChange(e.target.value)} style={{ width: '100%', height: '40px' }} />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Alignment</Typography>
                <FormControl fullWidth>
                  <Select value={selectedElement.align} onChange={handleAlignChange}>
                    <MenuItem value="left">Left</MenuItem>
                    <MenuItem value="center">Center</MenuItem>
                    <MenuItem value="right">Right</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <FormControlLabel control={<Checkbox checked={selectedElement.bold} onChange={handleBoldChange} />} label="Bold" />
                <FormControlLabel control={<Checkbox checked={selectedElement.italic} onChange={handleItalicChange} />} label="Italic" />
                <FormControlLabel control={<Checkbox checked={selectedElement.underline} onChange={handleUnderlineChange} />} label="Underline" />
              </Box>
            </>
          )}

          {selectedElement.type === 'image' && (
            <>
              <Typography variant="subtitle1">Image</Typography>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Opacity</Typography>
                <Slider value={selectedElement.opacity} min={0} max={1} step={0.01} onChange={handleOpacityChange} valueLabelDisplay="auto" />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography gutterBottom>Brightness</Typography>
                <Slider value={selectedElement.brightness} min={-255} max={255} step={1} onChange={handleBrightnessChange} valueLabelDisplay="auto" />
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ControlPanel;
