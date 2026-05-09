import React, { useState, useRef, useEffect } from 'react';
import { X, Bot, Send, Sparkles } from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const MOCK_RESPONSES = [
  '好的！我来帮你分析这张图片的构图和色彩。从整体来看，画面的主体突出，背景干净，很适合作为电商主图使用。建议可以适当增加一些阴影效果，让产品看起来更有立体感。',
  '根据你的描述，我建议使用以下 Prompt 来生成图片：\n\n**"Professional product photography, [your product], centered on pure white background, soft studio lighting, high-key, 8K resolution, commercial quality"**\n\n你可以根据具体产品调整关键词。',
  '视频脚本已生成！共分为 3 个镜头：\n\n1️⃣ **开场** (0-3s): 产品从右侧缓缓滑入\n2️⃣ **展示** (3-8s): 360度旋转展示细节\n3️⃣ **结尾** (8-10s): Logo + slogan 淡入\n\n需要我调整哪个镜头？',
  '关于批量处理，我建议你使用表格的自动化功能：\n\n1. 先在第一行设置好 Prompt 模板\n2. 批量上传原始图片到 A 列\n3. 点击 "一键生成" 批量处理\n\n这样可以大幅提升效率！',
  '配色方案建议：\n\n🎨 **方案 A**: 暖色调 — #FF6B6B + #FFA07A + #FFD700\n🎨 **方案 B**: 冷色调 — #4ECDC4 + #45B7D1 + #96E6A1\n🎨 **方案 C**: 高级感 — #2D3436 + #636E72 + #DFE6E9\n\n你更喜欢哪个方案？',
];

export const AIChatPanel: React.FC = () => {
  const { setActivePanel } = useCanvasStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      role: 'assistant',
      content: '👋 你好！我是 AI 助手，可以帮你：\n\n• 优化图片生成 Prompt\n• 生成视频脚本\n• 分析图片构图\n• 推荐配色方案\n• 解答使用问题\n\n有什么可以帮你的？',
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 1000));

    const aiMsg: ChatMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)],
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <div className="slide-panel-overlay">
      <div className="slide-panel">
        <div className="panel-header">
          <h3>
            <Bot size={18} style={{ color: '#8b5cf6' }} />
            AI 助手
          </h3>
          <button className="panel-close" onClick={() => setActivePanel(null)}>
            <X size={18} />
          </button>
        </div>

        <div className="panel-body" style={{ padding: '12px 16px' }}>
          {/* Messages */}
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-msg ${msg.role}`}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                <span className="msg-time">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="chat-msg assistant">
                <div style={{ display: 'flex', gap: 4, padding: '4px 0' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6,
                      borderRadius: '50%',
                      background: '#8b5cf6',
                      animation: `pulse 1.2s ease-in-out ${i * 0.15}s infinite`,
                    }} />
                  ))}
                </div>
                <style>{`
                  @keyframes pulse {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1); }
                  }
                `}</style>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-bar">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入消息..."
              disabled={isTyping}
            />
            <button
              className="chat-send-btn"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
