import React, { useState, useRef, useEffect } from 'react';
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Text,
  Image as KonvaImage,
  Transformer,
} from 'react-konva';
import {
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  Slider,
  Divider,
} from '@mui/material';
import useImage from 'use-image';
import Grid from '@mui/material/Grid2'

// Utility function to compare arrays of objects
const isArraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    const el1 = arr1[i];
    const el2 = arr2[i];
    const keys1 = Object.keys(el1);
    const keys2 = Object.keys(el2);
    if (keys1.length !== keys2.length) return false;
    for (let k of keys1) {
      if (el1[k] !== el2[k]) return false;
    }
  }
  return true;
};

// Custom Brightness Filter
Konva.Filters.Brightness = function (imageData) {
  const brightness = this.brightness || 0;
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] += brightness;
    imageData.data[i + 1] += brightness;
    imageData.data[i + 2] += brightness;
  }
};

const ImageItem = ({
  element,
  onSelect,
  onTransform,
  onDragEnd,
  bringToFront,
}) => {
  // Load image with crossOrigin set to 'Anonymous'
  const [img] = useImage(element.src, 'Anonymous');
  const { id, x, y, draggable, scaleX, scaleY, width, height, opacity, brightness, filters } = element;

  useEffect(() => {
    if (img && (!element.width || !element.height)) {
      onTransform(id, {
        width: img.width,
        height: img.height,
      });
    }
  }, [img, element.width, element.height, id, onTransform]);

  if (!img) return null;

  return (
    <KonvaImage
      id={id}
      image={img}
      x={x}
      y={y}
      width={width || img.width}
      height={height || img.height}
      scaleX={scaleX || 1}
      scaleY={scaleY || 1}
      opacity={opacity !== undefined ? opacity : 1}
      filters={filters || []}
      brightness={brightness || 0}
      draggable={draggable}
      crossOrigin="Anonymous" // Ensure crossOrigin is set
      onClick={() => {
        onSelect(id);
        bringToFront(id);
      }}
      onTap={() => {
        onSelect(id);
        bringToFront(id);
      }}
      onDragStart={() => bringToFront(id)}
      onDragEnd={(e) => {
        onDragEnd(id, e.target.x(), e.target.y());
      }}
    />
  );
};

const ShapeItem = ({
  element,
  onSelect,
  onTransform,
  onDragEnd,
  bringToFront,
  onEditTextRequest,
}) => {
  const commonProps = {
    id: element.id,
    x: element.x,
    y: element.y,
    draggable: element.draggable,
    onClick: () => {
      onSelect(element.id);
      bringToFront(element.id);
    },
    onTap: () => {
      onSelect(element.id);
      bringToFront(element.id);
    },
    onDragStart: () => bringToFront(element.id),
    onDragEnd: (e) => {
      onDragEnd(element.id, e.target.x(), e.target.y());
    },
  };

  if (element.type === 'rect') {
    return (
      <Rect
        {...commonProps}
        width={element.width}
        height={element.height}
        fill={element.fill}
        stroke={element.stroke}
        strokeWidth={element.strokeWidth}
      />
    );
  } else if (element.type === 'circle') {
    return (
      <Circle
        {...commonProps}
        radius={element.radius}
        fill={element.fill}
        stroke={element.stroke}
        strokeWidth={element.strokeWidth}
      />
    );
  } else if (element.type === 'text') {
    return (
      <Text
        {...commonProps}
        text={element.text}
        fontSize={element.fontSize}
        fill={element.fontColor}
        fontFamily={element.fontFamily}
        align={element.align}
        fontStyle={`${element.bold ? 'bold ' : ''}${element.italic ? 'italic ' : ''}${
          element.underline ? 'underline' : ''
        }`}
        scaleX={element.scaleX || 1}
        scaleY={element.scaleY || 1}
        onDblClick={(e) => onEditTextRequest(element.id, e.target)}
        onDblTap={(e) => onEditTextRequest(element.id, e.target)}
      />
    );
  }

  return null;
};

const TransformerComponent = ({
  selectedElement,
  onTransformEnd,
  stageRef,
}) => {
  const transformerRef = useRef();

  useEffect(() => {
    if (selectedElement && stageRef.current && transformerRef.current) {
      const node = stageRef.current.findOne(`#${selectedElement.id}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      } else {
        transformerRef.current.nodes([]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedElement, stageRef]);

  return selectedElement ? (
    <Transformer
      ref={transformerRef}
      ignoreStroke={true}
      rotateEnabled={true}
      resizeEnabled={true}
      boundBoxFunc={(oldBox, newBox) => {
        if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
          return oldBox;
        }
        return newBox;
      }}
      onTransformEnd={() => onTransformEnd(selectedElement.id)}
    />
  ) : null;
};

const ImageEditor = () => {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef();

  const [textEditing, setTextEditing] = useState({
    isEditing: false,
    elementId: null,
    value: '',
    x: 0,
    y: 0,
    fontSize: 20,
    nodeWidth: 0,
  });
  const textInputRef = useRef();

  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Handle window resize to make Stage responsive
  useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveHistory = (newEls) => {
    const last = history[history.length - 1];
    if (last && isArraysEqual(last, newEls)) {
      // No changes, just update elements
      setElements(newEls);
      return;
    }
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newEls);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
    setElements(newEls);
  };

  useEffect(() => {
    // Initialize empty canvas state once
    saveHistory([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set up keydown listener for delete
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedId) {
        deleteSelectedElement();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // Only depend on selectedId so that the handler updates if selection changes
  }, [selectedId]);

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      setElements(history[newStep]);
      setSelectedId(null);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      setElements(history[newStep]);
      setSelectedId(null);
    }
  };

  const bringToFront = (id) => {
    const elIndex = elements.findIndex((el) => el.id === id);
    if (elIndex === -1) return;
    if (elIndex === elements.length - 1) {
      // Already at front, no changes
      return;
    }
    const newEls = [...elements];
    const [item] = newEls.splice(elIndex, 1);
    newEls.push(item);
    saveHistory(newEls);
  };

  const addRectangle = () => {
    const newEls = [
      ...elements,
      {
        id: `rect-${elements.length}`,
        type: 'rect',
        x: Math.random() * (stageSize.width - 100),
        y: Math.random() * (stageSize.height - 50),
        width: 100,
        height: 50,
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
      },
    ];
    saveHistory(newEls);
  };

  const addCircle = () => {
    const newEls = [
      ...elements,
      {
        id: `circle-${elements.length}`,
        type: 'circle',
        x: Math.random() * (stageSize.width - 80),
        y: Math.random() * (stageSize.height - 80),
        radius: 40,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
      },
    ];
    saveHistory(newEls);
  };

  const addText = () => {
    const newEls = [
      ...elements,
      {
        id: `text-${elements.length}`,
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
      },
    ];
    saveHistory(newEls);
  };

  const addImage = () => {
    const newEls = [
      ...elements,
      {
        id: `image-${elements.length}`,
        type: 'image',
        x: Math.random() * (stageSize.width - 200),
        y: Math.random() * (stageSize.height - 200),
        src: 'https://konvajs.org/assets/lion.png', // Ensure this image supports CORS
        draggable: true,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        brightness: 0,
        filters: [],
      },
    ];
    saveHistory(newEls);
  };

  const onSelect = (id) => {
    setSelectedId(id);
  };

  const onDragEnd = (id, newX, newY) => {
    const newEls = elements.map((el) =>
      el.id === id ? { ...el, x: newX, y: newY } : el
    );
    saveHistory(newEls);
  };

  const onTransform = (id, newAttrs) => {
    const newEls = elements.map((el) =>
      el.id === id ? { ...el, ...newAttrs } : el
    );
    saveHistory(newEls);
  };

  const handleTransformEnd = (id) => {
    if (!stageRef.current) return;
    const node = stageRef.current.findOne(`#${id}`);
    if (!node) return;

    const element = elements.find((el) => el.id === id);
    if (!element) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();
    const x = node.x();
    const y = node.y();

    let updatedAttrs = { x, y, rotation };

    if (element.type === 'rect') {
      updatedAttrs.width = Math.max(5, node.width() * scaleX);
      updatedAttrs.height = Math.max(5, node.height() * scaleY);
    } else if (element.type === 'circle') {
      updatedAttrs.radius = Math.max(5, node.radius() * Math.max(scaleX, scaleY));
    } else if (element.type === 'text') {
      updatedAttrs.scaleX = scaleX;
      updatedAttrs.scaleY = scaleY;
    } else if (element.type === 'image') {
      updatedAttrs.width = Math.max(5, node.width() * scaleX);
      updatedAttrs.height = Math.max(5, node.height() * scaleY);
    }

    if (element.type !== 'text') {
      node.scaleX(1);
      node.scaleY(1);
    }

    onTransform(id, updatedAttrs);
  };

  const onEditTextRequest = (id, textNode) => {
    const absPos = textNode.getAbsolutePosition();
    const stageBox = stageRef.current.container().getBoundingClientRect();
    const fontSize = textNode.fontSize();
    const textValue = textNode.text();

    setTextEditing({
      isEditing: true,
      elementId: id,
      value: textValue,
      x: stageBox.left + absPos.x,
      y: stageBox.top + absPos.y,
      fontSize: fontSize,
      nodeWidth: textNode.width() * textNode.scaleX(),
    });

    setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, 0);
  };

  const commitTextEdit = () => {
    if (!textEditing.isEditing) return;
    const { elementId, value } = textEditing;
    onTransform(elementId, { text: value });
    setTextEditing({
      isEditing: false,
      elementId: null,
      value: '',
      x: 0,
      y: 0,
      fontSize: 20,
      nodeWidth: 0,
    });
  };

  const deleteSelectedElement = () => {
    if (!selectedId) return;
    const newEls = elements.filter((el) => el.id !== selectedId);
    saveHistory(newEls);
    setSelectedId(null);
  };

  const [deleteButtonPos, setDeleteButtonPos] = useState(null);

  useEffect(() => {
    if (!selectedId || !stageRef.current) {
      setDeleteButtonPos(null);
      return;
    }
    const node = stageRef.current.findOne(`#${selectedId}`);
    if (!node) {
      setDeleteButtonPos(null);
      return;
    }
    const box = node.getClientRect({ relativeTo: stageRef.current });
    const offset = 10;
    setDeleteButtonPos({
      x: box.x + box.width + offset,
      y: box.y - offset,
    });
  }, [selectedId, elements, stageSize]);

  const selectedElement = elements.find((el) => el.id === selectedId);

  // Property Panel Handlers
  const handleFillChange = (color) => {
    if (!selectedElement) return;
    onTransform(selectedElement.id, { fill: color });
  };

  const handleStrokeChange = (color) => {
    if (!selectedElement) return;
    onTransform(selectedElement.id, { stroke: color });
  };

  const handleStrokeWidthChange = (value) => {
    if (!selectedElement) return;
    onTransform(selectedElement.id, { strokeWidth: value });
  };

  const handleFontFamilyChange = (e) => {
    if (!selectedElement) return;
    onTransform(selectedElement.id, { fontFamily: e.target.value });
  };

  const handleFontSizeChange = (value) => {
    if (!selectedElement) return;
    onTransform(selectedElement.id, { fontSize: value });
  };

  const handleFontColorChange = (color) => {
    if (!selectedElement) return;
    onTransform(selectedElement.id, { fontColor: color });
  };

  const handleAlignChange = (e) => {
    if (!selectedElement) return;
    onTransform(selectedElement.id, { align: e.target.value });
  };

  const handleBoldChange = (e) => {
    if (!selectedElement) return;
    onTransform(selectedElement.id, { bold: e.target.checked });
  };

  const handleItalicChange = (e) => {
    if (!selectedElement) return;
    onTransform(selectedElement.id, { italic: e.target.checked });
  };

  const handleUnderlineChange = (e) => {
    if (!selectedElement) return;
    onTransform(selectedElement.id, { underline: e.target.checked });
  };

  const handleOpacityChange = (e, newValue) => {
    if (!selectedElement) return;
    onTransform(selectedElement.id, { opacity: newValue });
  };

  const handleBrightnessChange = (e, newValue) => {
    if (!selectedElement) return;
    let newFilters = [...(selectedElement.filters || [])];
    const brightnessFilterIndex = newFilters.findIndex(
      (filter) => filter === Konva.Filters.Brightness
    );
    if (newValue !== 0) {
      if (brightnessFilterIndex === -1) {
        newFilters.push(Konva.Filters.Brightness);
      }
    } else {
      if (brightnessFilterIndex !== -1) {
        newFilters.splice(brightnessFilterIndex, 1);
      }
    }
    onTransform(selectedElement.id, {
      brightness: newValue,
      filters: newFilters,
    });
  };

  // Font Families (You can expand this list)
  const fontFamilies = [
    'Calibri',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Verdana',
    'Georgia',
    'Palatino',
    'Garamond',
    'Bookman',
    'Comic Sans MS',
    'Trebuchet MS',
    'Arial Black',
    'Impact',
  ];

  // Save as JPG Handler with Error Handling
  const handleSaveAsJPG = () => {
    if (!stageRef.current) return;
    try {
      const uri = stageRef.current.toDataURL({ pixelRatio: 3, mimeType: 'image/jpeg' });
      // Create a link and trigger download
      const link = document.createElement('a');
      link.download = 'canvas.jpg';
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to save as JPG:', error);
      alert('Unable to save image. Please check the console for more details.');
    }
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item size={2}>
          {/* Control Buttons */}
          <Box sx={{ padding: 1 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={addRectangle}
              sx={{ marginBottom: 2 }}
            >
              Add Rectangle
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={addCircle}
              sx={{ marginBottom: 2 }}
            >
              Add Circle
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={addText}
              sx={{ marginBottom: 2 }}
            >
              Add Text
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={addImage}
              sx={{ marginBottom: 2 }}
            >
              Add Image
            </Button>
            <Divider sx={{ marginY: 2 }} />
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={undo}
              disabled={historyStep <= 0}
              sx={{ marginBottom: 2 }}
            >
              Undo
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={redo}
              disabled={historyStep >= history.length - 1}
              sx={{ marginBottom: 2 }}
            >
              Redo
            </Button>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={handleSaveAsJPG}
              sx={{ marginTop: 2 }}
            >
              Save as JPG
            </Button>
          </Box>

          {/* Properties Submenu */}
          {selectedElement && (
            <Box sx={{ padding: 1 }}>
              <Typography variant="h6" gutterBottom>
                Properties
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />

              {/* Rectangle Properties */}
              {selectedElement.type === 'rect' && (
                <Box>
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
                      onChange={(e, newValue) => handleStrokeWidthChange(newValue)}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Box>
              )}

              {/* Circle Properties */}
              {selectedElement.type === 'circle' && (
                <Box>
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
                      onChange={(e, newValue) => handleStrokeWidthChange(newValue)}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Box>
              )}

              {/* Text Properties */}
              {selectedElement.type === 'text' && (
                <Box>
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
                      onChange={(e, newValue) => handleFontSizeChange(newValue)}
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
                    <Typography gutterBottom>Alignment</Typography>
                    <FormControl fullWidth>
                      <Select
                        value={selectedElement.align}
                        onChange={handleAlignChange}
                      >
                        <MenuItem value="left">Left</MenuItem>
                        <MenuItem value="center">Center</MenuItem>
                        <MenuItem value="right">Right</MenuItem>
                      </Select>
                    </FormControl>
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
                </Box>
              )}

              {/* Image Properties */}
              {selectedElement.type === 'image' && (
                <Box>
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
                  {/* Add more image-related filters as needed */}
                </Box>
              )}
            </Box>
          )}
        </Grid>

        <Grid item size={10} sx={{ position: 'relative' }}>
          <Stage
            ref={stageRef}
            width={stageSize.width}
            height={stageSize.height}
            style={{ border: '1px solid #ddd' }}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) {
                setSelectedId(null);
              }
            }}
            onTouchStart={(e) => {
              if (e.target === e.target.getStage()) {
                setSelectedId(null);
              }
            }}
          >
            {/* Background Layer */}
            <Layer>
              <Rect
                x={0}
                y={0}
                width={stageSize.width}
                height={stageSize.height}
                fill="white" // Set the background color to white
                listening={false} // Make sure background is not interactive
              />
            </Layer>

            {/* Elements Layer */}
            <Layer>
              {elements.map((el) => {
                if (el.type === 'image') {
                  return (
                    <ImageItem
                      key={el.id}
                      element={el}
                      onSelect={onSelect}
                      onTransform={onTransform}
                      onDragEnd={onDragEnd}
                      bringToFront={bringToFront}
                    />
                  );
                }
                return (
                  <ShapeItem
                    key={el.id}
                    element={el}
                    onSelect={onSelect}
                    onTransform={onTransform}
                    onDragEnd={onDragEnd}
                    bringToFront={bringToFront}
                    onEditTextRequest={onEditTextRequest}
                  />
                );
              })}
              <TransformerComponent
                selectedElement={selectedElement}
                onTransformEnd={handleTransformEnd}
                stageRef={stageRef}
              />
              {deleteButtonPos && (
                <Text
                  text="X"
                  fontSize={18}
                  fill="red"
                  x={deleteButtonPos.x}
                  y={deleteButtonPos.y}
                  onClick={deleteSelectedElement}
                  onTap={deleteSelectedElement}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </Layer>
          </Stage>
        </Grid>
      </Grid>

      {/* Text Editing Input */}
      {textEditing.isEditing && (
        <input
          ref={textInputRef}
          value={textEditing.value}
          onChange={(e) =>
            setTextEditing((prev) => ({ ...prev, value: e.target.value }))
          }
          style={{
            position: 'absolute',
            top: textEditing.y + 'px',
            left: textEditing.x + 'px',
            fontSize: textEditing.fontSize,
            width: Math.max(textEditing.nodeWidth, 50),
            border: '1px solid #ccc',
            background: 'transparent',
            color: selectedElement?.fontColor || '#000000',
          }}
          onBlur={commitTextEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              commitTextEdit();
            }
          }}
        />
      )}
    </>
  );
};

export default ImageEditor;
