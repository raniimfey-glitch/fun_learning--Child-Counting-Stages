import React from 'react';
import { Volume2, Settings } from 'lucide-react';
import { LevelType, AudioSettings } from '../types';

interface HeaderProps {
  currentLevel: LevelType;
  currentIndex: number;
  totalItems: number;
  audioSettings: AudioSettings;
  onOpenAudioSettings: () => void;
  isPlayingAudio: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevel,
  currentIndex,
  totalItems,
  audioSettings,
  onOpenAudioSettings,
  isPlayingAudio,
}) => {
  const progressPercent = Math.round(((currentIndex) / totalItems) * 100);

  return (
    <header className="relative z-20 w-full bg-white/75 backdrop-blur-md border-b-2 border-amber-300/60 px-4 py-2 shadow-xs">
      <div className="max-w-md mx-auto flex flex-col items-center justify-center gap-1 text-center">
        <div className="w-full flex items-center justify-between">
          {/* Audio Status & Settings Button */}
          <button
            onClick={onOpenAudioSettings}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs border ${
              isPlayingAudio
                ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="إعدادات الصوت والصوت عالي الدقة"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-amber-600 animate-bounce' : 'text-slate-500'}`} />
            <span>{audioSettings.engine === 'gemini' ? 'صوت AI الفائق' : audioSettings.engine === 'native' ? 'صوت الجهاز' : 'صوت ذكي'}</span>
            <Settings className="w-3 h-3 text-slate-400 mr-0.5" />
          </button>

          {/* Title */}
          <h1 className="text-lg font-black bg-gradient-to-r from-pink-600 via-amber-500 to-emerald-500 bg-clip-text text-transparent">
            ✨ التّعلّم الممتع ✨
          </h1>

          <div className="text-xs font-bold text-slate-500 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            رنيم فاي
          </div>
        </div>

        {/* Level subtitle */}
        <p className="text-xs font-extrabold text-slate-700 bg-amber-50/80 px-3 py-0.5 rounded-full border border-amber-200/50">
          {currentLevel === 1
            ? '🎯 تعلّم العدّ من 1 إلى 10'
            : currentLevel === 2
            ? '🚀 العدّ عشرة عشرة من 10 إلى 100'
            : currentLevel === 3
            ? '👑 العدّ مئة مئة من 100 إلى 1000'
            : '🔥 مرحلة التحدي (أعداد عشوائية)'}
        </p>

        {/* Progress bar */}
        <div className="w-full mt-1">
          <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-0.5 px-1">
            <span>التقدم</span>
            <span>العدد {currentIndex + 1} من {totalItems}</span>
          </div>
          <div className="h-2.5 w-full bg-slate-200/80 rounded-full overflow-hidden p-0.5 border border-slate-300/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-amber-400 to-emerald-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
