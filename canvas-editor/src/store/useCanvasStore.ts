import { create } from 'zustand';

/* ───────── Types ───────── */

export interface TableCell {
  row: number;
  col: number;
  type: 'upload' | 'prompt' | 'result' | 'header';
  content?: string;
  imageUrl?: string;
  isGenerating?: boolean;
}

export interface CanvasTable {
  id: string;
  x: number;
  y: number;
  cells: TableCell[];
  rows: number;
  cols: number;
}

export interface ImageLayer {
  id: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

/* ── Phase 2: New element types ── */

export interface CanvasText {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  width: number;
  rotation: number;
}

export interface CanvasShape {
  id: string;
  type: 'rect' | 'circle' | 'ellipse';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  rotation: number;
  cornerRadius: number;
}

export interface CanvasLine {
  id: string;
  points: number[];  // [x1,y1, x2,y2, ...]
  stroke: string;
  strokeWidth: number;
  type: 'freehand' | 'arrow' | 'line';
  closed?: boolean;
}

export type ToolMode =
  | 'select' | 'hand' | 'createTable'
  | 'text' | 'shape' | 'pencil' | 'arrow' | 'image';

export type PanelType = 'aiImage' | 'aiVideo' | 'aiChat' | 'automation' | null;

interface CanvasState {
  /* Canvas viewport */
  stageScale: number;
  stagePos: { x: number; y: number };
  setStageScale: (s: number) => void;
  setStagePos: (p: { x: number; y: number }) => void;

  /* Tool mode */
  toolMode: ToolMode;
  setToolMode: (m: ToolMode) => void;

  /* Selection */
  selectedId: string | null;
  setSelected: (id: string | null) => void;

  /* Image layers */
  layers: ImageLayer[];
  addLayer: (layer: ImageLayer) => void;
  updateLayer: (id: string, attrs: Partial<ImageLayer>) => void;

  /* Background */
  bgType: 'transparent' | 'white';
  setBgType: (type: 'transparent' | 'white') => void;

  /* Tables */
  tables: CanvasTable[];
  addTable: (x: number, y: number) => void;
  addTableAtCenter: () => void;
  addTableRow: (tableId: string) => void;
  updateCell: (tableId: string, row: number, col: number, attrs: Partial<TableCell>) => void;
  generateImage: (tableId: string, row: number) => Promise<void>;

  /* Phase 2: Texts */
  texts: CanvasText[];
  addText: (x: number, y: number) => void;
  updateText: (id: string, attrs: Partial<CanvasText>) => void;
  deleteText: (id: string) => void;

  /* Phase 2: Shapes */
  shapes: CanvasShape[];
  addShape: (x: number, y: number) => void;
  updateShape: (id: string, attrs: Partial<CanvasShape>) => void;
  deleteShape: (id: string) => void;

  /* Phase 2: Lines (freehand + arrows) */
  lines: CanvasLine[];
  addLine: (line: CanvasLine) => void;
  updateLine: (id: string, attrs: Partial<CanvasLine>) => void;
  deleteLine: (id: string) => void;

  /* Phase 2: Image upload from toolbar */
  triggerImageUpload: () => void;

  /* Delete selected element */
  deleteSelected: () => void;

  /* Phase 3: Panel */
  activePanel: PanelType;
  setActivePanel: (p: PanelType) => void;
  togglePanel: (p: Exclude<PanelType, null>) => void;
}

/* ───────── Helpers ───────── */

function createDefaultCells(startRow: number = 0, rowCount: number = 4): TableCell[] {
  const cells: TableCell[] = [];
  cells.push({ row: 0, col: 0, type: 'header', content: '上传白底图（批量上传）' });
  cells.push({ row: 0, col: 1, type: 'header', content: '处理要求' });
  cells.push({ row: 0, col: 2, type: 'header', content: '生成与下载' });
  for (let r = 1; r < rowCount; r++) {
    cells.push({ row: r, col: 0, type: 'upload' });
    cells.push({
      row: r, col: 1, type: 'prompt',
      content: 'You are an expert e-commerce image prompt engineer.\nBased on the product visible in the image, write ONE structured English prompt for an AI image generator (GPT-Image / Nano Banana pro) to produce a clean WHITE-BACKGROUND main image.\n\nFormat strictly:\n> **Subject:** Professional product photography of [identified product], [color/material], centered...'
    });
    cells.push({ row: r, col: 2, type: 'result' });
  }
  return cells;
}

let _uid = Date.now();
const uid = (prefix: string) => `${prefix}-${_uid++}`;

/* ───────── Store ───────── */

export const useCanvasStore = create<CanvasState>((set, get) => ({
  /* Canvas viewport */
  stageScale: 1,
  stagePos: { x: 0, y: 0 },
  setStageScale: (s) => set({ stageScale: s }),
  setStagePos: (p) => set({ stagePos: p }),

  /* Tool mode */
  toolMode: 'select',
  setToolMode: (m) => set({ toolMode: m }),

  /* Selection */
  selectedId: null,
  setSelected: (id) => set({ selectedId: id }),

  /* Image layers */
  layers: [],
  addLayer: (layer) => set((s) => ({ layers: [...s.layers, layer] })),
  updateLayer: (id, attrs) => set((s) => ({
    layers: s.layers.map(l => l.id === id ? { ...l, ...attrs } : l)
  })),

  /* Background */
  bgType: 'white',
  setBgType: (type) => set({ bgType: type }),

  /* Tables */
  tables: [],

  addTable: (x, y) => {
    const table: CanvasTable = {
      id: uid('table'),
      x, y,
      rows: 4, cols: 3,
      cells: createDefaultCells(0, 4)
    };
    set((s) => ({ tables: [...s.tables, table], toolMode: 'select' }));
  },

  addTableAtCenter: () => {
    const { stageScale, stagePos } = get();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const centerX = (viewportW / 2 - stagePos.x) / stageScale;
    const centerY = (viewportH / 2 - stagePos.y) / stageScale;
    get().addTable(centerX - 440, centerY - 330);
  },

  addTableRow: (tableId) => {
    set((s) => ({
      tables: s.tables.map(t => {
        if (t.id !== tableId) return t;
        const newRow = t.rows;
        const newCells: TableCell[] = [
          { row: newRow, col: 0, type: 'upload' },
          { row: newRow, col: 1, type: 'prompt', content: 'You are an expert e-commerce image prompt engineer...' },
          { row: newRow, col: 2, type: 'result' }
        ];
        return { ...t, rows: t.rows + 1, cells: [...t.cells, ...newCells] };
      })
    }));
  },

  updateCell: (tableId, row, col, attrs) => set((s) => ({
    tables: s.tables.map(t => {
      if (t.id !== tableId) return t;
      return { ...t, cells: t.cells.map(c => (c.row === row && c.col === col) ? { ...c, ...attrs } : c) };
    })
  })),

  generateImage: async (tableId, row) => {
    set((s) => ({
      tables: s.tables.map(t => {
        if (t.id !== tableId) return t;
        return { ...t, cells: t.cells.map(c => (c.row === row && c.col === 2) ? { ...c, isGenerating: true } : c) };
      })
    }));
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockResults = [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200'
    ];
    set((s) => ({
      tables: s.tables.map(t => {
        if (t.id !== tableId) return t;
        return {
          ...t,
          cells: t.cells.map(c => (c.row === row && c.col === 2) ? {
            ...c, isGenerating: false,
            imageUrl: mockResults[Math.floor(Math.random() * mockResults.length)]
          } : c)
        };
      })
    }));
  },

  /* ── Phase 2: Texts ── */
  texts: [],

  addText: (x, y) => {
    const text: CanvasText = {
      id: uid('text'),
      x, y,
      text: '双击编辑文字',
      fontSize: 20,
      fontFamily: 'Inter, sans-serif',
      fill: '#1e1e2e',
      width: 200,
      rotation: 0,
    };
    set((s) => ({ texts: [...s.texts, text], selectedId: text.id, toolMode: 'select' }));
  },

  updateText: (id, attrs) => set((s) => ({
    texts: s.texts.map(t => t.id === id ? { ...t, ...attrs } : t)
  })),

  deleteText: (id) => set((s) => ({
    texts: s.texts.filter(t => t.id !== id)
  })),

  /* ── Phase 2: Shapes ── */
  shapes: [],

  addShape: (x, y) => {
    const shape: CanvasShape = {
      id: uid('shape'),
      type: 'rect',
      x, y,
      width: 160,
      height: 120,
      fill: 'rgba(139, 92, 246, 0.15)',
      stroke: '#8b5cf6',
      strokeWidth: 2,
      rotation: 0,
      cornerRadius: 8,
    };
    set((s) => ({ shapes: [...s.shapes, shape], selectedId: shape.id, toolMode: 'select' }));
  },

  updateShape: (id, attrs) => set((s) => ({
    shapes: s.shapes.map(sh => sh.id === id ? { ...sh, ...attrs } : sh)
  })),

  deleteShape: (id) => set((s) => ({
    shapes: s.shapes.filter(sh => sh.id !== id)
  })),

  /* ── Phase 2: Lines ── */
  lines: [],

  addLine: (line) => set((s) => ({
    lines: [...s.lines, line],
    toolMode: line.type === 'freehand' ? s.toolMode : 'select',
  })),

  updateLine: (id, attrs) => set((s) => ({
    lines: s.lines.map(l => l.id === id ? { ...l, ...attrs } : l)
  })),

  deleteLine: (id) => set((s) => ({
    lines: s.lines.filter(l => l.id !== id)
  })),

  /* ── Phase 2: Image upload trigger ── */
  triggerImageUpload: () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        const { stageScale, stagePos } = get();
        const vW = window.innerWidth;
        const vH = window.innerHeight;
        const cx = (vW / 2 - stagePos.x) / stageScale;
        const cy = (vH / 2 - stagePos.y) / stageScale;
        const w = img.width > 500 ? 500 : img.width;
        const h = img.width > 500 ? (img.height * 500) / img.width : img.height;
        const layer: ImageLayer = {
          id: uid('img'),
          url,
          x: cx - w / 2,
          y: cy - h / 2,
          width: w, height: h,
          rotation: 0, scaleX: 1, scaleY: 1
        };
        set((s) => ({ layers: [...s.layers, layer], selectedId: layer.id, toolMode: 'select' }));
      };
      img.src = url;
    };
    input.click();
  },

  /* ── Delete selected element ── */
  deleteSelected: () => {
    const { selectedId } = get();
    if (!selectedId) return;
    set((s) => ({
      selectedId: null,
      texts: s.texts.filter(t => t.id !== selectedId),
      shapes: s.shapes.filter(sh => sh.id !== selectedId),
      lines: s.lines.filter(l => l.id !== selectedId),
      layers: s.layers.filter(l => l.id !== selectedId),
    }));
  },

  /* ── Phase 3: Panel state ── */
  activePanel: null,
  setActivePanel: (p) => set({ activePanel: p }),
  togglePanel: (p) => set((s) => ({ activePanel: s.activePanel === p ? null : p })),
}));
