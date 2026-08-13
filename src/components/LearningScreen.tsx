import React from 'react';
import { Volume2, Mic, Play, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { NumberItem, LevelType } from '../types';

interface LearningScreenProps {
  currentNum: NumberItem;
  currentLevel: LevelType;
  listened: boolean;
  isRecording: boolean;
  countdown: number;
  statusMsg: string;
  statusType: 'ok' | 'bad' | 'info' | '';
  hintMsg: string;
  canProceed: boolean;
  onListen: () => void;
  onMic: () => void;
  onNext: () => void;
  onBackToLevels: () => void;
}

export const LearningScreen: React.FC<LearningScreenProps> = ({
  currentNum,
  currentLevel,
  listened,
  isRecording,
  countdown,
  statusMsg,
  statusType,
  hintMsg,
  canProceed,
  onListen,
  onMic,
  onNext,
  onBackToLevels,
}) => {
  // Shape count calculation
  const shapesCount = currentLevel === 1 ? currentNum.n : currentNum.n / 10;

  return (
    <div className="w-full max-w-md mx-auto p-3 animate-fade-in">
      {/* Main Container Card */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-[32px] p-4 shadow-2xl border-4 border-amber-300/80 text-center overflow-hidden">
        {/* Top rainbow accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-amber-400 via-emerald-400 to-sky-400" />

        {/* Back Button */}
        <div className="flex justify-start mb-2">
          <button
            onClick={onBackToLevels}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>المراحل</span>
          </button>
        </div>

        {/* Interactive Butterfly Display */}
        <div className="relative flex justify-center items-center h-64 mb-2">
          {/* Wings Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Top Right Wing */}
            <div
              className="absolute w-36 h-40 rounded-full blur-[0.4px] wing-flap-r"
              style={{
                background: `radial-gradient(ellipse at 64% 42%, ${currentNum.wc[0]}, ${currentNum.wc[1]} 44%, ${currentNum.wc[2]} 82%)`,
                transformOrigin: 'left center',
                right: 'calc(50% - 130px)',
                top: 'calc(50% - 90px)',
                clipPath: 'ellipse(72px 82px at 64% 42%)',
              }}
            />
            {/* Top Left Wing */}
            <div
              className="absolute w-36 h-40 rounded-full blur-[0.4px] wing-flap-l"
              style={{
                background: `radial-gradient(ellipse at 36% 42%, ${currentNum.wc[3]}, ${currentNum.wc[4]} 44%, ${currentNum.wc[5]} 82%)`,
                transformOrigin: 'right center',
                left: 'calc(50% - 130px)',
                top: 'calc(50% - 90px)',
                clipPath: 'ellipse(72px 82px at 36% 42%)',
              }}
            />
            {/* Bottom Right Wing */}
            <div
              className="absolute w-28 h-24 rounded-full blur-[0.4px] wing-flap-r2"
              style={{
                background: `radial-gradient(ellipse at 64% 32%, ${currentNum.wc[0]}, ${currentNum.wc[1]} 52%, ${currentNum.wc[2]})`,
                transformOrigin: 'left center',
                right: 'calc(50% - 110px)',
                top: 'calc(50% + 10px)',
                clipPath: 'ellipse(57px 49px at 64% 32%)',
              }}
            />
            {/* Bottom Left Wing */}
            <div
              className="absolute w-28 h-24 rounded-full blur-[0.4px] wing-flap-l2"
              style={{
                background: `radial-gradient(ellipse at 36% 32%, ${currentNum.wc[3]}, ${currentNum.wc[4]} 52%, ${currentNum.wc[5]})`,
                transformOrigin: 'right center',
                left: 'calc(50% - 110px)',
                top: 'calc(50% + 10px)',
                clipPath: 'ellipse(57px 49px at 36% 32%)',
              }}
            />
          </div>

          {/* Butterfly Body Card */}
          <div className="relative z-10 flex flex-col items-center bg-white/95 rounded-[36px] px-5 py-3 shadow-lg border-2 border-pink-200/80 min-w-[150px] gap-1">
            {/* Butterfly Antennae */}
            <div className="absolute -top-4 flex justify-between w-12 text-amber-500 font-extrabold text-sm pointer-events-none select-none">
              <span className="transform -rotate-12 animate-bounce" style={{ animationDuration: '2s' }}>🌸</span>
              <span className="transform rotate-12 animate-bounce" style={{ animationDuration: '2.2s' }}>🌸</span>
            </div>
            {/* Big Number */}
            <div
              className="text-5xl font-black leading-none drop-shadow-xs font-sans"
              style={{
                backgroundImage: currentNum.ng,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {currentNum.n}
            </div>

            {/* Separator */}
            <div className="w-12 h-1 rounded-full" style={{ background: currentNum.ng }} />

            {/* Shapes Card - Shown in Levels 1 and 2 only */}
            {currentLevel < 3 && (
              <div
                className="w-full flex flex-wrap justify-center items-center gap-1.5 py-1.5 px-3 rounded-2xl border-2 border-white/80 shadow-inner min-h-[50px] my-1"
                style={{ background: currentNum.shBg }}
              >
                {Array.from({ length: shapesCount }).map((_, i) => (
                  <span
                    key={i}
                    className="text-2xl leading-none transition-transform hover:scale-125"
                  >
                    {currentNum.emoji}
                  </span>
                ))}
              </div>
            )}

            {/* Tashkeel Word Card */}
            <div
              className="w-full py-1.5 px-4 rounded-xl border-2 border-white/80 shadow-md transition-colors"
              style={{ background: currentNum.wBg }}
            >
              <div className="text-xl font-black text-white drop-shadow-md tracking-wide">
                {currentNum.w}
              </div>
            </div>
          </div>
        </div>

        {/* Instruction Hint Banner */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 bg-sky-100/70 border border-sky-300/50 rounded-full py-1.5 px-4 mb-3">
          <span>🎯</span>
          <span>{hintMsg}</span>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2 justify-center mb-3">
          {/* 🔊 Listen Button */}
          <button
            onClick={onListen}
            disabled={isRecording}
            className="flex-1 max-w-[110px] py-3 px-2 rounded-2xl font-black text-white flex flex-col items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer bg-gradient-to-b from-amber-400 via-amber-500 to-orange-600 border-b-4 border-orange-700 hover:brightness-110 disabled:opacity-50"
          >
            <Volume2 className="w-6 h-6 animate-pulse" />
            <span className="text-xs">اسمع</span>
          </button>

          {/* 🎤 Speak Button */}
          <button
            onClick={onMic}
            className={`flex-1 max-w-[110px] py-3 px-2 rounded-2xl font-black text-white flex flex-col items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer border-b-4 ${
              isRecording
                ? 'bg-gradient-to-b from-red-500 to-red-700 border-red-900 animate-pulse'
                : 'bg-gradient-to-b from-sky-400 via-sky-500 to-blue-600 border-blue-800 hover:brightness-110'
            }`}
          >
            <Mic className={`w-6 h-6 ${isRecording ? 'animate-ping' : ''}`} />
            <span className="text-xs">
              {isRecording ? `تكلم (${countdown})` : 'تكلم'}
            </span>
          </button>

          {/* ▶ Next Button */}
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`flex-1 max-w-[110px] py-3 px-2 rounded-2xl font-black text-white flex flex-col items-center gap-1 shadow-md transition-all border-b-4 ${
              canProceed
                ? 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-green-600 border-green-800 hover:brightness-110 cursor-pointer active:scale-95'
                : 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Play className="w-6 h-6 fill-current" />
            <span className="text-xs">التالي</span>
          </button>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-2xl text-xs font-black transition-all ${
              statusType === 'ok'
                ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400'
                : statusType === 'bad'
                ? 'bg-rose-100 text-rose-800 border-2 border-rose-300'
                : 'bg-sky-100 text-sky-800 border-2 border-sky-300'
            }`}
          >
            {statusType === 'ok' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : statusType === 'bad' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : null}
            <span>{statusMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
