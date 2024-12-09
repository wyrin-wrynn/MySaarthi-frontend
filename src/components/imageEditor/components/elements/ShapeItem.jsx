// components/imageEditor/components/elements/ShapeItem.jsx
import React from 'react';
import { Rect, Circle, Text } from 'react-konva';

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
    onClick: () => { onSelect(element.id); bringToFront(element.id); },
    onTap: () => { onSelect(element.id); bringToFront(element.id); },
    onDragStart: () => bringToFront(element.id),
    onDragEnd: (e) => onDragEnd(element.id, e.target.x(), e.target.y()),
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
        fontStyle={`${element.bold ? 'bold ' : ''}${element.italic ? 'italic ' : ''}${element.underline ? 'underline' : ''}`}
        scaleX={element.scaleX || 1}
        scaleY={element.scaleY || 1}
        onDblClick={(e) => onEditTextRequest(element.id, e.target)}
        onDblTap={(e) => onEditTextRequest(element.id, e.target)}
      />
    );
  }

  return null;
};

export default ShapeItem;
