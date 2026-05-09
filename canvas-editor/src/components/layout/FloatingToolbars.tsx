import React, { useState, useCallback, useEffect } from 'react';
import {
  MousePointer2, Hand, Pentagon, Pencil, Square, Type,
  Image, ArrowRight, Grid, Zap, Clapperboard, Bot,
  Wand2, Undo2, Redo2, Minus, Plus, Layers,
  History, HelpCircle
} from 'lucide-react';
import { Tooltip } from 'antd';
import { useCanvasStore } from '../../store/useCanvasStore';

export const FloatingToolbars: React.FC = () => {
  const {
    toolMode, setToolMode, stageScale, setStageScale,
    addTableAtCenter, triggerImageUpload,
    togglePanel, activePanel
  } = useCanvasStore();

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 1500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showComingSoon = useCallback(() => {
    setToast('功能即将上线，敬请期待！');
  }, []);

  const handleZoomIn = () => setStageScale(Math.min(3, stageScale * 1.2));
  const handleZoomOut = () => setStageScale(Math.max(0.15, stageScale / 1.2));
  const handleZoomReset = () => setStageScale(1);

  // Tool definitions — Phase 2: wired to real actions
  const tools: Array<{
    id: string;
    icon: React.ReactNode;
    label: string;
    action: () => void;
  }> = [
    { id: 'select',   icon: <MousePointer2 size={18} />, label: '选择 (V)',      action: () => setToolMode('select') },
    { id: 'hand',     icon: <Hand size={18} />,          label: '拖拽画布 (H)',   action: () => setToolMode('hand') },
    { id: 'lasso',    icon: <Pentagon size={18} />,      label: '套索选择',       action: showComingSoon },
    { id: 'pencil',   icon: <Pencil size={18} />,        label: '画笔',          action: () => setToolMode('pencil') },
    { id: 'shape',    icon: <Square size={18} />,        label: '形状',          action: () => setToolMode('shape') },
    { id: 'text',     icon: <Type size={18} />,          label: '文字 (T)',      action: () => setToolMode('text') },
    { id: 'image',    icon: <Image size={18} />,         label: '图片',          action: () => triggerImageUpload() },
    { id: 'arrow',    icon: <ArrowRight size={18} />,    label: '连接线',        action: () => setToolMode('arrow') },
    // ── divider ──
    { id: 'createTable', icon: <Grid size={18} />,       label: '超级表格',      action: () => addTableAtCenter() },
    { id: 'automation',  icon: <Zap size={18} />,        label: '自动化',        action: () => togglePanel('automation') },
    { id: 'aiImage',     icon: <Image size={18} />,      label: 'AI 图片生成',   action: () => togglePanel('aiImage') },
    { id: 'aiVideo',     icon: <Clapperboard size={18} />, label: 'AI 视频生成', action: () => togglePanel('aiVideo') },
    { id: 'aiBot',       icon: <Bot size={18} />,        label: 'AI 助手',       action: () => togglePanel('aiChat') },
    { id: 'magic',       icon: <Wand2 size={18} />,      label: '魔法修复',      action: showComingSoon },
  ];

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      {/* ──── Bottom Toolbar ──── */}
      <div className="bottom-toolbar">
        {tools.map((tool, index) => (
          <React.Fragment key={tool.id}>
            {index === 2 && <div className="tool-divider" />}
            {index === 8 && <div className="tool-divider" />}
            <Tooltip title={tool.label} placement="top">
              <button
                className={`tool-btn ${
                  toolMode === tool.id ? 'active' :
                  (tool.id === 'automation' && activePanel === 'automation') ? 'active' :
                  (tool.id === 'aiImage' && activePanel === 'aiImage') ? 'active' :
                  (tool.id === 'aiVideo' && activePanel === 'aiVideo') ? 'active' :
                  (tool.id === 'aiBot' && activePanel === 'aiChat') ? 'active' :
                  ''
                }`}
                onClick={tool.action}
              >
                {tool.icon}
              </button>
            </Tooltip>
          </React.Fragment>
        ))}
      </div>

      {/* ──── Bottom-Right Controls ──── */}
      <div className="bottom-right-controls">
        <div className="control-group">
          <Tooltip title="撤销" placement="top">
            <button className="tool-btn" onClick={showComingSoon}><Undo2 size={16} /></button>
          </Tooltip>
          <Tooltip title="重做" placement="top">
            <button className="tool-btn" onClick={showComingSoon}><Redo2 size={16} /></button>
          </Tooltip>
        </div>

        <div className="control-group">
          <Tooltip title="缩小" placement="top">
            <button className="tool-btn" onClick={handleZoomOut}><Minus size={16} /></button>
          </Tooltip>
          <input
            className="zoom-input"
            value={`${Math.round(stageScale * 100)}%`}
            onClick={handleZoomReset}
            readOnly
            title="点击重置为 100%"
          />
          <Tooltip title="放大" placement="top">
            <button className="tool-btn" onClick={handleZoomIn}><Plus size={16} /></button>
          </Tooltip>
        </div>

        <div className="control-group">
          <Tooltip title="导出" placement="top">
            <button className="tool-btn" onClick={showComingSoon}><Layers size={16} /></button>
          </Tooltip>
          <Tooltip title="历史" placement="top">
            <button className="tool-btn" onClick={showComingSoon}><History size={16} /></button>
          </Tooltip>
          <Tooltip title="帮助" placement="top">
            <button className="tool-btn" onClick={showComingSoon}><HelpCircle size={16} /></button>
          </Tooltip>
        </div>
      </div>

      {/* ──── Bottom-Left Hint ──── */}
      <div className="bottom-left-hint">
        滚轮缩放 · 中键拖动 · 快速定位请点击工具栏图标
      </div>
    </>
  );
};
