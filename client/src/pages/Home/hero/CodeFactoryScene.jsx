"use client";

import { useEffect, useRef } from 'react';

export default function CodeFactoryScene() {
  const smokeRef = useRef(null);
  const beltRef = useRef(null);

  useEffect(() => {
    const smokeTerms = [
      { text: '<h1>', color: '#5599ff' },
      { text: '<div>', color: '#4488ee' },
      { text: '<Link>', color: '#7766ff' },
      { text: 'const', color: '#00c896' },
      { text: '{ }', color: '#a0c4ff' },
      { text: '=>', color: '#ffaa33' },
      { text: 'CSS', color: '#ff6688' },
      { text: 'async', color: '#00c896' },
      { text: '.map()', color: '#5599ff' },
      { text: 'useState', color: '#7766ff' },
      { text: 'return', color: '#ffaa33' },
      { text: '<a>', color: '#66ddaa' },
      { text: 'function', color: '#ff9944' },
      { text: 'import', color: '#5599ff' },
      { text: 'export', color: '#77aaff' },
      { text: 'props', color: '#00c896' },
      { text: 'fetch()', color: '#ff6688' },
    ];

    const beltItems = [
      { label: '⬡ UI Kit', border: '#1365ff', color: '#7eb8ff' },
      { label: '⬡ Wireframe', border: '#7766ff', color: '#aa99ff' },
      { label: '{ } Data', border: '#00c896', color: '#66ddaa' },
      { label: '</> HTML', border: '#1365ff', color: '#5599ff' },
      { label: '🗒 Spec', border: '#ffaa33', color: '#ffcc77' },
      { label: '✦ Design', border: '#ff6688', color: '#ff99aa' },
    ];

    let smokeCount = 0, beltCount = 0;
    const timers = [];

    const spawnSmoke = () => {
      const t = smokeTerms[Math.floor(Math.random() * smokeTerms.length)];
      const el = document.createElement('span');
      const dur = 3.2 + Math.random() * 2;
      const drift = (Math.random() - 0.5) * 90;
      el.style.cssText = `
        position:absolute; font-family:monospace; font-weight:700; pointer-events:none;
        white-space:nowrap; opacity:0; font-size:${9 + Math.random() * 5}px;
        color:${t.color}; text-shadow:0 0 6px ${t.color}88;
        left:${248 + Math.random() * 50}px; top:60px;
        animation: riseSmoke ${dur}s linear forwards;
        --drift:${drift}px;
      `;
      el.textContent = t.text;
      smokeRef.current?.appendChild(el);
      timers.push(setTimeout(() => el.remove(), (dur + 2) * 1000));
      smokeCount++;
    };

    const spawnBelt = () => {
      const item = beltItems[beltCount % beltItems.length];
      const el = document.createElement('span');
      const dur = 5 + Math.random() * 2;
      el.style.cssText = `
        position:absolute; font-family:monospace; font-weight:700; font-size:10px;
        border-radius:6px; white-space:nowrap; padding:4px 8px; pointer-events:none;
        bottom:115px; left:420px; opacity:0;
        background:#0d1e50; border:1px solid ${item.border}; color:${item.color};
        box-shadow:0 0 8px ${item.border}44;
        animation: conveyorMove ${dur}s linear forwards;
      `;
      el.textContent = item.label;
      beltRef.current?.appendChild(el);
      timers.push(setTimeout(() => el.remove(), (dur + 1) * 1000));
      beltCount++;
    };

    for (let i = 0; i < 8; i++) timers.push(setTimeout(spawnSmoke, i * 380));
    for (let i = 0; i < 3; i++) timers.push(setTimeout(spawnBelt, i * 1800));

    const smokeInterval = setInterval(spawnSmoke, 520);
    const beltInterval = setInterval(spawnBelt, 1900);

    return () => {
      clearInterval(smokeInterval);
      clearInterval(beltInterval);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[700px] h-[500px] overflow-hidden">
      <style>{`
        @keyframes riseSmoke {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 0.85; }
          60%  { opacity: 0.6; }
          100% { transform: translateY(-160px) translateX(var(--drift,0px)); opacity: 0; }
        }
        @keyframes conveyorMove {
          0%   { transform: translateX(0); opacity: 0; }
          8%   { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateX(-360px); opacity: 0; }
        }
        @keyframes corePulse {
          0%,100% { filter: drop-shadow(0 0 4px rgba(19,101,255,.35)); }
          50%     { filter: drop-shadow(0 0 12px rgba(19,101,255,.7)); }
        }
        @keyframes spinA { to { transform: rotate(360deg); } }
        @keyframes spinB { to { transform: rotate(-360deg); } }
        @keyframes antBlink { 0%,100%{opacity:1} 50%{opacity:.15} }
        @keyframes beltScroll { from{stroke-dashoffset:0} to{stroke-dashoffset:-40} }
        @keyframes screenFlicker {
          0%{opacity:1} 30%{opacity:.4} 35%{opacity:1} 70%{opacity:.6} 75%{opacity:1}
        }
        @keyframes floatDot {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)}
        }
        .cf-machine-core { animation: corePulse 2.2s ease-in-out infinite; }
        .cf-gear-a { animation: spinA 4s linear infinite; transform-origin: 273px 270px; }
        .cf-gear-b { animation: spinB 3.2s linear infinite; transform-origin: 320px 295px; }
        .cf-blink  { animation: antBlink 1.2s ease-in-out infinite; }
        .cf-belt   { animation: beltScroll 1.2s linear infinite; }
        .cf-screen { animation: screenFlicker 3s steps(1) infinite; }
        .cf-dot    { animation: floatDot 3s ease-in-out infinite; }
      `}</style>

      {/* ── SVG Machine ── */}
      <svg width="100%" height="100%" viewBox="0 0 520 500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cfBodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0d1b3e" /><stop offset="100%" stopColor="#0a1428" />
          </linearGradient>
          <linearGradient id="cfScreenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1365ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0a40c2" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="cfChimGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0d2060" /><stop offset="100%" stopColor="#0a1840" />
          </linearGradient>
          <linearGradient id="cfBeltGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0e2060" /><stop offset="100%" stopColor="#071030" />
          </linearGradient>
          <linearGradient id="cfPanelGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a2d70" /><stop offset="100%" stopColor="#0d1d55" />
          </linearGradient>
          <radialGradient id="cfShadow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1365ff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#1365ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="280" cy="430" rx="180" ry="18" fill="url(#cfShadow)" />

        {/* conveyor */}
        <rect x="60" y="352" width="320" height="38" rx="8" fill="url(#cfBeltGrad)" stroke="#1a3a8f" strokeWidth="1" />
        <rect x="66" y="356" width="308" height="30" rx="5" fill="#0b1840" />
        <line className="cf-belt" x1="66" y1="356" x2="374" y2="356" stroke="#1365ff" strokeWidth="0.8" strokeDasharray="20 20" strokeOpacity="0.6" />
        <line className="cf-belt" x1="66" y1="371" x2="374" y2="371" stroke="#1365ff" strokeWidth="0.5" strokeDasharray="20 20" strokeOpacity="0.3" />
        <line className="cf-belt" x1="66" y1="385" x2="374" y2="385" stroke="#1365ff" strokeWidth="0.8" strokeDasharray="20 20" strokeOpacity="0.6" />
        <circle cx="68" cy="371" r="14" fill="#0d2060" stroke="#1a3a8f" strokeWidth="1.5" />
        <circle cx="68" cy="371" r="7" fill="#162a6a" stroke="#2550c0" strokeWidth="1" />
        <circle cx="68" cy="371" r="3" fill="#1365ff" />
        <circle cx="372" cy="371" r="14" fill="#0d2060" stroke="#1a3a8f" strokeWidth="1.5" />
        <circle cx="372" cy="371" r="7" fill="#162a6a" stroke="#2550c0" strokeWidth="1" />
        <circle cx="372" cy="371" r="3" fill="#1365ff" />

        {/* machine body */}
        <rect x="168" y="185" width="210" height="170" rx="14" fill="url(#cfBodyGrad)" stroke="#1a3a8f" strokeWidth="1.5" className="cf-machine-core" />
        <rect x="180" y="197" width="186" height="70" rx="8" fill="url(#cfPanelGrad)" stroke="#2040a0" strokeWidth="1" />
        <rect x="192" y="207" width="110" height="50" rx="5" fill="url(#cfScreenGrad)" stroke="#3366ff" strokeWidth="1" />
        <line x1="192" y1="225" x2="302" y2="225" stroke="#5588ff" strokeWidth="0.5" strokeOpacity="0.4" />
        <line x1="192" y1="235" x2="302" y2="235" stroke="#5588ff" strokeWidth="0.5" strokeOpacity="0.4" />
        <line x1="192" y1="245" x2="302" y2="245" stroke="#5588ff" strokeWidth="0.5" strokeOpacity="0.4" />
        <text x="248" y="225" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill="#a0c4ff" className="cf-screen">const build = () =&gt;</text>
        <text x="248" y="236" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill="#7eb8ff" className="cf-screen">  compile(code);</text>
        <text x="248" y="247" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill="#b0d4ff" className="cf-screen">  deploy();</text>
        <circle cx="324" cy="218" r="7" fill="#0d2870" stroke="#1365ff" strokeWidth="1.5" />
        <circle cx="324" cy="218" r="3.5" fill="#1365ff" className="cf-blink" />
        <circle cx="338" cy="218" r="7" fill="#0d2870" stroke="#3a1fff" strokeWidth="1" />
        <circle cx="338" cy="218" r="3.5" fill="#6040ff" />
        <circle cx="352" cy="218" r="7" fill="#0d2870" stroke="#00c896" strokeWidth="1" />
        <circle cx="352" cy="218" r="3.5" fill="#00c896" opacity="0.8" />
        <rect x="192" y="263" width="162" height="6" rx="3" fill="#0d2060" stroke="#152880" strokeWidth="0.5" />
        <rect x="193" y="263.5" width="110" height="5" rx="2.5" fill="#1365ff" opacity="0.9" />
        <text x="360" y="268" textAnchor="end" fontFamily="monospace" fontSize="6" fill="#4477dd">68%</text>
        <rect x="180" y="280" width="186" height="65" rx="8" fill="#0a1640" stroke="#162880" strokeWidth="1" />
        <g className="cf-gear-a">
          <circle cx="273" cy="270" r="22" fill="none" stroke="#1a3a8f" strokeWidth="2.5" strokeDasharray="7 4" />
          <circle cx="273" cy="270" r="12" fill="#0d2060" stroke="#1365ff" strokeWidth="1.5" />
          <circle cx="273" cy="270" r="5" fill="#1365ff" />
        </g>
        <g className="cf-gear-b">
          <circle cx="320" cy="295" r="16" fill="none" stroke="#1a3a8f" strokeWidth="2" strokeDasharray="5 3" />
          <circle cx="320" cy="295" r="8" fill="#0d2060" stroke="#3040c0" strokeWidth="1" />
          <circle cx="320" cy="295" r="3" fill="#4050e0" />
        </g>
        {[285, 293, 301, 309, 317].map(y => (
          <rect key={y} x="192" y={y} width="60" height="4" rx="2" fill="#0a1640" stroke="#1a3888" strokeWidth="0.7" />
        ))}
        <rect x="156" y="220" width="16" height="90" rx="6" fill="#0d1e50" stroke="#152878" strokeWidth="1" />
        <circle cx="164" cy="218" r="9" fill="#0e2258" stroke="#1a3888" strokeWidth="1" />
        <circle cx="164" cy="218" r="5" fill="#1365ff" opacity="0.5" />
        <rect x="374" y="240" width="14" height="60" rx="5" fill="#0d1e50" stroke="#152878" strokeWidth="1" />
        <rect x="186" y="352" width="30" height="12" rx="4" fill="#0b1840" stroke="#1a3080" strokeWidth="1" />
        <rect x="332" y="352" width="30" height="12" rx="4" fill="#0b1840" stroke="#1a3080" strokeWidth="1" />

        {/* chimney */}
        <rect x="248" y="80" width="50" height="108" rx="6" fill="url(#cfChimGrad)" stroke="#1a3a8f" strokeWidth="1.5" />
        {[105, 130, 155].map(y => <rect key={y} x="248" y={y} width="50" height="8" fill="#0f2060" opacity="0.6" />)}
        <rect x="240" y="70" width="66" height="18" rx="5" fill="#0e2268" stroke="#2a50c8" strokeWidth="1.5" />
        <ellipse cx="273" cy="72" rx="30" ry="6" fill="#1365ff" opacity="0.25" />

        {/* antenna */}
        <line x1="360" y1="185" x2="360" y2="145" stroke="#1a3888" strokeWidth="2" />
        <circle cx="360" cy="142" r="5" fill="#1365ff" className="cf-blink" />
        <line x1="348" y1="162" x2="372" y2="162" stroke="#1a3888" strokeWidth="1" />
        <line x1="352" y1="153" x2="368" y2="153" stroke="#1a3888" strokeWidth="0.8" />

        {/* I/O slots */}
        <rect x="168" y="338" width="70" height="22" rx="5" fill="#060f2a" stroke="#1365ff" strokeWidth="1.5" />
        <text x="203" y="353" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#1365ff" opacity="0.8">INPUT</text>
        <rect x="308" y="338" width="70" height="22" rx="5" fill="#060f2a" stroke="#00c896" strokeWidth="1.5" />
        <text x="343" y="353" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#00c896" opacity="0.9">OUTPUT</text>

        {/* ambient dots */}
        {[
          { cx: 440, cy: 200, r: 4, c: '#1365ff', delay: '0s' },
          { cx: 460, cy: 240, r: 3, c: '#4488ff', delay: '0.7s' },
          { cx: 450, cy: 280, r: 2.5, c: '#00c896', delay: '1.4s' },
          { cx: 130, cy: 250, r: 3, c: '#1365ff', delay: '0.4s' },
          { cx: 115, cy: 290, r: 2, c: '#6655ff', delay: '1s' },
        ].map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={d.c} opacity="0.5"
            className="cf-dot" style={{ animationDelay: d.delay }} />
        ))}
      </svg>

      {/* particle layers */}
      <div ref={smokeRef} className="absolute inset-0 pointer-events-none" />
      <div ref={beltRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}