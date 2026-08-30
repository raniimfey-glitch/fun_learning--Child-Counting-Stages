import React, { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { LevelType, CharacterType } from '../types';
import { triggerConfetti } from '../utils/confetti';

interface FinalScreenProps {
  level: LevelType;
  selectedChar?: CharacterType;
  onRestart: () => void;
}

export const FinalScreen: React.FC<FinalScreenProps> = ({ level, selectedChar, onRestart }) => {
  useEffect(() => {
    triggerConfetti(70);
  }, []);

  const isGirl = selectedChar === 'girl';

  const prizeEmojis =
    level === 1
      ? '🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓'
      : level === 2
      ? '🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀'
      : level === 3
      ? '👑💯🏆🌟🎉✨🌈💎🎊⭐'
      : '🎲🔥🏆🌟🎉✨👑💎⚡🎯';

  return (
    <div className="w-full max-w-md mx-auto p-3 animate-fade-in">
      <div className="relative bg-white/95 backdrop-blur-xl rounded-[32px] p-6 shadow-2xl border-4 border-amber-400 text-center overflow-hidden">
        {/* Top rainbow accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-amber-400 via-emerald-400 to-sky-400 animate-pulse" />

        <div className="text-5xl mb-2 animate-bounce">🦋🎉🦋</div>
        <h2 className="text-2xl font-black text-pink-600 mb-1">
          {isGirl ? 'أَحْسَنْتِ! مُمْتَازَةٌ! رَائِعٌ يَا بَطَلَةُ! 🌟' : 'أَحْسَنْتَ! مُمْتَازٌ! رَائِعٌ يَا بَطَلُ! 🌟'}
        </h2>
        <p className="text-sm font-bold text-slate-600">
          {level === 1
            ? 'لقد تعلّمت الأعداد من 1 إلى 10 بنجاح!'
            : level === 2
            ? 'رائع جداً! تعلّمت العدّ عشرة عشرة حتى 100!'
            : level === 3
            ? 'مذهل ومبدع! تعلّمت العدّ مئة مئة حتى 1000!'
            : 'بطل العباقرة! اجتزت مرحلة التحدي والأعداد العشوائية بنجاح مذهل!'}
        </p>

        <div className="my-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 shadow-inner">
          <p className="text-xs font-extrabold text-amber-800 mb-2">🎁 وحصلت على سَلّة الجَوَائِز الفَاخِرَة:</p>
          <div className="text-2xl tracking-widest leading-relaxed break-words">
            {prizeEmojis}
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black text-base rounded-full shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>العب مجدداً</span>
        </button>
      </div>
    </div>
  );
};
