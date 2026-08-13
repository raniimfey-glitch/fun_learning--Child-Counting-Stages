import React from 'react';
import { Volume2, Check, Sparkles, X, Play } from 'lucide-react';
import { AudioSettings } from '../types';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AudioSettings;
  onUpdateSettings: (newSettings: Partial<AudioSettings>) => void;
  onTestAudio: () => void;
  isPlayingTest: boolean;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onTestAudio,
  isPlayingTest,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border-4 border-amber-300 text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2 mb-4 text-slate-800 font-black text-base border-b border-slate-100 pb-3">
          <div className="p-2 bg-amber-100 rounded-2xl text-amber-600">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3>إعدادات الصوت والنطق الصوتي</h3>
            <p className="text-xs font-semibold text-slate-500">اختر الصوت الأكثر دقة وسلامة في النطق</p>
          </div>
        </div>

        {/* Engine Selection */}
        <div className="mb-4">
          <label className="block text-xs font-extrabold text-slate-700 mb-2">
            🔊 محرك الصوت والنطق:
          </label>
          <div className="space-y-2">
            <button
              onClick={() => onUpdateSettings({ engine: 'auto' })}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 text-xs font-extrabold transition-all text-right ${
                settings.engine === 'auto'
                  ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="font-black text-sm">تلقائي فائق الدقة (موصى به)</div>
                  <div className="text-[10px] text-slate-500 font-normal">صوت AI نقي مع التشكيل الكامل</div>
                </div>
              </div>
              {settings.engine === 'auto' && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
            </button>

            <button
              onClick={() => onUpdateSettings({ engine: 'gemini' })}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 text-xs font-extrabold transition-all text-right ${
                settings.engine === 'gemini'
                  ? 'border-purple-400 bg-purple-50 text-purple-900 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
              }`}
            >
              <div>
                <div className="font-black text-sm">صوت AI الذكي (Gemini TTS)</div>
                <div className="text-[10px] text-slate-500 font-normal">نطق عربي دافئ من السحابة</div>
              </div>
              {settings.engine === 'gemini' && <Check className="w-4 h-4 text-purple-600 shrink-0" />}
            </button>

            <button
              onClick={() => onUpdateSettings({ engine: 'native' })}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 text-xs font-extrabold transition-all text-right ${
                settings.engine === 'native'
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-900 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
              }`}
            >
              <div>
                <div className="font-black text-sm">صوت المتصفح المحلي</div>
                <div className="text-[10px] text-slate-500 font-normal">صوت جهازك مع حفظ التشكيل الأبجدي</div>
              </div>
              {settings.engine === 'native' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
            </button>
          </div>
        </div>

        {/* Speed / Rate Selection */}
        <div className="mb-4">
          <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
            ⏱️ سرعة القراءة والنطق للأطفال:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'بطيء جداً', rate: 0.7 },
              { label: 'مريح (عادي)', rate: 0.85 },
              { label: 'سريع', rate: 1.0 },
            ].map((item) => (
              <button
                key={item.rate}
                onClick={() => onUpdateSettings({ rate: item.rate })}
                className={`py-2 px-1 text-center rounded-xl text-xs font-black transition-all ${
                  settings.rate === item.rate
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Gender Selection */}
        <div className="mb-5">
          <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
            🗣️ طابع الصوت:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateSettings({ voiceGender: 'female' })}
              className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all text-center ${
                settings.voiceGender === 'female'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🌸 صوت أنثوي دافئ
            </button>
            <button
              onClick={() => onUpdateSettings({ voiceGender: 'male' })}
              className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all text-center ${
                settings.voiceGender === 'male'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🌙 صوت ذكوري واضح
            </button>
          </div>
        </div>

        {/* Test Voice Button */}
        <button
          onClick={onTestAudio}
          disabled={isPlayingTest}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-black rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-60"
        >
          <Play className={`w-4 h-4 ${isPlayingTest ? 'animate-spin' : ''}`} />
          <span>{isPlayingTest ? 'جاري نطق نموذج التجربة...' : 'اختبار النطق الصوتي ✨'}</span>
        </button>
      </div>
    </div>
  );
};
