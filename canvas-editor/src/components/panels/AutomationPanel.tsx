import React, { useState } from 'react';
import {
  X, Zap, Play, Image, Clapperboard, FileText,
  ArrowRight, CheckCircle2, Settings, Plus
} from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';

interface WorkflowStep {
  id: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
  status: 'pending' | 'running' | 'done';
}

const TEMPLATES = [
  { id: 1, name: '电商白底图批量生成', steps: 4, desc: '上传原图 → 生成 Prompt → AI 出图 → 导出' },
  { id: 2, name: '视频二创工作流', steps: 5, desc: '上传视频 → 提取脚本 → 分镜 → AI 视频 → 合成' },
  { id: 3, name: '一键复刻爆款视频', steps: 3, desc: '输入 URL → 分析风格 → AI 重新生成' },
  { id: 4, name: '小红书种草文案批量', steps: 3, desc: '上传产品图 → AI 文案 → 批量导出' },
];

export const AutomationPanel: React.FC = () => {
  const { setActivePanel } = useCanvasStore();
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);

  const handleSelectTemplate = (tpl: typeof TEMPLATES[0]) => {
    setSelectedTemplate(tpl.id);
    // Generate mock steps
    const mockSteps: WorkflowStep[] = [
      { id: 1, icon: <Image size={14} />, title: '读取输入', desc: '从表格 A 列获取源文件', status: 'pending' },
      { id: 2, icon: <FileText size={14} />, title: 'AI 分析', desc: '调用 AI 模型处理内容', status: 'pending' },
      { id: 3, icon: <Clapperboard size={14} />, title: '生成输出', desc: '批量生成结果文件', status: 'pending' },
      { id: 4, icon: <ArrowRight size={14} />, title: '导出结果', desc: '写回表格 C 列并下载', status: 'pending' },
    ];
    setSteps(mockSteps.slice(0, tpl.steps));
  };

  const handleRun = async () => {
    if (!selectedTemplate || running) return;
    setRunning(true);

    for (let i = 0; i < steps.length; i++) {
      setSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'running' } : s
      ));
      await new Promise(r => setTimeout(r, 1200));
      setSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'done' } : s
      ));
    }

    setRunning(false);
  };

  return (
    <div className="slide-panel-overlay">
      <div className="slide-panel">
        <div className="panel-header">
          <h3>
            <Zap size={18} style={{ color: '#8b5cf6' }} />
            自动化工作流
          </h3>
          <button className="panel-close" onClick={() => setActivePanel(null)}>
            <X size={18} />
          </button>
        </div>

        <div className="panel-body">
          {!selectedTemplate ? (
            <>
              <div className="section-divider">选择工作流模板</div>

              {TEMPLATES.map(tpl => (
                <div
                  key={tpl.id}
                  className="auto-step"
                  onClick={() => handleSelectTemplate(tpl)}
                >
                  <div className="step-num">
                    <Zap size={14} />
                  </div>
                  <div className="step-info">
                    <div className="step-title">{tpl.name}</div>
                    <div className="step-desc">{tpl.desc}</div>
                  </div>
                  <ArrowRight size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
                </div>
              ))}

              <button className="btn-generate secondary" style={{ marginTop: 8 }}>
                <Plus size={14} /> 创建自定义工作流
              </button>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <button
                  className="panel-close"
                  onClick={() => { setSelectedTemplate(null); setSteps([]); }}
                  style={{ padding: 4 }}
                >
                  <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                </span>
              </div>

              <div className="section-divider">工作流步骤</div>

              {steps.map((step, i) => (
                <div key={step.id} className="auto-step" style={{
                  borderColor: step.status === 'running' ? '#8b5cf6' : step.status === 'done' ? '#22c55e' : undefined,
                  background: step.status === 'running' ? 'rgba(139,92,246,0.05)' : step.status === 'done' ? 'rgba(34,197,94,0.05)' : undefined,
                }}>
                  <div className="step-num" style={{
                    background: step.status === 'done' ? '#22c55e' :
                      step.status === 'running' ? '#8b5cf6' : '#cbd5e1',
                  }}>
                    {step.status === 'done' ? <CheckCircle2 size={14} /> :
                      step.status === 'running' ? (
                        <div style={{
                          width: 14, height: 14,
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }} />
                      ) : <span>{i + 1}</span>}
                  </div>
                  <div className="step-info">
                    <div className="step-title">{step.title}</div>
                    <div className="step-desc">{step.desc}</div>
                  </div>
                  <Settings size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
                </div>
              ))}

              <button
                className="btn-generate"
                onClick={handleRun}
                disabled={running}
                style={{ marginTop: 8 }}
              >
                {running ? (
                  <>
                    <div style={{
                      width: 16, height: 16,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    运行中...
                  </>
                ) : steps.every(s => s.status === 'done') ? (
                  <>
                    <CheckCircle2 size={16} />
                    全部完成！
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    运行工作流
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
