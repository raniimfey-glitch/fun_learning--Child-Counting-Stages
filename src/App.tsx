import React, { useState, useEffect, useRef } from 'react';
import { LEVEL_1_NUMBERS, LEVEL_2_NUMBERS, LEVEL_3_NUMBERS } from './data/numbers';
import { CharacterType, LevelType, MistakeItem, AudioSettings } from './types';
import { speakText, playMagicChime, playButtonSound, triggerHapticFeedback } from './services/ttsService';
import { triggerConfetti } from './utils/confetti';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LevelSelectScreen } from './components/LevelSelectScreen';
import { LearningScreen } from './components/LearningScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { FinalScreen } from './components/FinalScreen';
import { AudioSettingsModal } from './components/AudioSettingsModal';

type ScreenType = 'welcome' | 'level_select' | 'learning' | 'review' | 'final';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('welcome');
  const [selectedChar, setSelectedChar] = useState<CharacterType>(null);
  const [currentLevel, setCurrentLevel] = useState<LevelType>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [challengeNumbers, setChallengeNumbers] = useState<any[]>([]);

  const [listened, setListened] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(15);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [statusType, setStatusType] = useState<'ok' | 'bad' | 'info' | ''>('');
  const [hintMsg, setHintMsg] = useState<string>('اضغط «اسمع» ثم كرِّر العدد');
  const [canProceed, setCanProceed] = useState<boolean>(false);

  const [attempts, setAttempts] = useState<number>(0);
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);

  // Audio settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    engine: 'auto',
    rate: 0.85,
    voiceGender: 'female',
  });
  const [isAudioModalOpen, setIsAudioModalOpen] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isPlayingTest, setIsPlayingTest] = useState<boolean>(false);

  // References for timers and speech recognition
  const recTimerRef = useRef<any>(null);
  const countdownTimerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  const currentNumbers =
    currentLevel === 1
      ? LEVEL_1_NUMBERS
      : currentLevel === 2
      ? LEVEL_2_NUMBERS
      : currentLevel === 3
      ? LEVEL_3_NUMBERS
      : challengeNumbers.length > 0
      ? challengeNumbers
      : LEVEL_1_NUMBERS;
  const currentNumItem = currentNumbers[currentIndex];

  // Update gender preference when character selected
  const handleSelectChar = (char: CharacterType) => {
    setSelectedChar(char);
    const newGender = char === 'girl' ? 'female' : 'male';
    setAudioSettings((prev) => ({ ...prev, voiceGender: newGender }));
    playButtonSound();

    const greet = char === 'girl' ? 'أَهْلاً بِكِ يَا نَجْمَتِي!' : 'أَهْلاً بِكَ يَا قَمَرِي!';
    speakText(greet, { ...audioSettings, voiceGender: newGender }, () => setIsPlayingAudio(true), () => setIsPlayingAudio(false));
  };

  const handleStartFromWelcome = () => {
    if (!selectedChar) return;
    playButtonSound();
    setScreen('level_select');
  };

  const handleSelectLevel = (level: LevelType) => {
    setCurrentLevel(level);
    setCurrentIndex(0);
    setMistakes([]);
    setAttempts(0);
    setListened(false);
    setCanProceed(false);
    setStatusMsg('');
    setStatusType('');
    setHintMsg('اضغط «اسمع» ثم كرِّر العدد');

    playButtonSound();

    let firstNumStr = '';

    if (level === 4) {
      const combined = [
        ...LEVEL_1_NUMBERS,
        ...LEVEL_2_NUMBERS.filter((n) => n.n > 10),
        ...LEVEL_3_NUMBERS.filter((n) => n.n > 100),
      ];
      const shuffled = [...combined].sort(() => Math.random() - 0.5);
      setChallengeNumbers(shuffled);
      firstNumStr = shuffled[0].s;
    } else {
      const numbersList =
        level === 1 ? LEVEL_1_NUMBERS : level === 2 ? LEVEL_2_NUMBERS : LEVEL_3_NUMBERS;
      firstNumStr = numbersList[0].s;
    }

    setScreen('learning');

    setTimeout(() => {
      speakText(firstNumStr, audioSettings, () => setIsPlayingAudio(true), () => setIsPlayingAudio(false));
    }, 150);
  };

  // 🔊 Listen Button handler
  const handleListen = () => {
    if (isRecording) return;
    triggerHapticFeedback([40, 30, 40]);
    playButtonSound();

    setHintMsg('استمعتَ جيداً! 👂 الآن تكلم 🎤');
    setStatusMsg('🎯 الآن كرِّر العدد — اضغط «تكلم»');
    setStatusType('info');

    speakText(
      currentNumItem.s,
      audioSettings,
      () => setIsPlayingAudio(true),
      () => {
        setIsPlayingAudio(false);
        setListened(true);
      }
    );
  };

  // Stop recording timer & cleanup
  const stopRecording = () => {
    setIsRecording(false);
    if (recTimerRef.current) clearTimeout(recTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  // Check spoken answer
  const checkAnswer = (saidText: string) => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    const cleanInput = saidText.replace(/[\u064B-\u065F]/g, '').trim();
    const isCorrect = currentNumItem.accept?.some((acc) => cleanInput.includes(acc));

    if (isCorrect) {
      playMagicChime();
      triggerConfetti(45);
      const isGirl = selectedChar === 'girl';

      setStatusMsg(isGirl ? 'أَحْسَنْتِ! 🌟 إِجَابَةٌ صَحِيحَةٌ' : 'أَحْسَنْتَ! 🌟 إِجَابَةٌ صَحِيحَةٌ');
      setStatusType('ok');
      setHintMsg('رائع! 🎉 اضغط «التالي» ➜');
      setCanProceed(true);

      const praiseText = isGirl
        ? 'أَحْسَنْتِ ، مُمْتَازَةٌ ، رَائِعٌ يَا بَطَلَة'
        : 'أَحْسَنْتَ ، مُمْتَازٌ يَا بَطَلْ';

      speakText(praiseText, audioSettings, () => setIsPlayingAudio(true), () => setIsPlayingAudio(false));
    } else {
      if (nextAttempts < 3) {
        const remaining = 3 - nextAttempts;
        const isGirl = selectedChar === 'girl';
        setStatusMsg(`❌ حَاوِلْ مُجَدَّداً! (بَقِيَتْ ${remaining} مُحَاوَلات)`);
        setStatusType('bad');
        setHintMsg('اضغط «اسمع» مجدداً ثم تكلم 🎤');

        const retryText = isGirl
          ? `حَاوِلِي مَرَّةً أُخْرَى، قُولِي: ${currentNumItem.s}`
          : `حَاوِلْ مَرَّةً أُخْرَى، قُلْ: ${currentNumItem.s}`;

        speakText(retryText, audioSettings, () => setIsPlayingAudio(true), () => setIsPlayingAudio(false));
      } else {
        // Exceeded 3 attempts
        setMistakes((prev) => [...prev, { num: currentNumItem, said: saidText }]);
        setStatusMsg(`الجَوَابُ الصَّحِيحُ: ${currentNumItem.w} — سَنُرَاجِعُهُ لاَحِقاً 📝`);
        setStatusType('bad');
        setCanProceed(true);
        setHintMsg('اضغط «التالي» للمتابعة ➜');

        speakText(`الْجَوَابُ الصَّحِيحُ هُوَ ${currentNumItem.s}. سَنُرَاجِعُهُ لاَحِقاً`, audioSettings, () => setIsPlayingAudio(true), () => setIsPlayingAudio(false));
      }
    }
  };

  // 🎤 Mic Button handler
  const handleMic = () => {
    triggerHapticFeedback(65);
    if (!listened) {
      setStatusMsg('⚠️ اضغط «اسمع» أولاً!');
      setStatusType('bad');
      return;
    }

    if (isRecording) {
      stopRecording();
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setStatusMsg('⚠️ متصفحك لا يدعم الميكروفون بشكل مباشر');
      setStatusType('bad');
      return;
    }

    setIsRecording(true);
    setCountdown(15);
    setStatusMsg('🎙️ تحدَّث الآن... أسمعك');
    setStatusType('info');

    // Countdown
    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current);
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      const rec = new SpeechRec();
      recognitionRef.current = rec;
      rec.lang = 'ar-SA';
      rec.interimResults = false;
      rec.maxAlternatives = 6;

      rec.onresult = (e: any) => {
        stopRecording();
        let allSaid: string[] = [];
        for (let r = 0; r < e.results.length; r++) {
          for (let a = 0; a < e.results[r].length; a++) {
            allSaid.push((e.results[r][a].transcript || '').trim());
          }
        }
        const spoken = allSaid.join(' ');
        checkAnswer(spoken);
      };

      rec.onerror = (e: any) => {
        stopRecording();
        if (e.error === 'no-speech') {
          setStatusMsg('🎤 لم أسمع شيئاً، حاول مجدداً!');
        } else {
          setStatusMsg('🎤 حدث خطأ أثناء الاستماع، حاول مجدداً!');
        }
        setStatusType('bad');
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      rec.start();

      recTimerRef.current = setTimeout(() => {
        stopRecording();
      }, 15500);
    } catch (err) {
      stopRecording();
      setStatusMsg('⚠️ لم نتمكن من تشغيل الميكروفون');
      setStatusType('bad');
    }
  };

  // ▶ Next Button handler
  const handleNext = () => {
    playButtonSound();
    stopRecording();

    if (currentIndex + 1 < currentNumbers.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setListened(false);
      setCanProceed(false);
      setAttempts(0);
      setStatusMsg('');
      setStatusType('');
      setHintMsg('اضغط «اسمع» ثم كرِّر العدد');

      const nextItem = currentNumbers[nextIdx];
      speakText(nextItem.s, audioSettings, () => setIsPlayingAudio(true), () => setIsPlayingAudio(false));
    } else {
      // Completed current level
      if (mistakes.length > 0) {
        setScreen('review');
        speakText('هَيَّا نُرَاجِعُ الأَعْدَادَ الَّتِي تَحْتَاجُ تَدْرِيباً أِكْثَرَ', audioSettings, () => setIsPlayingAudio(true), () => setIsPlayingAudio(false));
      } else {
        setScreen('final');
        playMagicChime();
        const finalPraise = currentLevel === 1
          ? 'أَحْسَنْتَ! تَعَلَّمْتَ الأَعْدَادَ مِنْ وَاحِدٍ إِلَى عَشَرَةٍ!'
          : 'رَائِعٌ! تَعَلَّمْتَ الْعَدَّ عَدَداً عَدَداً حَتَّى الْمِئَةِ!';
        speakText(finalPraise, audioSettings, () => setIsPlayingAudio(true), () => setIsPlayingAudio(false));
      }
    }
  };

  // Audio test modal handler
  const handleTestAudio = () => {
    setIsPlayingTest(true);
    const testText = 'وَاحِدٌ، اِثْنَانِ، ثَلَاثَةٌ. نَطْقٌ صَوْتِيٌّ عَالِي الدِّقَّةِ وَسَلِيمٌ!';
    speakText(
      testText,
      audioSettings,
      () => setIsPlayingAudio(true),
      () => {
        setIsPlayingAudio(false);
        setIsPlayingTest(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-emerald-200 via-green-300 to-emerald-500 text-slate-800 flex flex-col font-sans dir-rtl">
      {/* Header */}
      {screen !== 'welcome' && (
        <Header
          currentLevel={currentLevel}
          currentIndex={currentIndex}
          totalItems={currentNumbers.length}
          audioSettings={audioSettings}
          onOpenAudioSettings={() => setIsAudioModalOpen(true)}
          isPlayingAudio={isPlayingAudio}
        />
      )}

      {/* Body Screens */}
      <main className="flex-1 flex items-center justify-center p-2 relative z-10">
        {screen === 'welcome' && (
          <WelcomeScreen
            selectedChar={selectedChar}
            onSelectChar={handleSelectChar}
            onStart={handleStartFromWelcome}
          />
        )}

        {screen === 'level_select' && (
          <LevelSelectScreen
            audioSettings={audioSettings}
            selectedChar={selectedChar}
            onSelectLevel={handleSelectLevel}
            onBackToWelcome={() => setScreen('welcome')}
          />
        )}

        {screen === 'learning' && (
          <LearningScreen
            currentNum={currentNumItem}
            currentLevel={currentLevel}
            listened={listened}
            isRecording={isRecording}
            countdown={countdown}
            statusMsg={statusMsg}
            statusType={statusType}
            hintMsg={hintMsg}
            canProceed={canProceed}
            onListen={handleListen}
            onMic={handleMic}
            onNext={handleNext}
            onBackToLevels={() => setScreen('level_select')}
          />
        )}

        {screen === 'review' && (
          <ReviewScreen
            mistakes={mistakes}
            onReplayNum={(num) => speakText(num.s, audioSettings)}
            onFinishReview={() => {
              setScreen('final');
              playMagicChime();
            }}
          />
        )}

        {screen === 'final' && (
          <FinalScreen
            level={currentLevel}
            selectedChar={selectedChar}
            onRestart={() => {
              setScreen('welcome');
              setSelectedChar(null);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-20 bg-white/60 backdrop-blur-md border-t border-amber-200/50 py-2 px-4 text-center text-[11px] font-bold text-slate-600 flex justify-center items-center gap-2">
        <span>سميرة عبد الصدوق</span>
        <span className="opacity-40">|</span>
        <span className="text-emerald-700 font-extrabold">التعلم الممتع</span>
        <span className="opacity-40">|</span>
        <span>&copy; جميع الحقوق محفوظة 2026</span>
      </footer>

      {/* Audio Settings Modal */}
      <AudioSettingsModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        settings={audioSettings}
        onUpdateSettings={(newSet) => setAudioSettings((prev) => ({ ...prev, ...newSet }))}
        onTestAudio={handleTestAudio}
        isPlayingTest={isPlayingTest}
      />
    </div>
  );
}
