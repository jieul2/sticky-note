'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Maximize, Type, Bold, Palette, Pipette, 
  Square, ScrollText, MousePointer2, Trash2,
  AlignLeft, AlignCenter, AlignRight,
  AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd,
  MapPin 
} from 'lucide-react';
import React from 'react';
import { useSave } from './SaveContext';

export type Memo = {
  id: number;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontColor: string;
  fontWeight: 'normal' | 'bold' | 'lighter' | 'bolder';
  fontFamily: string;
  backgroundColor: string;
  borderWidth: number;
  borderColor: string | null;
  overflow: string;
  textAlign: 'left' | 'center' | 'right'; 
  verticalAlign: 'top' | 'center' | 'bottom';
};

interface ModalProps {
  memo: Memo;
  onClose: () => void;
  onUpdate: (updates: Partial<Memo>) => void;
  onDelete: () => void;
}

export default function MemoPropertyModal({ memo, onClose, onUpdate, onDelete }: ModalProps) {
  const { triggerSave } = useSave();

  const bgPresets = ['#ffffff', '#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff', '#18181b', '#ffedd5'];
  const textPresets = ['#18181b', '#ffffff', '#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
  const fontFamilies = [
    { name: '기본글꼴', value: 'inherit' },
    { name: '명조체', value: 'serif' },
    { name: '코딩체', value: 'monospace' },
    { name: '고딕체', value: 'sans-serif' }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 숫자를 지웠을 때 0으로 변하는 것을 방지하기 위한 함수
  const handleNumberChange = (field: keyof Memo, value: string) => {
    if (value === '') {
      // TypeScript의 'any' 오류를 피하기 위해 unknown을 거쳐 number로 캐스팅
      onUpdate({ [field]: '' as unknown as number }); 
      return;
    }
    const num = Number(value);
    if (!isNaN(num)) {
      // 좌표(x, y)는 음수일 때 0으로 제한
      const finalValue = (field === 'x' || field === 'y') && num < 0 ? 0 : num;
      onUpdate({ [field]: finalValue });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md" 
      // 바깥 클릭 시 닫히지 않도록 onClick={onClose}를 제거함
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
        className="bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl p-8 max-w-[90vw] w-[520px] border border-gray-100 dark:border-zinc-800 max-h-[85vh] overflow-y-auto scrollbar-hide" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            <h4 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white">메모 설정</h4>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </motion.button>
        </div>

        <div className="space-y-8">
          {/* 0. 메모 위치 설정 */}
          <section>
            <Label icon={<MapPin className="w-3.5 h-3.5" />} text="메모 위치 설정" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[12px] text-zinc-400 font-bold uppercase ml-1">X 좌표</span>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900 p-3 rounded-2xl">
                  <input 
                    type="number" 
                    // value가 빈 문자열일 때를 대비해 타입 단언 사용
                    value={(memo.x as unknown as string) === '' ? '' : Math.round(memo.x)} 
                    onChange={(e) => handleNumberChange('x', e.target.value)} 
                    className="bg-transparent w-full text-sm font-black focus:outline-none dark:text-white" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[12px] text-zinc-400 font-bold uppercase ml-1">Y 좌표</span>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900 p-3 rounded-2xl">
                  <input 
                    type="number" 
                    value={(memo.y as unknown as string) === '' ? '' : Math.round(memo.y)} 
                    onChange={(e) => handleNumberChange('y', e.target.value)} 
                    className="bg-transparent w-full text-sm font-black focus:outline-none dark:text-white" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 1. 메모 크기 조절 */}
          <section>
            <Label icon={<Maximize className="w-3.5 h-3.5" />} text="메모 크기 조절" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[12px] text-zinc-400 font-bold uppercase ml-1">가로 너비</span>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900 p-3 rounded-2xl">
                  <input 
                    type="number" 
                    value={(memo.width as unknown as string) === '' ? '' : memo.width} 
                    onChange={(e) => handleNumberChange('width', e.target.value)} 
                    className="bg-transparent w-full text-sm font-black focus:outline-none dark:text-white" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[12px] text-zinc-400 font-bold uppercase ml-1">세로 높이</span>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900 p-3 rounded-2xl">
                  <input 
                    type="number" 
                    value={(memo.height as unknown as string) === '' ? '' : memo.height} 
                    onChange={(e) => handleNumberChange('height', e.target.value)} 
                    className="bg-transparent w-full text-sm font-black focus:outline-none dark:text-white" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 2. 정렬 및 글꼴 설정 */}
          <section>
            <Label icon={<Type className="w-3.5 h-3.5" />} text="정렬 및 글꼴" />
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-zinc-400 uppercase ml-1">가로 정렬</span>
                  <div className="flex gap-1 bg-gray-50 dark:bg-zinc-900 p-1 rounded-2xl">
                    {(['left', 'center', 'right'] as const).map((id) => (
                      <motion.button 
                        key={id} 
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => onUpdate({ textAlign: id })} 
                        className={`flex-1 flex justify-center py-2 rounded-xl transition-all ${memo.textAlign === id ? 'bg-white dark:bg-zinc-800 shadow-md text-yellow-500 ring-1 ring-black/5' : 'text-zinc-400'}`}
                      >
                        {id === 'left' ? <AlignLeft className="w-4 h-4" /> : id === 'center' ? <AlignCenter className="w-4 h-4" /> : <AlignRight className="w-4 h-4" />}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-zinc-400 uppercase ml-1">세로 정렬</span>
                  <div className="flex gap-1 bg-gray-50 dark:bg-zinc-900 p-1 rounded-2xl">
                    {(['top', 'center', 'bottom'] as const).map((id) => (
                      <motion.button 
                        key={id} 
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => onUpdate({ verticalAlign: id })} 
                        className={`flex-1 flex justify-center py-2 rounded-xl transition-all ${memo.verticalAlign === id ? 'bg-white dark:bg-zinc-800 shadow-md text-yellow-500 ring-1 ring-black/5' : 'text-zinc-400'}`}
                      >
                        {id === 'top' ? <AlignVerticalJustifyStart className="w-4 h-4" /> : id === 'center' ? <AlignVerticalJustifyCenter className="w-4 h-4" /> : <AlignVerticalJustifyEnd className="w-4 h-4" />}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-black text-zinc-400 uppercase ml-1">글꼴 크기</span>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-900 p-3 rounded-2xl">
                  <input 
                    type="range" min="12" max="100" 
                    value={memo.fontSize} 
                    onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })} 
                    className="flex-1 accent-yellow-400 cursor-pointer" 
                  />
                  <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 px-3 py-1 rounded-lg ring-1 ring-black/5">
                    <input 
                      type="number"
                      value={memo.fontSize}
                      onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
                      className="w-10 bg-transparent text-center text-sm font-black focus:outline-none dark:text-white"
                    />
                    <span className="text-[10px] font-bold text-zinc-400">PX</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <select 
                  value={memo.fontFamily} 
                  onChange={(e) => onUpdate({ fontFamily: e.target.value })} 
                  className="bg-gray-50 dark:bg-zinc-900 border-none rounded-xl p-2 text-[12px] font-black dark:text-white focus:ring-1 ring-yellow-400 cursor-pointer"
                >
                  {fontFamilies.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                </select>
                <div className="flex gap-1">
                  {(['normal', 'bold'] as const).map(weight => (
                    <motion.button 
                      key={weight} whileTap={{ scale: 0.95 }}
                      onClick={() => onUpdate({ fontWeight: weight })} 
                      className={`flex-1 py-2 rounded-xl text-[12px] font-black border transition-all ${memo.fontWeight === weight ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-transparent' : 'border-gray-100 dark:border-zinc-800 text-zinc-400 hover:bg-gray-100'}`}
                    >
                      {weight === 'bold' ? <Bold className="w-3.5 h-3.5 mx-auto" /> : 'Aa'}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 3. 색상 설정 */}
          <section>
            <Label icon={<Palette className="w-3.5 h-3.5" />} text="색상 설정" />
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[11px] font-black text-zinc-400 uppercase">배경색</span>
                  <div className="flex items-center gap-1 text-[11px] font-black text-yellow-500"><Pipette className="w-3 h-3" /> 커스텀</div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {bgPresets.map(color => (
                    <motion.button 
                      key={color} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                      onClick={() => onUpdate({ backgroundColor: color })} 
                      className={`w-7 h-7 rounded-full border-2 transition-all ${memo.backgroundColor === color ? 'border-yellow-400 scale-110 shadow-md' : 'border-transparent opacity-80'}`} 
                      style={{ backgroundColor: color }} 
                    />
                  ))}
                  <input 
                    type="color" value={memo.backgroundColor} 
                    onChange={(e) => onUpdate({ backgroundColor: e.target.value })} 
                    className="w-7 h-7 rounded-full overflow-hidden border-none bg-transparent cursor-pointer" 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <span className="text-[11px] font-black text-zinc-400 uppercase px-1">글자색</span>
                <div className="flex flex-wrap gap-2 items-center">
                  {textPresets.map(color => (
                    <motion.button 
                      key={color} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                      onClick={() => onUpdate({ fontColor: color })} 
                      className={`w-6 h-6 rounded-lg border-2 transition-all ${memo.fontColor === color ? 'border-yellow-400 scale-110' : 'border-transparent'}`} 
                      style={{ backgroundColor: color }} 
                    />
                  ))}
                  <input 
                    type="color" value={memo.fontColor} 
                    onChange={(e) => onUpdate({ fontColor: e.target.value })} 
                    className="w-6 h-6 rounded-lg overflow-hidden border-none bg-transparent cursor-pointer" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 4. 테두리 설정 */}
          <section>
            <Label icon={<Square className="w-3.5 h-3.5" />} text="테두리 설정" />
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-900 p-3 rounded-2xl">
                <input 
                  type="range" min="0" max="10" 
                  value={memo.borderWidth} 
                  onChange={(e) => onUpdate({ borderWidth: Number(e.target.value) })} 
                  className="flex-1 accent-yellow-400 cursor-pointer" 
                />
                <span className="text-sm font-black w-10 dark:text-white">{memo.borderWidth}px</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-900 p-3 rounded-2xl">
                <span className="text-[12px] font-black text-zinc-400 uppercase ml-1">테두리 색상</span>
                <input 
                  type="color" 
                  value={memo.borderColor || '#e5e7eb'} 
                  onChange={(e) => onUpdate({ borderColor: e.target.value })} 
                  className="w-10 h-6 rounded-md overflow-hidden border-none bg-transparent cursor-pointer" 
                />
              </div>
            </div>
          </section>

          {/* 5. 스크롤 설정 */}
          <section>
            <Label icon={<ScrollText className="w-3.5 h-3.5" />} text="스크롤 설정" />
            <div className="flex gap-2">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => onUpdate({ overflow: 'hidden' })} 
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[12px] font-black uppercase transition-all ${memo.overflow === 'hidden' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900'}`}
              >
                <MousePointer2 className="w-3.5 h-3.5" /> 영역 고정
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => onUpdate({ overflow: 'auto' })} 
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[12px] font-black uppercase transition-all ${memo.overflow === 'auto' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900'}`}
              >
                <ScrollText className="w-3.5 h-3.5" /> 자동 스크롤
              </motion.button>
            </div>
          </section>

          <motion.button 
            whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { if(confirm('이 메모를 영구적으로 삭제할까요?')) onDelete(); }} 
            className="w-full py-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-3xl text-[12px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> 메모 삭제하기
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function Label({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 text-[13px] font-black text-zinc-400 uppercase tracking-[0.1em]">
      {icon} <span>{text}</span>
    </div>
  );
}