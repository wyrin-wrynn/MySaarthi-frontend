// components/imageEditor/components/elements/ImageItem.jsx
import React, { useEffect } from 'react';
import { Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';

const ImageItem = ({ element, onSelect, onTransform, onDragEnd, bringToFront }) => {
  const [img] = useImage(element.src, 'Anonymous');
  const { id, x, y, draggable, scaleX, scaleY, width, height, opacity, brightness, filters } = element;

  useEffect(() => {
    if (img && (!element.width || !element.height)) {
      onTransform(id, { width: img.width, height: img.height });
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
      filters={(filters || []).map((f) => (f === 'Brightness' ? Konva.Filters.Brightness : f))}
      brightness={brightness || 0}
      draggable={draggable}
      onClick={() => { onSelect(id); bringToFront(id); }}
      onTap={() => { onSelect(id); bringToFront(id); }}
      onDragStart={() => bringToFront(id)}
      onDragEnd={(e) => onDragEnd(id, e.target.x(), e.target.y())}
    />
  );
};

export default ImageItem;
