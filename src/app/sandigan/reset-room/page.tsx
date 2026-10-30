'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function SandiganResetRoomPage() {
  const { isDarkMode } = useSandigan();
  const [activeTab, setActiveTab] = useState<'breathing' | 'grounding' | 'ambient'>('breathing');

  // Breathing state
  const [technique, setTechnique] = useState<'box' | '478'>('box');
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [countdown, setCountdown] = useState(4);
  const [cycles, setCycles] = useState(0);

  // Grounding state
  const [groundingStep, setGroundingStep] = useState(1);
  const prompts = [
    { count: 5, prompt: 'Notice 5 things you can SEE around you right now.', hint: 'A pen, desk texture, window light, shoes, book.' },
    { count: 4, prompt: 'Notice 4 things you can physically TOUCH or FEEL.', hint: 'Your shirt cloth, cool desk surface, phone glass, chair.' },
    { count: 3, prompt: 'Notice 3 distinct sounds you can HEAR.', hint: 'Fan hum, gentle breath, birds outside, clock tick.' },
    { count: 2, prompt: 'Notice 2 things you can SMELL.', hint: 'Coffee, paper, laundry detergent, cool air.' },
    { count: 1, prompt: 'Notice 1 positive thing you TASTE or feel GRATEFUL for.', hint: 'Cool water, a warm memory, or being safe in this moment.' },
  ];

  // Ambient sound synth
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [soundType, setSoundType] = useState<'rain' | 'waves' | 'binaural'>('rain');
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Breathing loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (technique === 'box') {
              if (phase === 'Inhale') { setPhase('Hold'); return 4; }
              if (phase === 'Hold') { setPhase('Exhale'); return 4; }
              if (phase === 'Exhale') { setPhase('Rest'); return 4; }
              if (phase === 'Rest') {
                setCycles(c => c + 1);
                setPhase('Inhale');
                return 4;
              }
            } else {
              if (phase === 'Inhale') { setPhase('Hold'); return 7; }
              if (phase === 'Hold') { setPhase('Exhale'); return 8; }
              if (phase === 'Exhale') {
                setCycles(c => c + 1);
                setPhase('Inhale');
                return 4;
              }
            }
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase, technique]);

  const toggleBreathing = () => {
    if (!isActive) {
      setPhase('Inhale');
      setCountdown(4);
    }
    setIsActive(!isActive);
  };

  const resetBreathing = () => {
    setIsActive(false);
    setPhase('Inhale');
    setCountdown(4);
    setCycles(0);
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
      setIsPlayingAudio(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        if (soundType === 'binaural') {
          const o1 = ctx.createOscillator();
          const o2 = ctx.createOscillator();
          const g = ctx.createGain();
          g.gain.value = 0.04;
          o1.frequency.value = 136.1;
          o2.frequency.value = 142.1;
          o1.connect(g);
          o2.connect(g);
          g.connect(ctx.destination);
          o1.start();
          o2.start();
        } else {
          const bufferSize = ctx.sampleRate * 2;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let b0 = 0, b1 = 0, b2 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            output[i] = (b0 + b1 + b2) * 0.04;
          }
          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          whiteNoise.loop = true;
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = soundType === 'waves' ? 380 : 650;
          whiteNoise.connect(filter);
          filter.connect(ctx.destination);
          whiteNoise.start();
        }
        setIsPlayingAudio(true);
      } catch (e) {
        console.warn('Web audio not supported:', e);
      }
    }
  };

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 px-3 py-1 rounded-full bg-teal-500/10 inline-block">
          The Reset Room (Project Sandigan)
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Pause. Regulate. Breathe.
        </h1>
        <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Evidence-based sensory regulation tools to down-regulate nervous system overdrive, relieve heart palpitation sensations, and center your focus.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="p-1 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('breathing')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'breathing'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Guided Breathing
          </button>
          <button
            onClick={() => setActiveTab('grounding')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'grounding'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            5-4-3-2-1 Sensory Grounding
          </button>
          <button
            onClick={() => setActiveTab('ambient')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'ambient'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Ambient Soundscape
          </button>
        </div>
      </div>

      {/* TAB 1: BREATHING */}
      {activeTab === 'breathing' && (
        <div
          className={`p-8 sm:p-12 rounded-3xl border shadow-xl text-center space-y-8 animate-in fade-in ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          {/* Sub-modes */}
          <div className="flex justify-center gap-2 text-xs">
            <button
              onClick={() => { setTechnique('box'); resetBreathing(); }}
              className={`px-3 py-1.5 rounded-xl border font-bold ${
                technique === 'box'
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              Box Breathing (4-4-4-4)
            </button>
            <button
              onClick={() => { setTechnique('478'); resetBreathing(); }}
              className={`px-3 py-1.5 rounded-xl border font-bold ${
                technique === '478'
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              4-7-8 Deep Sleep & Calming
            </button>
          </div>

          {/* Visual Breathing Sphere */}
          <div className="relative flex items-center justify-center h-64">
            <div
              className={`w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl ${
                phase === 'Inhale'
                  ? 'scale-125 bg-gradient-to-tr from-teal-400 to-emerald-500 shadow-teal-500/40'
                  : phase === 'Hold'
                  ? 'scale-125 bg-gradient-to-tr from-teal-500 to-sky-500 shadow-sky-500/40'
                  : phase === 'Exhale'
                  ? 'scale-90 bg-gradient-to-tr from-teal-700 to-tk-deepblue shadow-teal-900/40'
                  : 'scale-90 bg-slate-400'
              }`}
            >
              <span className="text-white font-black text-2xl uppercase drop-shadow">
                {isActive ? phase : 'Ready'}
              </span>
              <span className="text-white/95 font-mono text-3xl font-extrabold mt-1">
                {countdown}s
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleBreathing}
              className="px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isActive ? 'Pause' : 'Begin Breathing'}</span>
            </button>
            <button
              onClick={resetBreathing}
              className="p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-slate-400">
            Cycles Completed: <strong className="text-teal-600 dark:text-teal-400">{cycles}</strong>
          </div>
        </div>
      )}

      {/* TAB 2: GROUNDING */}
      {activeTab === 'grounding' && (
        <div
          className={`p-8 sm:p-12 rounded-3xl border shadow-xl space-y-8 animate-in fade-in ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Step {groundingStep} of 5
            </span>
            <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
              5-4-3-2-1 Sensory Method
            </span>
          </div>

          <div className="space-y-4 py-4 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 font-black text-2xl flex items-center justify-center mx-auto">
              {prompts[groundingStep - 1].count}
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              {prompts[groundingStep - 1].prompt}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 italic p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              💡 {prompts[groundingStep - 1].hint}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t dark:border-slate-800">
            <button
              onClick={() => setGroundingStep(s => Math.max(1, s - 1))}
              disabled={groundingStep === 1}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 disabled:opacity-40"
            >
              Previous
            </button>
            {groundingStep < 5 ? (
              <button
                onClick={() => setGroundingStep(s => Math.min(5, s + 1))}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow"
              >
                Next Step →
              </button>
            ) : (
              <button
                onClick={() => setGroundingStep(1)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow"
              >
                Grounding Finished! Restart
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AMBIENT SOUND */}
      {activeTab === 'ambient' && (
        <div
          className={`p-8 sm:p-12 rounded-3xl border shadow-xl text-center space-y-8 animate-in fade-in ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="space-y-1">
            <h3 className="text-xl font-black">Real-Time Synthesized Soundscapes</h3>
            <p className="text-xs text-slate-500">
              Generated in your browser via the Web Audio API with zero external tracking or audio ads.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md mx-auto text-xs font-bold">
            <button
              onClick={() => { if (isPlayingAudio) toggleAudio(); setSoundType('rain'); }}
              className={`p-4 rounded-2xl border transition ${
                soundType === 'rain'
                  ? 'border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              🌧️ Gentle Rain Noise
            </button>
            <button
              onClick={() => { if (isPlayingAudio) toggleAudio(); setSoundType('waves'); }}
              className={`p-4 rounded-2xl border transition ${
                soundType === 'waves'
                  ? 'border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              🌊 Ocean Waves
            </button>
            <button
              onClick={() => { if (isPlayingAudio) toggleAudio(); setSoundType('binaural'); }}
              className={`p-4 rounded-2xl border transition ${
                soundType === 'binaural'
                  ? 'border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              🧘 136.1Hz Om Tone
            </button>
          </div>

          <button
            onClick={toggleAudio}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition inline-flex items-center gap-2 ${
              isPlayingAudio
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlayingAudio ? 'Stop Soundscape' : 'Play Soundscape'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
