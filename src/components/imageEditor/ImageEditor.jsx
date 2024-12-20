import React, { useState, useRef, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { useHistory } from './hooks/useHistory';
import StageView from './components/StageView';
import TopAppBar from './components/controlpanel/TopAppBar';
import LeftDrawer from './components/controlpanel/LeftDrawer';
import RightDrawer from './components/controlpanel/RightDrawer';

const ImageEditor = () => {
  const stageRef = useRef();

  const [elements, setElements, saveHistory, undo, redo, historyStep, history] = useHistory([]);
  const [selectedId, setSelectedId] = useState(null);
  const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });

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

  // Responsive stage size
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

  // Keyboard delete
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedId) deleteSelectedElement();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  const bringToFront = (id) => {
    const elIndex = elements.findIndex((el) => el.id === id);
    if (elIndex === -1) return;
    if (elIndex === elements.length - 1) return;
    const newEls = [...elements];
    const [item] = newEls.splice(elIndex, 1);
    newEls.push(item);
    saveHistory(newEls);
  };

  const addElement = (newElement) => {
    saveHistory([...elements, newElement]);
  };

  const onSelect = (id) => {
    setSelectedId(id);
  };

  const onDragEnd = (id, newX, newY) => {
    const newEls = elements.map((el) => (el.id === id ? { ...el, x: newX, y: newY } : el));
    saveHistory(newEls);
  };

  const onTransform = (id, newAttrs) => {
    const newEls = elements.map((el) => (el.id === id ? { ...el, ...newAttrs } : el));
    saveHistory(newEls);
  };

  const deleteSelectedElement = () => {
    if (!selectedId) return;
    const newEls = elements.filter((el) => el.id !== selectedId);
    saveHistory(newEls);
    setSelectedId(null);
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
    setTimeout(() => textInputRef.current && textInputRef.current.focus(), 0);
  };

  const commitTextEdit = () => {
    if (!textEditing.isEditing) return;
    const { elementId, value } = textEditing;
    onTransform(elementId, { text: value });
    setTextEditing({
      isEditing: false, elementId: null, value: '', x: 0, y: 0, fontSize: 20, nodeWidth: 0,
    });
  };

  const handleSaveAsJPG = () => {
    if (!stageRef.current) return;
    try {
      const uri = stageRef.current.toDataURL({ pixelRatio: 3, mimeType: 'image/jpeg' });
      const link = document.createElement('a');
      link.download = 'canvas.jpg';
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Unable to save image. Check console for details.');
      console.error('Failed to save as JPG:', error);
    }
  };

  const selectedElement = elements.find((el) => el.id === selectedId);

  return (
    <>
      <Paper elevation={0}>
        <Grid container spacing={1}>
          {/* Left Drawer */}
          <Grid item size={2} sx={{ border: 1 }}>
            <LeftDrawer addElement={addElement} />
          </Grid>
  
          {/* Middle Section: TopAppBar + Stage */}
          <Grid item size={8} container direction="column" sx={{ border: 1 }}>
            {/* Top AppBar */}
            <Grid item sx={{ border: 1 }}>
              <TopAppBar
                undo={undo}
                redo={redo}
                handleSaveAsJPG={handleSaveAsJPG}
                historyStep={historyStep}
                historyLength={history.length}
              />
            </Grid>
  
            {/* Stage View */}
            <Grid item  sx={{ border: 1 }}>
              <StageView
                stageRef={stageRef}
                elements={elements}
                onSelect={onSelect}
                onDragEnd={onDragEnd}
                onTransform={onTransform}
                bringToFront={bringToFront}
                selectedElement={selectedElement}
                setSelectedId={setSelectedId}
                deleteSelectedElement={deleteSelectedElement}
                onEditTextRequest={onEditTextRequest}
                stageSize={stageSize}
              />
            </Grid>
          </Grid>
  
          {/* Right Drawer */}
          <Grid item size={2} sx={{ border: 1 }}>
            <RightDrawer selectedElement={selectedElement} onTransform={onTransform} />
          </Grid>
        </Grid>
      </Paper>
  
      {/* Text Editing Input */}
      {textEditing.isEditing && (
        <input
          ref={textInputRef}
          value={textEditing.value}
          onChange={(e) => setTextEditing((prev) => ({ ...prev, value: e.target.value }))}
          style={{
            position: 'absolute',
            top: textEditing.y,
            left: textEditing.x,
            fontSize: textEditing.fontSize,
            width: Math.max(textEditing.nodeWidth, 50),
            border: '1px solid #ccc',
            background: 'transparent',
            color: selectedElement?.fontColor || '#000000',
          }}
          onBlur={commitTextEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitTextEdit();
          }}
        />
      )}
    </>
  );
  
};

export default ImageEditor;
