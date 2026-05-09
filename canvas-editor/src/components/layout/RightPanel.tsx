import React from 'react';
import { Card, Empty, Descriptions } from 'antd';
import { useCanvasStore } from '../../store/useCanvasStore';

export const RightPanel: React.FC = () => {
  const { selectedId, layers } = useCanvasStore();
  
  const selectedLayer = layers.find(l => l.id === selectedId);

  return (
    <div style={{
      width: 280,
      background: '#fff',
      borderLeft: '1px solid #f0f0f0',
      padding: 16,
      overflowY: 'auto'
    }}>
      <h3 style={{ marginBottom: 16 }}>属性面板</h3>
      
      {selectedLayer ? (
        <Card size="small" title="图层属性">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="ID">{selectedLayer.id.substring(0, 8)}</Descriptions.Item>
            <Descriptions.Item label="X">{Math.round(selectedLayer.x)}</Descriptions.Item>
            <Descriptions.Item label="Y">{Math.round(selectedLayer.y)}</Descriptions.Item>
            <Descriptions.Item label="宽度">{Math.round(selectedLayer.width * selectedLayer.scaleX)}</Descriptions.Item>
            <Descriptions.Item label="高度">{Math.round(selectedLayer.height * selectedLayer.scaleY)}</Descriptions.Item>
            <Descriptions.Item label="旋转角度">{Math.round(selectedLayer.rotation)}°</Descriptions.Item>
          </Descriptions>
        </Card>
      ) : (
        <Empty description="未选中任何图层" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
};
