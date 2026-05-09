import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../../portal.css';

interface NavMenu {
  id: string;
  title: string;
  items?: { name: string; path?: string }[];
  isCanvas?: boolean;
}

const NAV_MENUS: NavMenu[] = [
  {
    id: 'temu',
    title: 'Temu工具',
    items: [
      { name: '广告ROAS计算器' },
      { name: '广告利润计算器' },
      { name: '获取店铺ID' },
      { name: 'CLP标签查询' },
      { name: '产品标题生成器' },
      { name: 'FDA产品代码查询' },
    ]
  },
  {
    id: 'data',
    title: '数据分析',
    items: [
      { name: 'Temu销售数据分析' },
      { name: 'Temu财务分析' },
    ]
  },
  {
    id: 'ai-img',
    title: 'AI图片处理工具',
    items: [
      { name: '主图&详情页生成' },
      { name: '电商场景图生成' },
      { name: '图片语言转换' },
      { name: '图片抠图' },
      { name: '尺寸图编辑器' },
      { name: '图片拼接' },
      { name: 'AI图片编辑画布', path: '/canvas' },
    ]
  },
  {
    id: 'ai-hub',
    title: 'Ai集合专区',
    items: [
      { name: 'AI综合功能' },
      { name: 'Sora2 视频' },
      { name: 'Seedance 2.0 视频' },
      { name: 'HappyHorse 1.0 视频' },
    ]
  },
  {
    id: 'canvas-direct',
    title: 'AI画布',
    isCanvas: true,
  }
];

export const PortalLayout: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleSubmenu = (id: string) => {
    setActiveMenu(prev => prev === id ? null : id);
  };

  return (
    <div className="portal-theme">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <div className="logo-text">AI跨境工具</div>
        </div>

        <nav className="sidebar-nav">
          {NAV_MENUS.map(menu => (
            <div className="nav-item" key={menu.id}>
              {menu.isCanvas ? (
                <div className="nav-header" onClick={() => navigate('/canvas')}>
                  <span>{menu.title}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
              ) : (
                <>
                  <div 
                    className={`nav-header ${activeMenu === menu.id ? 'active' : ''}`} 
                    onClick={() => toggleSubmenu(menu.id)}
                  >
                    <span>{menu.title}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                  <div className={`nav-submenu ${activeMenu === menu.id ? 'open' : ''}`}>
                    {menu.items?.map((item, idx) => (
                      <a 
                        key={idx} 
                        href={item.path ? undefined : '#'} 
                        className="submenu-item"
                        onClick={(e) => {
                          if (item.path) {
                            e.preventDefault();
                            navigate(item.path);
                          }
                        }}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="icon-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            深色
          </button>
          <button className="icon-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
            登录
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Chat Widget */}
      <div className="chat-widget">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </div>
    </div>
  );
};
