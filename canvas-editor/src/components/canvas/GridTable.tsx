import React from 'react';
import { Group, Rect, Text, Line } from 'react-konva';
import { Html } from 'react-konva-utils';
import { type CanvasTable, useCanvasStore } from '../../store/useCanvasStore';
import { Upload, Sparkles, Download, Plus, Copy, Play } from 'lucide-react';

const COL_WIDTHS = [280, 320, 280];
const ROW_HEIGHT_HEADER = 48;
const ROW_HEIGHT_DATA = 180;
const HEADER_BG = 'rgba(139, 92, 246, 0.25)';
const HEADER_BG_SOLID = '#d4c5f9';
const BORDER_COLOR = '#e2e8f0';
const CORNER_RADIUS = 6;

interface Props {
  table: CanvasTable;
}

/* ── Shared cell-button style ── */
const cellBtnStyle = (bg: string): React.CSSProperties => ({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: bg,
  border: 'none',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: `0 2px 6px ${bg}66`,
  transition: 'transform 0.12s',
  flexShrink: 0,
});

const hoverGrow = {
  onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) =>
    (e.currentTarget.style.transform = 'scale(1.15)'),
  onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) =>
    (e.currentTarget.style.transform = 'scale(1)'),
};

export const GridTable: React.FC<Props> = ({ table }) => {
  const { updateCell, generateImage, addTableRow } = useCanvasStore();

  const totalWidth = COL_WIDTHS.reduce((a, b) => a + b, 0);

  // Build rowHeights safely
  const rowHeights: number[] = [];
  for (let r = 0; r < table.rows; r++) {
    rowHeights.push(r === 0 ? ROW_HEIGHT_HEADER : ROW_HEIGHT_DATA);
  }
  const totalHeight = rowHeights.reduce((a, b) => a + b, 0);

  const getCellPos = (r: number, c: number) => {
    const x = COL_WIDTHS.slice(0, c).reduce((a, b) => a + b, 0);
    const y = rowHeights.slice(0, r).reduce((a, b) => a + b, 0);
    return { x, y };
  };

  const handleUploadClick = (row: number, col: number) => {
    const mockImages = [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=200',
    ];
    updateCell(table.id, row, col, {
      imageUrl: mockImages[(row - 1) % mockImages.length],
    });
  };

  return (
    <Group x={table.x} y={table.y} draggable>
      {/* ── Background with border ── */}
      <Rect
        width={totalWidth}
        height={totalHeight}
        stroke="#8b5cf6"
        strokeWidth={1.5}
        cornerRadius={CORNER_RADIUS}
        fill="#ffffff"
      />

      {/* ── Purple header row background ── */}
      <Rect
        x={0}
        y={0}
        width={totalWidth}
        height={ROW_HEIGHT_HEADER}
        fill={HEADER_BG_SOLID}
        cornerRadius={[CORNER_RADIUS, CORNER_RADIUS, 0, 0]}
      />

      {/* ── Vertical grid lines ── */}
      {COL_WIDTHS.reduce((acc: number[], w, i) => {
        if (i > 0) acc.push(COL_WIDTHS.slice(0, i).reduce((a, b) => a + b, 0));
        return acc;
      }, []).map((x, i) => (
        <Line
          key={`v-${i}`}
          points={[x, 0, x, totalHeight]}
          stroke={BORDER_COLOR}
          strokeWidth={1}
        />
      ))}

      {/* ── Horizontal grid lines (skip first — header bottom) ── */}
      {rowHeights.reduce((acc: number[], h, i) => {
        if (i > 0) acc.push(rowHeights.slice(0, i).reduce((a, b) => a + b, 0));
        return acc;
      }, []).map((y, i) => (
        <Line
          key={`h-${i}`}
          points={[0, y, totalWidth, y]}
          stroke={i === 0 ? '#8b5cf6' : BORDER_COLOR}
          strokeWidth={i === 0 ? 1.5 : 1}
        />
      ))}

      {/* ── Column header letters: A, B, C ── */}
      {COL_WIDTHS.map((w, i) => (
        <Text
          key={`ch-${i}`}
          x={getCellPos(0, i).x + w / 2 - 5}
          y={-24}
          text={String.fromCharCode(65 + i)}
          fill="#94a3b8"
          fontSize={12}
          fontFamily="Inter, sans-serif"
        />
      ))}

      {/* ── Row numbers ── */}
      {rowHeights.map((h, i) => (
        <Text
          key={`rh-${i}`}
          x={-24}
          y={getCellPos(i, 0).y + h / 2 - 6}
          text={`${i}`}
          fill="#94a3b8"
          fontSize={12}
          fontFamily="Inter, sans-serif"
        />
      ))}

      {/* ── Cell HTML overlays ── */}
      {table.cells.map((cell, idx) => {
        const { x, y } = getCellPos(cell.row, cell.col);
        const w = COL_WIDTHS[cell.col];
        const h = cell.row === 0 ? ROW_HEIGHT_HEADER : ROW_HEIGHT_DATA;

        return (
          <Group key={idx} x={x} y={y}>
            <Html
              divProps={{
                style: {
                  position: 'absolute',
                  width: w,
                  height: h,
                  pointerEvents: 'auto',
                },
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  padding: cell.row === 0 ? '0 16px' : '12px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {/* ── Header Cell ── */}
                {cell.type === 'header' && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4c1d95',
                      letterSpacing: '0.3px',
                    }}
                  >
                    {cell.content}
                  </div>
                )}

                {/* ── Upload Cell ── */}
                {cell.type === 'upload' && (
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cell.imageUrl ? (
                      <img
                        src={cell.imageUrl}
                        alt="uploaded"
                        style={{
                          maxWidth: '90%',
                          maxHeight: '85%',
                          objectFit: 'contain',
                          borderRadius: '6px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#cbd5e1',
                          fontSize: '11px',
                        }}
                      >
                        <Upload size={20} />
                        <span>批量上传图片素材（小于10mb）</span>
                      </div>
                    )}
                    {/* Bottom action buttons */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '6px',
                      }}
                    >
                      <button
                        onClick={() => handleUploadClick(cell.row, cell.col)}
                        style={cellBtnStyle('#14b8a6')}
                        {...hoverGrow}
                        title="上传"
                      >
                        <Upload size={13} />
                      </button>
                      <button
                        style={cellBtnStyle('#64748b')}
                        {...hoverGrow}
                        title="复制"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Prompt Cell ── */}
                {cell.type === 'prompt' && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <textarea
                      value={cell.content || ''}
                      onChange={(e) =>
                        updateCell(table.id, cell.row, cell.col, {
                          content: e.target.value,
                        })
                      }
                      style={{
                        width: '100%',
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        background: 'transparent',
                        fontSize: '11px',
                        color: '#475569',
                        lineHeight: '1.6',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    />
                    {/* Bottom action buttons */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '6px',
                      }}
                    >
                      <button
                        style={cellBtnStyle('#8b5cf6')}
                        {...hoverGrow}
                        title="AI 生成"
                      >
                        <Sparkles size={13} />
                      </button>
                      <button
                        style={cellBtnStyle('#64748b')}
                        {...hoverGrow}
                        title="复制"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Result Cell ── */}
                {cell.type === 'result' && (
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cell.isGenerating ? (
                      <div
                        style={{
                          color: '#8b5cf6',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            border: '3px solid #ede9fe',
                            borderTop: '3px solid #8b5cf6',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                          }}
                        />
                        <span style={{ fontSize: '11px' }}>正在生成...</span>
                      </div>
                    ) : cell.imageUrl ? (
                      <img
                        src={cell.imageUrl}
                        alt="result"
                        style={{
                          maxWidth: '90%',
                          maxHeight: '85%',
                          objectFit: 'contain',
                          borderRadius: '6px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        }}
                      />
                    ) : (
                      <span style={{ color: '#cbd5e1', fontSize: '11px' }}>
                        等待生成...
                      </span>
                    )}

                    {/* Bottom action buttons */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '6px',
                      }}
                    >
                      <button
                        onClick={() => generateImage(table.id, cell.row)}
                        style={cellBtnStyle('#8b5cf6')}
                        {...hoverGrow}
                        title="AI 生成"
                      >
                        <Sparkles size={13} />
                      </button>
                      <button
                        style={cellBtnStyle('#14b8a6')}
                        {...hoverGrow}
                        title="播放"
                      >
                        <Play size={13} />
                      </button>
                      {cell.imageUrl && (
                        <button
                          style={cellBtnStyle('#22c55e')}
                          {...hoverGrow}
                          title="下载"
                        >
                          <Download size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Html>
          </Group>
        );
      })}

      {/* ── Add Row Button ("+") at bottom ── */}
      <Group x={totalWidth / 2 - 14} y={totalHeight + 10}>
        <Html divProps={{ style: { pointerEvents: 'auto' } }}>
          <button
            onClick={() => addTableRow(table.id)}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#8b5cf6',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(139,92,246,0.4)',
              transition: 'transform 0.15s',
            }}
            {...hoverGrow}
            title="添加一行"
          >
            <Plus size={16} />
          </button>
        </Html>
      </Group>

      {/* ── Right-side quick tools when table exists ── */}
      <Group x={totalWidth + 12} y={0}>
        <Html divProps={{ style: { pointerEvents: 'auto' } }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              background: 'white',
              borderRadius: '8px',
              padding: '6px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}
          >
            <button
              style={cellBtnStyle('#8b5cf6')}
              {...hoverGrow}
              title="批量编辑"
            >
              <Sparkles size={13} />
            </button>
            <button
              style={cellBtnStyle('#64748b')}
              {...hoverGrow}
              title="锁定"
            >
              <span style={{ fontSize: '13px' }}>🔒</span>
            </button>
            <button
              style={cellBtnStyle('#22c55e')}
              {...hoverGrow}
              title="下载全部"
            >
              <Download size={13} />
            </button>
          </div>
        </Html>
      </Group>
    </Group>
  );
};
