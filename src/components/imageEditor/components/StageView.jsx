import React, { useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import ImageItem from './elements/ImageItem';
import ShapeItem from './elements/ShapeItem';
import TransformerComponent from './transformers/TransformerComponent';
import { Box } from '@mui/material';

const FIXED_WIDTH = 720;
const FIXED_HEIGHT = 1280;

const StageView = ({
  stageRef,
  elements,
  onSelect,
  onDragEnd,
  onTransform,
  bringToFront,
  selectedElement,
  setSelectedId,
  deleteSelectedElement,
  onEditTextRequest,
}) => {
  const [deleteButtonPos, setDeleteButtonPos] = useState(null);

  useEffect(() => {
    if (!selectedElement || !stageRef.current) {
      setDeleteButtonPos(null);
      return;
    }
    const node = stageRef.current.findOne(`#${selectedElement.id}`);
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
  }, [selectedElement, elements]);

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

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0', // Optional background for better contrast
        border: '2px solid #ccc',
        boxSizing: 'border-box',
        padding: 2,
        overflow: 'hidden',
      }}
    >
      <Stage
        ref={stageRef}
        width={FIXED_WIDTH}
        height={FIXED_HEIGHT}
        style={{
          border: '1px solid #000',
          backgroundColor: 'white',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) setSelectedId(null);
        }}
        onTouchStart={(e) => {
          if (e.target === e.target.getStage()) setSelectedId(null);
        }}
      >
        <Layer>
          <Rect x={0} y={0} width={FIXED_WIDTH} height={FIXED_HEIGHT} fill="white" listening={false} />
        </Layer>

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
    </Box>
  );
};

export default StageView;
