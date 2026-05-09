import React, { useRef, useState, useEffect } from 'react';
import { Text, Transformer, Group } from 'react-konva';
import { Html } from 'react-konva-utils';
import { type CanvasText, useCanvasStore } from '../../store/useCanvasStore';

interface Props {
  node: CanvasText;
  isSelected: boolean;
  onSelect: () => void;
}

export const TextNode: React.FC<Props> = ({ node, isSelected, onSelect }) => {
  const { updateText } = useCanvasStore();
  const textRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Attach transformer when selected
  useEffect(() => {
    if (isSelected && trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDblClick = () => {
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <Group x={node.x} y={node.y}>
        <Html divProps={{ style: { pointerEvents: 'auto' } }}>
          <textarea
            autoFocus
            defaultValue={node.text}
            style={{
              width: Math.max(node.width, 200),
              minHeight: '40px',
              fontSize: `${node.fontSize}px`,
              fontFamily: node.fontFamily,
              color: node.fill,
              border: '2px solid #8b5cf6',
              borderRadius: '4px',
              outline: 'none',
              padding: '4px 8px',
              background: 'white',
              resize: 'both',
              lineHeight: '1.4',
              boxShadow: '0 2px 12px rgba(139,92,246,0.2)',
            }}
            onBlur={(e) => {
              updateText(node.id, { text: e.target.value });
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                updateText(node.id, { text: (e.target as HTMLTextAreaElement).value });
                setIsEditing(false);
              }
            }}
          />
        </Html>
      </Group>
    );
  }

  return (
    <>
      <Text
        ref={textRef}
        id={node.id}
        x={node.x}
        y={node.y}
        text={node.text}
        fontSize={node.fontSize}
        fontFamily={node.fontFamily}
        fill={node.fill}
        width={node.width}
        rotation={node.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={handleDblClick}
        onDblTap={handleDblClick}
        onDragEnd={(e) => {
          updateText(node.id, {
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const n = textRef.current;
          if (!n) return;
          updateText(node.id, {
            x: n.x(),
            y: n.y(),
            width: Math.max(n.width() * n.scaleX(), 20),
            fontSize: Math.max(node.fontSize * n.scaleY(), 8),
            rotation: n.rotation(),
          });
          n.scaleX(1);
          n.scaleY(1);
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 20 || Math.abs(newBox.height) < 20) return oldBox;
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
