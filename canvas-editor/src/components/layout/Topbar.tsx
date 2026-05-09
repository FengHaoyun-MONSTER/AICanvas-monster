import React, { useState } from 'react';
import { Menu, ChevronDown, User } from 'lucide-react';

export const Topbar: React.FC = () => {
  const [projectName] = useState('未保存文件');

  return (
    <div className="topbar">
      {/* Left: Logo + Menu */}
      <div className="topbar-left">
        <div className="logo">P</div>
        <button
          className="tool-btn"
          style={{ padding: '6px' }}
          title="菜单"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Center: Project Name */}
      <div className="topbar-center">
        <span>{projectName}</span>
        <ChevronDown size={14} style={{ opacity: 0.5 }} />
      </div>

      {/* Right: Credits + Upgrade + Avatar */}
      <div className="topbar-right">
        <span className="badge badge-free">免费</span>
        <span className="badge badge-credits">积分: 50</span>
        <button className="upgrade-btn">套餐 / 充值</button>
        <div className="avatar">
          <User size={16} />
        </div>
      </div>
    </div>
  );
};
