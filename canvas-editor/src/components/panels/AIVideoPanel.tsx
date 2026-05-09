import React, { useState } from 'react';
import { X, Clapperboard, Sparkles, Upload, Coins, Play } from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';

const VIDEO_MODELS = [
  { id: 'sora-2', name: 'Sora 2', desc: '高质量视频生成' },
  { id: 'veo-3.1', name: 'Veo 3.1', desc: '谷歌视频模型' },
  { id: 'seedance', name: 'Seedance 2.0', desc: '舞蹈/运动生成' },
  { id: 'vidu', name: 'VIDU', desc: '国产视频模型' },
];

const DURATIONS = ['5秒', '10秒', '15秒', '30秒'];
const RESOLUTIONS = ['16:9', '9:16', '1:1'];

export const AIVideoPanel: React.FC = () => {
  const { setActivePanel } = useCanvasStore();
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('sora-2');
  const [duration, setDuration] = useState('10秒');
  const [resolution, setResolution] = useState('16:9');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setDone(false);
    setProgress(0);

    // Simulate progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 150));
      setProgress(i);
    }

    setGenerating(false);
    setDone(true);
  };

  return (
    <div className="slide-panel-overlay">
      <div className="slide-panel">
        <div className="panel-header">
          <h3>
            <Clapperboard size={18} style={{ color: '#8b5cf6' }} />
            AI 视频生成
          </h3>
          <button className="panel-close" onClick={() => setActivePanel(null)}>
            <X size={18} />
          </button>
        </div>

        <div className="panel-body">
          <div className="credits-indicator">
            <Coins size={14} />
            每次生成消耗 5~15 积分 · 当前余额: 50
          </div>

          {/* Reference image upload */}
          <div className="form-group">
            <label className="form-label">参考图片（可选）</label>
            <div className="result-preview" style={{ minHeight: 100, cursor: 'pointer' }}>
              <Upload size={24} style={{ opacity: 0.3 }} />
              <span>点击上传参考图片</span>
            </div>
          </div>

          {/* Prompt */}
          <div className="form-group">
            <label className="form-label">视频描述</label>
            <textarea
              className="form-textarea"
              placeholder="例如: 一个产品从画面左侧缓缓滑入，旋转展示360度，背景为柔和的渐变色..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
          </div>

          {/* Model */}
          <div className="form-group">
            <label className="form-label">视频模型</label>
            <select className="form-select" value={model} onChange={(e) => setModel(e.target.value)}>
              {VIDEO_MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.name} — {m.desc}</option>
              ))}
            </select>
          </div>

          {/* Duration & Resolution */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="param-row" style={{ flex: 1 }}>
              <span className="form-label">时长</span>
              <select className="form-select" value={duration} onChange={(e) => setDuration(e.target.value)}>
                {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="param-row" style={{ flex: 1 }}>
              <span className="form-label">比例</span>
              <select className="form-select" value={resolution} onChange={(e) => setResolution(e.target.value)}>
                {RESOLUTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Generate */}
          <button
            className="btn-generate"
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
          >
            {generating ? (
              <>
                <div style={{
                  width: 16, height: 16,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                生成中 {progress}%
              </>
            ) : (
              <>
                <Sparkles size={16} />
                生成视频
              </>
            )}
          </button>

          {/* Progress bar */}
          {generating && (
            <div style={{ background: '#ede9fe', borderRadius: 8, height: 6, overflow: 'hidden' }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #8b5cf6, #6d28d9)',
                borderRadius: 8,
                transition: 'width 0.15s ease',
              }} />
            </div>
          )}

          {/* Result */}
          <div className="section-divider">生成结果</div>

          <div className={`result-preview ${generating ? 'generating' : ''}`}>
            {generating ? (
              <>
                <div style={{
                  width: 36, height: 36,
                  border: '3px solid #ede9fe',
                  borderTop: '3px solid #8b5cf6',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <span>视频渲染中...</span>
              </>
            ) : done ? (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <div style={{
                  width: 56, height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: '0 4px 16px rgba(139,92,246,0.3)',
                }}>
                  <Play size={24} color="white" />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1e1e2e' }}>视频生成完成！</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{model} · {duration} · {resolution}</div>
              </div>
            ) : (
              <>
                <Clapperboard size={32} style={{ opacity: 0.3 }} />
                <span>输入描述后点击生成</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
