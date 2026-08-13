import React, { useState, useEffect, useRef } from 'react';
import { LevelType, AudioSettings, CharacterType } from '../types';
import { Play, ArrowRight, Sparkles } from 'lucide-react';
import { speakText, stopAllAudio } from '../services/ttsService';

interface LevelSelectScreenProps {
  audioSettings: AudioSettings;
  selectedChar?: CharacterType;
  onSelectLevel: (level: LevelType) => void;
  onBackToWelcome: () => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  audioSettings,
  selectedChar,
  onSelectLevel,
  onBackToWelcome,
}) => {
  const [highlightedLevel, setHighlightedLevel] = useState<1 | 2 | 3 | 4 | null>(null);
  const hasSpokenRef = useRef(false);

  useEffect(() => {
    if (hasSpokenRef.current) return;
    hasSpokenRef.current = true;

    stopAllAudio();
    setHighlightedLevel(null);

    // Timed card highlighting synchronized with the continuous audio phrase
    const timer1 = setTimeout(() => {
      setHighlightedLevel(1);
    }, 1600);

    const timer2 = setTimeout(() => {
      setHighlightedLevel(2);
    }, 3800);

    const timer3 = setTimeout(() => {
      setHighlightedLevel(3);
    }, 6000);

    const timer4 = setTimeout(() => {
      setHighlightedLevel(4);
    }, 8500);

    const timer5 = setTimeout(() => {
      setHighlightedLevel(null);
    }, 11000);

    const isGirl = selectedChar === 'girl';
    const introPhrase = isGirl
      ? 'اِخْتَارِي الْمَرْحَلَةَ الَّتِي تُرِيدِينَ: مَرْحَلَةُ الْعَدِّ وَاحِدٌ وَاحِدٌ، أَوْ مَرْحَلَةُ الْعَدِّ عَشَرَةٌ عَشَرَةٌ، أَوْ مَرْحَلَةُ الْعَدِّ مِئَةٌ مِئَةٌ، أَوْ مَرْحَلَةُ التَّحَدِّي.'
      : 'اِخْتَرِ الْمَرْحَلَةَ الَّتِي تُرِيدُ: مَرْحَلَةُ الْعَدِّ وَاحِدٌ وَاحِدٌ، أَوْ مَرْحَلَةُ الْعَدِّ عَشَرَةٌ عَشَرَةٌ، أَوْ مَرْحَلَةُ الْعَدِّ مِئَةٌ مِئَةٌ، أَوْ مَرْحَلَةُ التَّحَدِّي.';

    // Speak once as a single, smooth, continuous sentence without repetition
    speakText(
      introPhrase,
      audioSettings,
      () => {},
      () => {
        setHighlightedLevel(null);
      }
    );

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      stopAllAudio();
    };
  }, [audioSettings]);

  const handleLevelClick = (lvl: LevelType) => {
    stopAllAudio();
    onSelectLevel(lvl);
  };

  const handleBackClick = () => {
    stopAllAudio();
    onBackToWelcome();
  };

  const isLvl1Active = highlightedLevel === 1;
  const isLvl2Active = highlightedLevel === 2;
  const isLvl3Active = highlightedLevel === 3;
  const isLvl4Active = highlightedLevel === 4;

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-4 text-center animate-fade-in overflow-y-auto">
      <div className="max-w-xs w-full flex flex-col items-center py-6">
        <div className="text-4xl mb-1 animate-bounce">📚</div>
        <h2 className="text-2xl font-black text-amber-300 mb-1 flex items-center gap-2 justify-center">
          <span>اختر المرحلة</span>
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
        </h2>
        <p className="text-xs text-slate-300 font-bold mb-4">كل مرحلة رحلة تعلّم ممتعة جديدة ✨</p>

        <div className="w-full space-y-3 mb-5">
          {/* Level 1 Button */}
          <button
            onClick={() => handleLevelClick(1)}
            className={`w-full relative flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-lg transition-all duration-300 transform cursor-pointer text-right border ${
              isLvl1Active
                ? 'scale-105 ring-4 ring-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.8)] border-amber-300 z-10'
                : 'hover:from-pink-500 hover:to-rose-400 border-pink-400/40 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🦋</span>
              <div>
                <div className="font-black text-base leading-snug">المرحلة الأولى</div>
                <div className="text-[11px] text-pink-100 font-medium">تعلّم الأعداد من 1 إلى 10</div>
                <span className="inline-block mt-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-extrabold">
                  🍎 عدد بعد عدد (1 - 1)
                </span>
              </div>
            </div>
            <Play className={`w-5 h-5 ${isLvl1Active ? 'text-amber-200 fill-amber-200 scale-125' : 'text-pink-200 fill-pink-200'}`} />
          </button>

          {/* Level 2 Button */}
          <button
            onClick={() => handleLevelClick(2)}
            className={`w-full relative flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg transition-all duration-300 transform cursor-pointer text-right border ${
              isLvl2Active
                ? 'scale-105 ring-4 ring-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.8)] border-amber-300 z-10'
                : 'hover:from-emerald-500 hover:to-teal-400 border-emerald-400/40 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚀</span>
              <div>
                <div className="font-black text-base leading-snug">المرحلة الثانية</div>
                <div className="text-[11px] text-emerald-100 font-medium">العد عشرة عشرة من 10 إلى 100</div>
                <span className="inline-block mt-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-extrabold">
                  🔟 عشرة عشرة (10 - 10)
                </span>
              </div>
            </div>
            <Play className={`w-5 h-5 ${isLvl2Active ? 'text-amber-200 fill-amber-200 scale-125' : 'text-emerald-200 fill-emerald-200'}`} />
          </button>

          {/* Level 3 Button */}
          <button
            onClick={() => handleLevelClick(3)}
            className={`w-full relative flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg transition-all duration-300 transform cursor-pointer text-right border ${
              isLvl3Active
                ? 'scale-105 ring-4 ring-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.8)] border-amber-300 z-10'
                : 'hover:from-purple-500 hover:to-indigo-400 border-purple-400/40 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">💯</span>
              <div>
                <div className="font-black text-base leading-snug">المرحلة الثالثة</div>
                <div className="text-[11px] text-purple-100 font-medium">العد مئة مئة من 100 إلى 1000</div>
                <span className="inline-block mt-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-extrabold">
                  👑 مئة مئة (100 - 100)
                </span>
              </div>
            </div>
            <Play className={`w-5 h-5 ${isLvl3Active ? 'text-amber-200 fill-amber-200 scale-125' : 'text-purple-200 fill-purple-200'}`} />
          </button>

          {/* Level 4 Button - Challenge Stage */}
          <button
            onClick={() => handleLevelClick(4)}
            className={`w-full relative flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-lg transition-all duration-300 transform cursor-pointer text-right border ${
              isLvl4Active
                ? 'scale-105 ring-4 ring-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.8)] border-amber-300 z-10'
                : 'hover:from-amber-400 hover:to-red-400 border-amber-400/40 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎲</span>
              <div>
                <div className="font-black text-base leading-snug flex items-center gap-1.5">
                  <span>مرحلة التحدي</span>
                  <span className="text-[10px] bg-amber-300 text-slate-900 font-extrabold px-1.5 py-0.5 rounded-full">
                    اختياري 🌟
                  </span>
                </div>
                <div className="text-[11px] text-amber-100 font-medium">أعداد عشوائية دون ترتيب لتعزيز الحفظ</div>
                <span className="inline-block mt-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-extrabold">
                  🔥 أعداد عشوائية ممتعة
                </span>
              </div>
            </div>
            <Play className={`w-5 h-5 ${isLvl4Active ? 'text-amber-200 fill-amber-200 scale-125' : 'text-amber-100 fill-amber-100'}`} />
          </button>
        </div>

        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 transition-all cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع إلى القائمة</span>
        </button>
      </div>
    </div>
  );
};

