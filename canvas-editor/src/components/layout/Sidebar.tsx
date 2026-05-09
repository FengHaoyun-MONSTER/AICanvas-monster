import React from 'react';
import { Menu } from 'antd';
import { DragOutlined, ScissorOutlined, PictureOutlined } from '@ant-design/icons';

export const Sidebar: React.FC = () => {
  return (
    <div style={{
      width: 60,
      background: '#fff',
      borderRight: '1px solid #f0f0f0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 16
    }}>
      <Menu
        mode="vertical"
        defaultSelectedKeys={['select']}
        style={{ borderRight: 0, width: '100%' }}
        items={[
          {
            key: 'select',
            icon: <DragOutlined style={{ fontSize: 20 }} />,
            title: '选择与移动'
          },
          {
            key: 'crop',
            icon: <ScissorOutlined style={{ fontSize: 20 }} />,
            title: '裁切'
          },
          {
            key: 'bg-remove',
            icon: <PictureOutlined style={{ fontSize: 20 }} />,
            title: '图片转白底'
          }
        ]}
      />
    </div>
  );
};
