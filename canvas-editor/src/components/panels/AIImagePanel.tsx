import React, { useState } from 'react';
import { X, Image, Sparkles, Download, Coins } from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';

const MODELS = [
  { id: 'gpt-image', name: 'GPT-Image-1', desc: '高质量写实图片' },
  { id: 'recraft', name: 'Recraft V3', desc: '设计/插画风格' },
  { id: 'gemini', name: 'Gemini Pro', desc: '多模态理解+生成' },
  { id: 'nano-banana', name: 'Nano Banana', desc: '电商白底图专用' },
];

const SIZES = ['1:1 (1024×1024)', '16:9 (1792×1024)', '9:16 (1024×1792)', '4:3 (1536×1152)'];

export const AIImagePanel: React.FC = () => {
  const { setActivePanel } = useCanvasStore();
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('gpt-image');
  const [size, setSize] = useState(SIZES[0]);
  const [generating, setGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setResultUrl(null);

    // Mock API call
    await new Promise(r => setTimeout(r, 2500));

    const mockImages = [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=400',
    ];
    setResultUrl(mockImages[Math.floor(Math.random() * mockImages.length)]);
    setGenerating(false);
  };

  return (
    <div className="slide-panel-overlay">
      <div className="slide-panel">
        <div className="panel-header">
          <h3>
            <Image size={18} style={{ color: '#8b5cf6' }} />
            AI 图片生成
          </h3>
          <button className="panel-close" onClick={() => setActivePanel(null)}>
            <X size={18} />
          </button>
        </div>

        <div className="panel-body">
          {/* Credits */}
          <div className="credits-indicator">
            <Coins size={14} />
            每次生成消耗 1~3 积分 · 当前余额: 50
          </div>

          {/* Prompt */}
          <div className="form-group">
            <label className="form-label">描述你想要的图片</label>
            <textarea
              className="form-textarea"
              placeholder="例如: 一只可爱的柴犬穿着太空服，站在月球上，背景是地球，赛博朋克风格，8K超高清..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>

          {/* Model Selection */}
          <div className="form-group">
            <label className="form-label">AI 模型</label>
            <select
              className="form-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              {MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.name} — {m.desc}</option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div className="param-row">
            <span className="form-label">尺寸</span>
            <select
              className="form-select"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              {SIZES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Generate Button */}
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
                生成中...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                生成图片
              </>
            )}
          </button>

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
                <span>AI 正在创作中...</span>
              </>
            ) : resultUrl ? (
              <img src={resultUrl} alt="AI Generated" />
            ) : (
              <>
                <Image size={32} style={{ opacity: 0.3 }} />
                <span>输入描述后点击生成</span>
              </>
            )}
          </div>

          {/* Actions */}
          {resultUrl && !generating && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-generate secondary" style={{ flex: 1 }} onClick={handleGenerate}>
                <Sparkles size={14} /> 重新生成
              </button>
              <button className="btn-generate" style={{ flex: 1 }}>
                <Download size={14} /> 添加到画布
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
