// components/imageEditor/ImageEditor.jsx
import React, { useState, useRef, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useHistory } from './hooks/useHistory';
import StageView from './components/StageView';
import ControlPanel from './components/ControlPanel';

const ImageEditor = () => {
  const stageRef = useRef();

  const [elements, setElements, saveHistory, undo, redo, historyStep, history] = useHistory([]);
  const [selectedId, setSelectedId] = useState(null);
  const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  // Text editing state
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

  // Bring element to front
  const bringToFront = (id) => {
    const elIndex = elements.findIndex((el) => el.id === id);
    if (elIndex === -1) return;
    if (elIndex === elements.length - 1) return;
    const newEls = [...elements];
    const [item] = newEls.splice(elIndex, 1);
    newEls.push(item);
    saveHistory(newEls);
  };

  // CRUD for elements
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
      <Grid container spacing={1}>
        <Grid item>
          <ControlPanel
            selectedElement={selectedElement}
            onTransform={onTransform}
            undo={undo}
            redo={redo}
            historyStep={historyStep}
            historyLength={history.length}
            addElement={addElement}
            handleSaveAsJPG={handleSaveAsJPG}
            stageSize={stageSize}
          />
        </Grid>

        <Grid item xs sx={{ position: 'relative' }}>
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
