// components/imageEditor/components/transformers/TransformerComponent.jsx
import React, { useRef, useEffect } from 'react';
import { Transformer } from 'react-konva';

const TransformerComponent = ({ selectedElement, onTransformEnd, stageRef }) => {
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

export default TransformerComponent;
