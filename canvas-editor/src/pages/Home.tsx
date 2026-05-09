import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="hero-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        跨境电商一站式智能平台
      </div>
      
      <h1 className="hero-title">
        用 AI 重新定义<br />
        <span className="text-gradient">跨境电商运营效率</span>
      </h1>
      
      <p className="hero-subtitle">
        从智能数据分析到 AI 图片生成，从实用计算工具到视频创作<br />
        一个平台，覆盖跨境卖家全链路运营需求
      </p>

      <div className="hero-actions">
        <button className="btn btn-primary" onClick={() => navigate('/canvas')}>
          立即体验 
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
        <button className="btn btn-secondary">
          了解更多
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
        <button className="btn btn-secondary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          使用前必读
        </button>
      </div>
    </>
  );
};
