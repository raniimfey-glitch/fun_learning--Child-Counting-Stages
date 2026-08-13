import React from 'react';
import { CharacterType } from '../types';

interface WelcomeScreenProps {
  selectedChar: CharacterType;
  onSelectChar: (type: CharacterType) => void;
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  selectedChar,
  onSelectChar,
  onStart,
}) => {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-4 text-center overflow-hidden animate-fade-in">
      {/* Background stars and decorative floating icons */}
      <div className="absolute top-8 right-6 text-2xl opacity-30 animate-bounce">🦋</div>
      <div className="absolute top-12 left-6 text-2xl opacity-30 animate-pulse">🌸</div>
      <div className="absolute bottom-16 right-8 text-2xl opacity-30 animate-spin" style={{ animationDuration: '12s' }}>⭐</div>
      <div className="absolute bottom-16 left-8 text-2xl opacity-30 animate-bounce">🌈</div>

      <div className="max-w-xs w-full flex flex-col items-center z-10">
        {/* App Logo */}
        <div className="text-6xl mb-2 animate-bounce" style={{ animationDuration: '2s' }}>
          🦋
        </div>

        {/* Title & Brand */}
        <h2 className="text-3xl font-black bg-gradient-to-r from-amber-300 via-pink-400 to-teal-300 bg-clip-text text-transparent drop-shadow-md leading-tight mb-1">
          التّعلّم الممتع
        </h2>
        <div className="text-base font-black text-teal-300 tracking-widest mb-2 drop-shadow-sm">
          رَنِيم فَاي ✨
        </div>
        <p className="text-sm font-bold text-slate-300 mb-6">
          ✨ <span className="text-amber-300">تعلّم العدّ من 1 إلى 10 ومن 10 إلى 100</span> ✨
        </p>

        {/* Character Selection */}
        <div className="w-full mb-6">
          <p className="text-xs font-bold text-slate-300 mb-3">👇 اختر شخصيتك للبدء:</p>
          <div className="flex justify-center gap-4">
            {/* Girl button */}
            <button
              onClick={() => onSelectChar('girl')}
              className={`flex-1 flex flex-col items-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedChar === 'girl'
                  ? 'bg-pink-500/20 border-pink-400 shadow-[0_0_20px_rgba(244,114,182,0.4)] scale-105'
                  : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
              }`}
            >
              <span className="text-4xl mb-1">⭐</span>
              <span className="text-xs font-black text-pink-300">بِنْت (نجمة)</span>
            </button>

            {/* Boy button */}
            <button
              onClick={() => onSelectChar('boy')}
              className={`flex-1 flex flex-col items-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedChar === 'boy'
                  ? 'bg-sky-500/20 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.4)] scale-105'
                  : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
              }`}
            >
              <span className="text-4xl mb-1">🌙</span>
              <span className="text-xs font-black text-sky-300">وَلَد (هلال)</span>
            </button>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          disabled={!selectedChar}
          className="w-full py-3.5 px-8 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-900 font-black text-lg rounded-full shadow-[0_8px_25px_rgba(251,191,36,0.4)] transition-all transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          🚀 ابدأ الرحلة!
        </button>
      </div>
    </div>
  );
};
