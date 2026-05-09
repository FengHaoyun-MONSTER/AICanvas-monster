import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { useCanvasStore } from '../../store/useCanvasStore';
import { ImageNode } from './ImageNode';
import { GridTable } from './GridTable';
import { TextNode } from './TextNode';
import { ShapeNode } from './ShapeNode';
import { DrawingLine } from './DrawingLine';

const MIN_SCALE = 0.15;
const MAX_SCALE = 3;
const SCALE_BY = 1.08;

let _lineUid = Date.now();

export const StageViewer: React.FC = () => {
  const {
    layers, selectedId, setSelected,
    tables, texts, shapes, lines,
    stageScale, stagePos, setStageScale, setStagePos,
    toolMode, deleteSelected,
  } = useCanvasStore();

  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isDragging = useRef(false);

  // For freehand / arrow drawing
  const isDrawing = useRef(false);
  const currentLineId = useRef<string | null>(null);

  // Responsive sizing
  useEffect(() => {
    const check = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Keyboard shortcut: Delete selected
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        // Don't delete if user is in an input/textarea
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        deleteSelected();
      }
      // Tool shortcuts
      if (e.key === 'v' || e.key === 'V') useCanvasStore.getState().setToolMode('select');
      if (e.key === 'h' || e.key === 'H') useCanvasStore.getState().setToolMode('hand');
      if (e.key === 't' || e.key === 'T') {
        const tag = (e.target as HTMLElement).tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          useCanvasStore.getState().setToolMode('text');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, deleteSelected]);

  // Wheel zoom
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    let newScale = direction > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

    setStageScale(newScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  /** Convert pointer position to canvas coordinates */
  const pointerToCanvas = () => {
    const stage = stageRef.current;
    if (!stage) return null;
    const pointer = stage.getPointerPosition();
    if (!pointer) return null;
    const scale = stage.scaleX();
    return {
      x: (pointer.x - stage.x()) / scale,
      y: (pointer.y - stage.y()) / scale,
    };
  };

  // ── Mouse handlers for drawing tools ──
  const handleMouseDown = () => {
    isDragging.current = false;
    const state = useCanvasStore.getState();
    const pos = pointerToCanvas();
    if (!pos) return;

    // Freehand drawing start
    if (state.toolMode === 'pencil') {
      isDrawing.current = true;
      const id = `line-${_lineUid++}`;
      currentLineId.current = id;
      state.addLine({
        id,
        points: [pos.x, pos.y],
        stroke: '#1e1e2e',
        strokeWidth: 2,
        type: 'freehand',
      });
      return;
    }

    // Arrow drawing start
    if (state.toolMode === 'arrow') {
      isDrawing.current = true;
      const id = `arrow-${_lineUid++}`;
      currentLineId.current = id;
      state.addLine({
        id,
        points: [pos.x, pos.y, pos.x, pos.y],
        stroke: '#1e1e2e',
        strokeWidth: 2,
        type: 'arrow',
      });
      return;
    }
  };

  const handleMouseMove = () => {
    if (!isDrawing.current || !currentLineId.current) return;
    const pos = pointerToCanvas();
    if (!pos) return;
    const state = useCanvasStore.getState();
    const line = state.lines.find(l => l.id === currentLineId.current);
    if (!line) return;

    if (line.type === 'freehand') {
      state.updateLine(line.id, { points: [...line.points, pos.x, pos.y] });
    } else if (line.type === 'arrow') {
      // Update end point only
      const pts = [...line.points];
      pts[2] = pos.x;
      pts[3] = pos.y;
      state.updateLine(line.id, { points: pts });
    }
  };

  const handleMouseUp = (e: any) => {
    // End drawing
    if (isDrawing.current) {
      isDrawing.current = false;
      currentLineId.current = null;
      return;
    }

    if (isDragging.current) return;
    const state = useCanvasStore.getState();
    const pos = pointerToCanvas();
    if (!pos) return;

    // Text tool: click to place text
    if (state.toolMode === 'text') {
      state.addText(pos.x, pos.y);
      return;
    }

    // Shape tool: click to place shape
    if (state.toolMode === 'shape') {
      state.addShape(pos.x, pos.y);
      return;
    }

    // Create table on click
    if (state.toolMode === 'createTable') {
      state.addTable(pos.x, pos.y);
      return;
    }

    // Click on empty = deselect
    const clickedOnEmpty =
      e.target === e.target.getStage() || e.target.hasName('bg-rect');
    if (clickedOnEmpty) {
      setSelected(null);
    }
  };

  // Cursor style
  const cursorMap: Record<string, string> = {
    select: 'default',
    hand: 'grab',
    text: 'text',
    shape: 'crosshair',
    pencil: 'crosshair',
    arrow: 'crosshair',
    createTable: 'crosshair',
    image: 'default',
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: cursorMap[toolMode] || 'default',
        background: '#e8e8ee',
        backgroundImage: 'radial-gradient(circle, #d4d4dc 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragStart={() => { isDragging.current = true; }}
        ref={stageRef}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        draggable={toolMode === 'select' || toolMode === 'hand'}
        onDragEnd={() => {
          const stage = stageRef.current;
          if (stage) setStagePos({ x: stage.x(), y: stage.y() });
        }}
      >
        <Layer>
          {/* Invisible click-capture rect */}
          <Rect
            x={-10000}
            y={-10000}
            width={20000}
            height={20000}
            fill="rgba(0,0,0,0.001)"
            name="bg-rect"
          />

          {/* ── Shapes ── */}
          {shapes.map((sh) => (
            <ShapeNode
              key={sh.id}
              node={sh}
              isSelected={sh.id === selectedId}
              onSelect={() => setSelected(sh.id)}
            />
          ))}

          {/* ── Lines & Arrows ── */}
          {lines.map((ln) => (
            <DrawingLine
              key={ln.id}
              node={ln}
              isSelected={ln.id === selectedId}
              onSelect={() => setSelected(ln.id)}
            />
          ))}

          {/* ── Tables ── */}
          {tables.map((t) => (
            <GridTable key={t.id} table={t} />
          ))}

          {/* ── Images ── */}
          {layers.map((layer) => (
            <ImageNode
              key={layer.id}
              layer={layer}
              isSelected={layer.id === selectedId}
              onSelect={() => setSelected(layer.id)}
            />
          ))}

          {/* ── Texts (render last for z-order) ── */}
          {texts.map((t) => (
            <TextNode
              key={t.id}
              node={t}
              isSelected={t.id === selectedId}
              onSelect={() => setSelected(t.id)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};
