import React from 'react';
import { Topbar } from '../components/layout/Topbar';
import { StageViewer } from '../components/canvas/StageViewer';
import { FloatingToolbars } from '../components/layout/FloatingToolbars';
import { AIImagePanel } from '../components/panels/AIImagePanel';
import { AIVideoPanel } from '../components/panels/AIVideoPanel';
import { AIChatPanel } from '../components/panels/AIChatPanel';
import { AutomationPanel } from '../components/panels/AutomationPanel';
import { useCanvasStore } from '../store/useCanvasStore';
import '../panels.css';

export const CanvasEditor: React.FC = () => {
  const activePanel = useCanvasStore((s) => s.activePanel);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Top Bar */}
      <Topbar />

      {/* Canvas Area (relative for floating toolbars & panels) */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Floating Toolbars */}
        <FloatingToolbars />

        {/* Infinite Canvas */}
        <StageViewer />

        {/* ── AI Panels (slide from right) ── */}
        {activePanel === 'aiImage' && <AIImagePanel />}
        {activePanel === 'aiVideo' && <AIVideoPanel />}
        {activePanel === 'aiChat' && <AIChatPanel />}
        {activePanel === 'automation' && <AutomationPanel />}
      </div>
    </div>
  );
};
