import React from 'react';
import { Volume2, Trophy } from 'lucide-react';
import { MistakeItem } from '../types';

interface ReviewScreenProps {
  mistakes: MistakeItem[];
  onReplayNum: (num: MistakeItem['num']) => void;
  onFinishReview: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  mistakes,
  onReplayNum,
  onFinishReview,
}) => {
  return (
    <div className="w-full max-w-md mx-auto p-3 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-5 shadow-2xl border-4 border-amber-300 text-center">
        <div className="text-4xl mb-2">📝</div>
        <h2 className="text-xl font-black text-pink-600 mb-1">هيا نراجع معاً!</h2>
        <p className="text-xs font-bold text-slate-600 mb-4">
          هذه الأعداد تحتاج تدريباً إضافياً لتصبح بطلاً فيها 💪
        </p>

        <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
          {mistakes.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 border-r-4 border-pink-500 shadow-xs text-right"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onReplayNum(item.num)}
                  className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-md hover:scale-110 active:scale-90 transition-all"
                  title="استمع للعدد مرة أخرى"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <div>
                  <div className="text-xl font-black text-pink-600">{item.num.n}</div>
                  <div
                    className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-black text-white shadow-xs"
                    style={{ background: item.num.wBg }}
                  >
                    {item.num.w}
                  </div>
                </div>
              </div>

              <div className="text-left">
                <span className="text-[11px] text-slate-500 block">قلتَ: «{item.said || '—'}»</span>
                <span className="text-xs text-slate-400 font-serif">{item.num.emoji.repeat(Math.min(item.num.n, 5))}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onFinishReview}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-base rounded-full shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
        >
          <Trophy className="w-5 h-5 text-amber-300" />
          <span>انتهيت من المراجعة</span>
        </button>
      </div>
    </div>
  );
};
