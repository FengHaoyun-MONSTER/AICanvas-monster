import React from 'react';
import { Line, Arrow } from 'react-konva';
import { type CanvasLine, useCanvasStore } from '../../store/useCanvasStore';

interface Props {
  node: CanvasLine;
  isSelected: boolean;
  onSelect: () => void;
}

export const DrawingLine: React.FC<Props> = ({ node, isSelected, onSelect }) => {
  const { updateLine } = useCanvasStore();

  if (node.type === 'arrow') {
    return (
      <Arrow
        id={node.id}
        points={node.points}
        stroke={node.stroke}
        strokeWidth={node.strokeWidth}
        fill={node.stroke}
        pointerLength={10}
        pointerWidth={8}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          // Offset all points by the drag delta
          const dx = e.target.x();
          const dy = e.target.y();
          const newPoints = node.points.map((v, i) => i % 2 === 0 ? v + dx : v + dy);
          updateLine(node.id, { points: newPoints });
          e.target.position({ x: 0, y: 0 });
        }}
        hitStrokeWidth={12}
        shadowForStrokeEnabled={false}
        shadowColor={isSelected ? '#8b5cf6' : undefined}
        shadowBlur={isSelected ? 6 : 0}
        shadowOpacity={isSelected ? 0.5 : 0}
      />
    );
  }

  // Freehand or line
  return (
    <Line
      id={node.id}
      points={node.points}
      stroke={node.stroke}
      strokeWidth={node.strokeWidth}
      lineCap="round"
      lineJoin="round"
      tension={node.type === 'freehand' ? 0.3 : 0}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        const dx = e.target.x();
        const dy = e.target.y();
        const newPoints = node.points.map((v, i) => i % 2 === 0 ? v + dx : v + dy);
        updateLine(node.id, { points: newPoints });
        e.target.position({ x: 0, y: 0 });
      }}
      hitStrokeWidth={12}
      shadowColor={isSelected ? '#8b5cf6' : undefined}
      shadowBlur={isSelected ? 6 : 0}
      shadowOpacity={isSelected ? 0.5 : 0}
    />
  );
};
