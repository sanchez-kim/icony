import React, { useEffect, useState } from 'react';
import {
  AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing,
  staticFile, delayRender, continueRender,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { Lottie, type LottieAnimationData } from '@remotion/lottie';
import { loadFont } from '@remotion/google-fonts/Inter';
import {
  Heart, Star, House, Check, Bell, Zap, MessageSquare, Camera, Cloud, Music,
  Settings, Search, Calendar, Mail, Image as ImageIcon, Bookmark, Sun, Moon,
  Folder, Lock, MapPin, Phone, ShoppingCart, User, Code2, FileImage, Braces,
  Sparkles, ArrowRight,
} from 'lucide-react';

const { fontFamily } = loadFont('normal', { weights: ['500', '700', '800', '900'], subsets: ['latin'] });

const C = {
  bg: '#ffffff', ink: '#0f172a', sub: '#64748b',
  indigo: '#6366f1', violet: '#8b5cf6', pink: '#ec4899',
  sky: '#0ea5e9', emerald: '#10b981', amber: '#f59e0b', rose: '#f43f5e',
};

const OVERSHOOT = { damping: 11, stiffness: 130, mass: 0.85 };

// ── animated background (drifting soft blobs) ───────────────────────────────
const Bg: React.FC<{ tint?: string }> = ({ tint = C.indigo }) => {
  const f = useCurrentFrame();
  const b1x = 30 + Math.sin(f / 70) * 8;
  const b1y = 25 + Math.cos(f / 90) * 8;
  const b2x = 72 + Math.cos(f / 80) * 9;
  const b2y = 70 + Math.sin(f / 65) * 9;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{
        background: `radial-gradient(40% 40% at ${b1x}% ${b1y}%, ${tint}1f, transparent 70%),
                     radial-gradient(42% 42% at ${b2x}% ${b2y}%, ${C.violet}18, transparent 70%)`,
      }} />
    </AbsoluteFill>
  );
};

const Stage: React.FC<{ children: React.ReactNode; tint?: string }> = ({ children, tint }) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Bg tint={tint} />
    {children}
  </AbsoluteFill>
);

// ── kinetic caption: springy overshoot entrance + gentle float ──────────────
type Part = { t: string; c?: string };
const Caption: React.FC<{ parts: Part[]; delay?: number; sub?: string; size?: number }> = ({
  parts, delay = 0, sub, size = 82,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: OVERSHOOT });
  const float = Math.sin(frame / 32) * 4;
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const ty = interpolate(s, [0, 1], [40, 0]) + float;
  const scale = interpolate(s, [0, 1], [0.86, 1]);
  return (
    <div style={{ textAlign: 'center', transform: `translateY(${ty}px) scale(${scale})`, opacity }}>
      <div style={{ fontFamily, fontWeight: 900, fontSize: size, color: C.ink, letterSpacing: -1.5, lineHeight: 1.05 }}>
        {parts.map((p, i) => <span key={i} style={{ color: p.c ?? C.ink }}>{p.t}</span>)}
      </div>
      {sub && (
        <div style={{ fontFamily, fontWeight: 600, fontSize: 28, color: C.sub, marginTop: 16, letterSpacing: 0 }}>{sub}</div>
      )}
    </div>
  );
};

// ── Scene 1: hook ───────────────────────────────────────────────────────────
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [data, setData] = useState<LottieAnimationData | null>(null);
  const [handle] = useState(() => delayRender('lottie'));
  useEffect(() => {
    fetch(staticFile('hero-morph.json')).then((r) => r.json())
      .then((j) => { setData(j); continueRender(handle); })
      .catch(() => continueRender(handle));
  }, [handle]);
  const pop = spring({ frame, fps, config: OVERSHOOT });
  const breathe = 1 + Math.sin(frame / 26) * 0.03;
  return (
    <Stage>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div style={{ width: 380, height: 380, transform: `scale(${interpolate(pop, [0, 1], [0.5, 1]) * breathe})`, opacity: pop }}>
          {data && <Lottie animationData={data} loop />}
        </div>
        <Caption delay={10} parts={[{ t: 'Any icon. ' }, { t: 'Your style.', c: C.indigo }]} />
      </div>
    </Stage>
  );
};

// ── Scene 2: library grid ───────────────────────────────────────────────────
const GRID_ICONS = [
  Heart, Star, House, Check, Bell, Zap, MessageSquare, Camera, Cloud, Music,
  Settings, Search, Calendar, Mail, ImageIcon, Bookmark, Sun, Moon, Folder, Lock,
  MapPin, Phone, ShoppingCart, User,
];
const SceneLibrary: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Stage>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 52 }}>
        <Caption delay={2} parts={[{ t: '10,000+ ', c: C.indigo }, { t: 'icons.' }]}
          sub="Lucide · Tabler · Phosphor · Heroicons · Bootstrap · Radix" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 24 }}>
          {GRID_ICONS.map((Ico, i) => {
            const s = spring({ frame: frame - 12 - i * 1.8, fps, config: OVERSHOOT });
            // continuous wave: a scale/lift pulse travels across the grid
            const wave = Math.sin(frame / 12 - i * 0.5);
            const lift = Math.max(0, wave) * -8;
            const wscale = 1 + Math.max(0, wave) * 0.06;
            const float = Math.sin(frame / 24 + i) * 3;
            return (
              <div key={i} style={{
                width: 94, height: 94, borderRadius: 22, background: '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: `translateY(${interpolate(s, [0, 1], [40, 0]) + lift + float}px) scale(${interpolate(s, [0, 1], [0.3, 1]) * wscale})`,
                opacity: s,
              }}>
                <Ico size={46} color={C.indigo} strokeWidth={2} />
              </div>
            );
          })}
        </div>
      </div>
    </Stage>
  );
};

// ── Scene 3: color ──────────────────────────────────────────────────────────
const SWATCHES = [C.indigo, C.violet, C.pink, C.sky, C.emerald, C.amber, C.rose];
const SceneColor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const idx = Math.floor(frame / 13) % SWATCHES.length;
  const color = SWATCHES[idx];
  const pop = spring({ frame: frame - 8, fps, config: OVERSHOOT });
  // heartbeat: quick thump every ~30 frames
  const t = (frame % 30) / 30;
  const beat = t < 0.16 ? Math.sin((t / 0.16) * Math.PI) * 0.1 : 0;
  const wobble = Math.sin(frame / 22) * 4;
  return (
    <Stage tint={color}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
        <Caption delay={2} parts={[{ t: 'Recolor ', c: color }, { t: 'in a tap.' }]} />
        <div style={{ transform: `scale(${(1 + beat) * interpolate(pop, [0, 1], [0.7, 1])}) rotate(${wobble}deg)`, opacity: pop }}>
          <Heart size={210} color={color} strokeWidth={2.3} fill={`${color}22`} />
        </div>
        <div style={{ display: 'flex', gap: 18 }}>
          {SWATCHES.map((sw, i) => {
            const sel = i === idx;
            const ring = sel ? 1 + Math.sin(frame / 4) * 0.06 : 1;
            return (
              <div key={i} style={{
                width: 62, height: 62, borderRadius: 16, background: sw,
                transform: `scale(${(sel ? 1.22 : 1) * ring}) translateY(${sel ? -6 : 0}px)`,
                boxShadow: sel ? `0 10px 24px ${sw}66` : 'none',
              }} />
            );
          })}
        </div>
      </div>
    </Stage>
  );
};

// ── Scene 4: size & stroke ──────────────────────────────────────────────────
const SceneStroke: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 6, fps, config: OVERSHOOT });
  const cyc = (Math.sin(frame / 18) + 1) / 2; // 0..1 eased
  const w = interpolate(cyc, [0, 1], [1, 3.4]);
  const scale = interpolate(cyc, [0, 1], [0.82, 1.16]);
  const rot = frame * 0.6;
  return (
    <Stage tint={C.violet}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 56 }}>
        <Caption delay={2} parts={[{ t: 'Tune ', c: C.violet }, { t: 'every detail.' }]} />
        <div style={{ transform: `scale(${scale * interpolate(pop, [0, 1], [0.6, 1])})`, opacity: pop }}>
          <Settings size={200} color={C.violet} strokeWidth={w} style={{ transform: `rotate(${rot}deg)` }} />
        </div>
        <div style={{ width: 440, height: 14, borderRadius: 999, background: '#e2e8f0', position: 'relative', opacity: pop }}>
          <div style={{ position: 'absolute', top: 0, left: 0, height: 14, borderRadius: 999, width: `${interpolate(w, [1, 3.4], [10, 430])}px`, background: `linear-gradient(90deg, ${C.indigo}, ${C.violet})` }} />
          <div style={{ position: 'absolute', top: -11, width: 36, height: 36, borderRadius: 999, background: '#fff', border: `5px solid ${C.violet}`, left: `${interpolate(w, [1, 3.4], [0, 404])}px`, boxShadow: '0 6px 16px #8b5cf655' }} />
        </div>
      </div>
    </Stage>
  );
};

// ── Scene 5: export ─────────────────────────────────────────────────────────
const FORMATS = [
  { Ico: Code2, label: 'SVG', color: C.indigo },
  { Ico: FileImage, label: 'PNG', color: C.sky },
  { Ico: Braces, label: 'JSX', color: C.violet },
];
const SceneExport: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Stage>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60 }}>
        <Caption delay={2} parts={[{ t: 'Copy. Export. ' }, { t: 'Done.', c: C.indigo }]} />
        <div style={{ display: 'flex', gap: 40 }}>
          {FORMATS.map(({ Ico, label, color }, i) => {
            const s = spring({ frame: frame - 14 - i * 9, fps, config: OVERSHOOT });
            const float = Math.sin(frame / 20 + i * 1.6) * 8;
            const shine = interpolate((frame + i * 14) % 90, [0, 30, 60], [-120, 120, 260], { extrapolateRight: 'clamp' });
            return (
              <div key={label} style={{
                position: 'relative', overflow: 'hidden',
                width: 250, height: 290, borderRadius: 32, background: '#f8fafc', border: '2px solid #eef2f7',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24,
                transform: `translateY(${interpolate(s, [0, 1], [80, 0]) + float}px) scale(${interpolate(s, [0, 1], [0.8, 1])})`,
                opacity: s,
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: 80, height: '100%', transform: `translateX(${shine}px) skewX(-18deg)`, background: 'linear-gradient(90deg, transparent, #ffffffcc, transparent)' }} />
                <div style={{ width: 116, height: 116, borderRadius: 28, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ico size={62} color={color} strokeWidth={2} />
                </div>
                <div style={{ fontFamily, fontWeight: 800, fontSize: 44, color: C.ink }}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Stage>
  );
};

// ── Scene 6: CTA ────────────────────────────────────────────────────────────
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sIn = (d: number) => spring({ frame: frame - d, fps, config: OVERSHOOT });
  const logo = sIn(2), head = sIn(12), url = sIn(22), sub = sIn(30);
  const sparkle = 1 + Math.sin(frame / 7) * 0.12;
  const sparkleRot = Math.sin(frame / 18) * 12;
  const nudge = Math.max(0, Math.sin(frame / 16)) * 12;
  const float = Math.sin(frame / 30) * 4;
  return (
    <Stage>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, transform: `translateY(${float}px)` }}>
        {/* brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: logo, transform: `scale(${interpolate(logo, [0, 1], [0.7, 1])})` }}>
          <div style={{ width: 84, height: 84, borderRadius: 22, background: `linear-gradient(135deg, ${C.indigo}, ${C.violet})`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${sparkleRot}deg)`, boxShadow: '0 12px 32px #6366f155' }}>
            <Sparkles size={46} color="#fff" style={{ transform: `scale(${sparkle})` }} />
          </div>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 64, color: C.ink, letterSpacing: -1.5 }}>Icony</div>
        </div>
        {/* tagline (bookends the opening "Your style.") */}
        <div style={{ fontFamily, fontWeight: 900, fontSize: 100, letterSpacing: -2, color: C.ink, opacity: head, transform: `translateY(${interpolate(head, [0, 1], [40, 0])}px) scale(${interpolate(head, [0, 1], [0.86, 1])})` }}>
          Make it <span style={{ color: C.indigo }}>yours.</span>
        </div>
        {/* url */}
        <div style={{ fontFamily, fontWeight: 800, fontSize: 52, color: C.indigo, display: 'flex', alignItems: 'center', gap: 14, opacity: url, transform: `translateY(${interpolate(url, [0, 1], [28, 0])}px)` }}>
          iconyapp.com <ArrowRight size={46} color={C.indigo} style={{ transform: `translateX(${nudge}px)` }} />
        </div>
        {/* value line */}
        <div style={{ fontFamily, fontWeight: 600, fontSize: 28, color: C.sub, opacity: sub }}>Free · open-source · no sign-up</div>
      </div>
    </Stage>
  );
};

// ── main composition (with transitions) ─────────────────────────────────────
const T = 14; // transition length (frames)
const ease = linearTiming({ durationInFrames: T, easing: Easing.inOut(Easing.cubic) });

export const Promo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={82}><SceneHook /></TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={ease} presentation={slide({ direction: 'from-right' })} />
      <TransitionSeries.Sequence durationInFrames={108}><SceneLibrary /></TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={ease} presentation={slide({ direction: 'from-right' })} />
      <TransitionSeries.Sequence durationInFrames={104}><SceneColor /></TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={ease} presentation={fade()} />
      <TransitionSeries.Sequence durationInFrames={88}><SceneStroke /></TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={ease} presentation={slide({ direction: 'from-right' })} />
      <TransitionSeries.Sequence durationInFrames={112}><SceneExport /></TransitionSeries.Sequence>
      <TransitionSeries.Transition timing={ease} presentation={fade()} />
      <TransitionSeries.Sequence durationInFrames={92}><SceneCTA /></TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);

// sum(durations) - (#transitions * T)
export const PROMO_DURATION = (82 + 108 + 104 + 88 + 112 + 92) - 5 * T; // 586 - 70 = 516 frames ≈ 17.2s
