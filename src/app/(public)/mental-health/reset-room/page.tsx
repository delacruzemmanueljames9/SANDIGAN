'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  Heart,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

export default function ResetRoomPage() {
  const [activeTab, setActiveTab] = useState<'breathing' | 'grounding' | 'ambient'>('breathing');

  // Breathing state
  const [breathTechnique, setBreathTechnique] = useState<'box' | '478'>('box');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [countdown, setCountdown] = useState(4);
  const [breathCyclesCompleted, setBreathCyclesCompleted] = useState(0);

  // Grounding 5-4-3-2-1 state
  const [groundingStep, setGroundingStep] = useState(1);
  const groundingPrompts = [
    { step: 1, count: 5, prompt: 'Notice 5 things you can SEE around you right now.', hint: 'A pen, a shadow, a book, the wall color, your shoes.' },
    { step: 2, count: 4, prompt: 'Notice 4 things you can physically TOUCH or FEEL.', hint: 'The texture of your shirt, the cool table surface, your hair, the floor under your feet.' },
    { step: 3, count: 3, prompt: 'Notice 3 distinct sounds you can HEAR.', hint: 'An electric fan hum, birds outside, distant traffic, your own breath.' },
    { step: 4, count: 2, prompt: 'Notice 2 things you can SMELL (or pleasant scents you remember).', hint: 'Coffee, fresh paper, laundry detergent, rain.' },
    { step: 5, count: 1, prompt: 'Notice 1 positive thing you TASTE or one thing you are GRATEFUL for.', hint: 'A sip of cool water, a warm memory, or being right here in this safe moment.' },
  ];

  // Ambient sound synth using HTML5 Web Audio API
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'rain' | 'waves' | 'binaural'>('rain');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Breathing timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Transition phase
            if (breathTechnique === 'box') {
              if (breathPhase === 'Inhale') { setBreathPhase('Hold'); return 4; }
              if (breathPhase === 'Hold') { setBreathPhase('Exhale'); return 4; }
              if (breathPhase === 'Exhale') { setBreathPhase('Rest'); return 4; }
              if (breathPhase === 'Rest') {
                setBreathCyclesCompleted(c => c + 1);
                setBreathPhase('Inhale');
                return 4;
              }
            } else {
              // 4-7-8 relaxing
              if (breathPhase === 'Inhale') { setBreathPhase('Hold'); return 7; }
              if (breathPhase === 'Hold') { setBreathPhase('Exhale'); return 8; }
              if (breathPhase === 'Exhale') {
                setBreathCyclesCompleted(c => c + 1);
                setBreathPhase('Inhale');
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
  }, [isBreathingActive, breathPhase, breathTechnique]);

  const toggleBreathing = () => {
    if (!isBreathingActive) {
      setBreathPhase('Inhale');
      setCountdown(4);
    }
    setIsBreathingActive(!isBreathingActive);
  };

  const resetBreathing = () => {
    setIsBreathingActive(false);
    setBreathPhase('Inhale');
    setCountdown(4);
    setBreathCyclesCompleted(0);
  };

  // Sound generator toggle
  const toggleAmbientAudio = () => {
    if (isPlayingAudio) {
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
      setIsPlayingAudio(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        if (ambientSound === 'binaural') {
          // Soothing gentle binaural frequencies (136.1 Hz om frequency + 140 Hz)
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          gain.gain.value = 0.05;

          osc1.frequency.value = 136.1;
          osc2.frequency.value = 142.1;

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start();
          osc2.start();
          noiseNodeRef.current = gain;
        } else {
          // Soothing Pink/Brown Noise Filter (Rain/Ocean)
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
          filter.frequency.value = ambientSound === 'waves' ? 400 : 700;

          whiteNoise.connect(filter);
          filter.connect(ctx.destination);
          whiteNoise.start();
          noiseNodeRef.current = filter;
        }

        setIsPlayingAudio(true);
      } catch (e) {
        console.warn('Web Audio not supported or blocked:', e);
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
        <span className="text-xs font-bold uppercase tracking-wider text-tk-emerald bg-tk-softgreen/60 px-3 py-1 rounded-full">
          The Reset Room
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Pause. Regulate. Breathe.
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Scientifically backed sensory regulation tools to down-regulate your autonomic nervous system, decrease cortisol, and restore emotional balance.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-200/70 p-1.5 rounded-2xl flex items-center gap-1">
          <button
            onClick={() => setActiveTab('breathing')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'breathing'
                ? 'bg-white text-tk-deepblue shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Guided Breathing
          </button>
          <button
            onClick={() => setActiveTab('grounding')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'grounding'
                ? 'bg-white text-tk-deepblue shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            5-4-3-2-1 Grounding
          </button>
          <button
            onClick={() => setActiveTab('ambient')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'ambient'
                ? 'bg-white text-tk-deepblue shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ambient Soundscape
          </button>
        </div>
      </div>

      {/* TAB 1: GUIDED BREATHING */}
      {activeTab === 'breathing' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-lg text-center space-y-8 animate-in fade-in">
          {/* Technique toggle */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                setBreathTechnique('box');
                resetBreathing();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border ${
                breathTechnique === 'box'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              Box Breathing (4-4-4-4)
            </button>
            <button
              onClick={() => {
                setBreathTechnique('478');
                resetBreathing();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border ${
                breathTechnique === '478'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              4-7-8 Deep Relaxation
            </button>
          </div>

          {/* Visual Breathing Sphere */}
          <div className="relative flex items-center justify-center h-64">
            <div
              className={`w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-xl ${
                breathPhase === 'Inhale'
                  ? 'scale-125 bg-gradient-to-tr from-emerald-400 to-teal-500 shadow-emerald-300/50'
                  : breathPhase === 'Hold'
                  ? 'scale-125 bg-gradient-to-tr from-teal-500 to-sky-500 shadow-teal-300/50'
                  : breathPhase === 'Exhale'
                  ? 'scale-90 bg-gradient-to-tr from-emerald-600 to-tk-deepblue shadow-emerald-800/40'
                  : 'scale-90 bg-slate-300'
              }`}
            >
              <span className="text-white font-black text-2xl tracking-wide uppercase drop-shadow">
                {isBreathingActive ? breathPhase : 'Ready'}
              </span>
              <span className="text-white/90 font-mono text-3xl font-extrabold mt-1">
                {countdown}s
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleBreathing}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition"
            >
              {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isBreathingActive ? 'Pause Session' : 'Begin Breathing'}</span>
            </button>

            <button
              onClick={resetBreathing}
              className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-slate-400">
            Cycles Completed:{' '}
            <strong className="text-emerald-700 font-bold">{breathCyclesCompleted}</strong>
          </div>
        </div>
      )}

      {/* TAB 2: 5-4-3-2-1 SENSORY GROUNDING */}
      {activeTab === 'grounding' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-lg space-y-8 animate-in fade-in">
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Step {groundingStep} of 5
            </span>
            <span className="text-xs font-mono font-bold text-tk-deepblue">
              5-4-3-2-1 Method
            </span>
          </div>

          {/* Current Step Card */}
          <div className="space-y-4 py-4 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-tk-softgreen text-emerald-800 font-black text-2xl flex items-center justify-center mx-auto shadow-md">
              {groundingPrompts[groundingStep - 1].count}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {groundingPrompts[groundingStep - 1].prompt}
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
              💡 Examples: {groundingPrompts[groundingStep - 1].hint}
            </p>
          </div>

          {/* Navigation between steps */}
          <div className="flex items-center justify-between pt-4 border-t">
            <button
              onClick={() => setGroundingStep(s => Math.max(1, s - 1))}
              disabled={groundingStep === 1}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 disabled:opacity-40"
            >
              Previous Step
            </button>

            {groundingStep < 5 ? (
              <button
                onClick={() => setGroundingStep(s => Math.min(5, s + 1))}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold text-xs shadow transition"
              >
                <span>I Noticed These • Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setGroundingStep(1)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Grounding Completed! Restart</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AMBIENT SOUNDSCAPE */}
      {activeTab === 'ambient' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-lg text-center space-y-8 animate-in fade-in">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900">Live Synthesized Soundscapes</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Generated in real-time in your browser without external audio streams or ads.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto">
            <button
              onClick={() => {
                if (isPlayingAudio) toggleAmbientAudio();
                setAmbientSound('rain');
              }}
              className={`p-4 rounded-2xl border text-xs font-bold transition ${
                ambientSound === 'rain'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              🌧️ Gentle Rain Noise
            </button>
            <button
              onClick={() => {
                if (isPlayingAudio) toggleAmbientAudio();
                setAmbientSound('waves');
              }}
              className={`p-4 rounded-2xl border text-xs font-bold transition ${
                ambientSound === 'waves'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              🌊 Ocean Waves
            </button>
            <button
              onClick={() => {
                if (isPlayingAudio) toggleAmbientAudio();
                setAmbientSound('binaural');
              }}
              className={`p-4 rounded-2xl border text-xs font-bold transition ${
                ambientSound === 'binaural'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              🧘 136.1Hz Binaural Tone
            </button>
          </div>

          <div>
            <button
              onClick={toggleAmbientAudio}
              className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition ${
                isPlayingAudio
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Stop Soundscape' : 'Play Soundscape'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
