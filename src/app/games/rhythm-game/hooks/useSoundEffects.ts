import { useEffect, useRef } from 'react';
import { JudgementType } from '../types';

const SOUND_EFFECTS = {
  perfect: '/audio/effects/perfect.mp3',
  great: '/audio/effects/great.mp3',
  good: '/audio/effects/good.mp3',
  miss: '/audio/effects/miss.mp3',
  hit: '/audio/effects/hit.mp3',
};

export const useSoundEffects = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    // 音声ファイルを事前にロード
    Object.entries(SOUND_EFFECTS).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.volume = key === 'miss' ? 0.3 : 0.5;
      audioRefs.current[key] = audio;
    });

    return () => {
      // クリーンアップ時に音声を解放
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  const playJudgementSound = (judgement: JudgementType) => {
    const key = judgement.toLowerCase();
    const audio = audioRefs.current[key];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  const playHitSound = () => {
    const audio = audioRefs.current.hit;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  return {
    playJudgementSound,
    playHitSound,
  };
};
