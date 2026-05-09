import React, { useRef, useEffect } from 'react';
import { Rect, Circle, Transformer } from 'react-konva';
import { type CanvasShape, useCanvasStore } from '../../store/useCanvasStore';

interface Props {
  node: CanvasShape;
  isSelected: boolean;
  onSelect: () => void;
}

export const ShapeNode: React.FC<Props> = ({ node, isSelected, onSelect }) => {
  const { updateShape } = useCanvasStore();
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const commonProps = {
    ref: shapeRef,
    id: node.id,
    fill: node.fill,
    stroke: node.stroke,
    strokeWidth: node.strokeWidth,
    rotation: node.rotation,
    draggable: true,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: (e: any) => {
      updateShape(node.id, { x: e.target.x(), y: e.target.y() });
    },
    onTransformEnd: () => {
      const n = shapeRef.current;
      if (!n) return;
      const scaleX = n.scaleX();
      const scaleY = n.scaleY();
      updateShape(node.id, {
        x: n.x(),
        y: n.y(),
        width: Math.max(10, node.width * scaleX),
        height: Math.max(10, node.height * scaleY),
        rotation: n.rotation(),
      });
      n.scaleX(1);
      n.scaleY(1);
    },
  };

  return (
    <>
      {node.type === 'rect' && (
        <Rect
          {...commonProps}
          x={node.x}
          y={node.y}
          width={node.width}
          height={node.height}
          cornerRadius={node.cornerRadius}
        />
      )}
      {node.type === 'circle' && (
        <Circle
          {...commonProps}
          x={node.x + node.width / 2}
          y={node.y + node.height / 2}
          radius={Math.min(node.width, node.height) / 2}
        />
      )}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) return oldBox;
            return newBox;
          }}
          borderStroke="#8b5cf6"
          anchorStroke="#8b5cf6"
          anchorFill="white"
          anchorSize={8}
          anchorCornerRadius={2}
        />
      )}
    </>
  );
};
