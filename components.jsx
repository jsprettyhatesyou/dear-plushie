// components.jsx — shared primitives + seed data for dear plushie!

// ─────────────── Plushie catalogue ────────────────
// Each plushie has emoji glyph, name, accent color, base body color
const PLUSHIES = [
  // ── animal plushies
  { id: 'bear',   glyph: '🧸', name: 'Mochi Bear',    body: '#C69C84', accent: '#F8DDE3', rarity: 'common'   },
  { id: 'bunny',  glyph: '🐰', name: 'Powder Bunny',  body: '#FFD6C2', accent: '#FFF',    rarity: 'common'   },
  { id: 'cat',    glyph: '🐱', name: 'Kitten Bonbon', body: '#E8D9CF', accent: '#F8DDE3', rarity: 'common'   },
  { id: 'dog',    glyph: '🐶', name: 'Toffee Pup',    body: '#D9B797', accent: '#FFEAD6', rarity: 'common'   },
  { id: 'fox',    glyph: '🦊', name: 'Peach Fox',     body: '#FFD6C2', accent: '#FFF',    rarity: 'rare'     },
  { id: 'panda',  glyph: '🐼', name: 'Tofu Panda',    body: '#FFF',    accent: '#4A3B36', rarity: 'rare'     },
  { id: 'frog',   glyph: '🐸', name: 'Matcha Frog',   body: '#C7DDB7', accent: '#FFF',    rarity: 'rare'     },
  { id: 'sheep',  glyph: '🐑', name: 'Cloud Sheep',   body: '#FFF',    accent: '#F8DDE3', rarity: 'common'   },
  { id: 'penguin',glyph: '🐧', name: 'Tuxie',         body: '#4A3B36', accent: '#FFD6C2', rarity: 'rare'     },
  { id: 'ghost',  glyph: '👻', name: 'Spirit Note',   body: '#F4ECFA', accent: '#C8B6E2', rarity: 'legend'   },
  { id: 'duck',   glyph: '🐤', name: 'Buttercup',     body: '#FFE9A8', accent: '#FFF',    rarity: 'common'   },
  { id: 'star',   glyph: '⭐', name: 'Wish Star',     body: '#FFE9A8', accent: '#FFF',    rarity: 'legend'   },
  // ── girly charms (gachapon series)
  { id: 'piglet', glyph: '🐽', name: 'Pinky Piglet',  body: '#FFCCDC', accent: '#FFD6C2', rarity: 'common'   },
  { id: 'heart',  glyph: '💗', name: 'Glow Heart',    body: '#FFB6C8', accent: '#FFE6EE', rarity: 'rare'     },
  { id: 'ribbon', glyph: '🎀', name: 'Ribbon Charm',  body: '#FFCCDC', accent: '#FFF',    rarity: 'common'   },
  { id: 'tote',   glyph: '🛍️', name: 'Mini Tote',    body: '#F2A5BA', accent: '#FFD6C2', rarity: 'common'   },
  { id: 'letter', glyph: '💌', name: 'Letter Charm',  body: '#FFE6EE', accent: '#FFD6C2', rarity: 'rare'     },
  { id: 'bacon',  glyph: '🥓', name: 'Crispy',        body: '#F2A5BA', accent: '#FFE6EE', rarity: 'legend'   },
  { id: 'posy',   glyph: '💐', name: 'Posy',          body: '#F8DDE3', accent: '#C8B6E2', rarity: 'rare'     },
  { id: 'nail',   glyph: '💅🏻', name: 'Glossy Tip',  body: '#FF9DB4', accent: '#FFE6EE', rarity: 'rare'     },
  { id: 'bingsu', glyph: '🍧', name: 'Berry Bingsu',  body: '#FFE6EE', accent: '#C8B6E2', rarity: 'common'   },
  { id: 'cheer',  glyph: '🙆🏻‍♀️', name: 'Cheer Charm', body: '#FFD6C2', accent: '#FFE6EE', rarity: 'common' },
  { id: 'ballet', glyph: '🩰', name: 'Ballet Slipper',body: '#FFCCDC', accent: '#FFE6EE', rarity: 'rare'     },
  { id: 'suit',   glyph: '👙', name: 'Sunny Suit',    body: '#FFC9D9', accent: '#F2A5BA', rarity: 'common'   },
];

const PLUSHIE_BY_ID = Object.fromEntries(PLUSHIES.map(p => [p.id, p]));

const RARITY_LABEL = {
  common: 'soft',
  rare:   'rare find',
  legend: 'one-in-a-cloud',
};

// ─────────────── Plushie capsule ────────────────
// The cute pill-on-base shape used everywhere a plushie appears.
function PlushieCapsule({ plushie, size = 72, label = false, glow = false, idle = true, hue }) {
  if (!plushie) return null;
  const accent = hue || plushie.accent;
  const r = Math.round(size * 0.34);
  return (
    <div style={{
      width: size, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    }}>
      <div className={idle ? 'float-soft' : ''} style={{
        '--r': '0deg',
        width: size, height: size, borderRadius: size / 2,
        background: `radial-gradient(circle at 35% 30%, #fff 0%, ${accent} 50%, ${plushie.body === '#FFF' ? '#F4E7E0' : plushie.body} 130%)`,
        boxShadow: glow
          ? `0 0 0 4px rgba(255,255,255,0.7), 0 0 24px ${accent}, 0 8px 20px rgba(198,156,132,0.25)`
          : 'inset -4px -6px 10px rgba(74, 59, 54, 0.10), 0 6px 14px rgba(198, 156, 132, 0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.55,
        position: 'relative',
      }}>
        <span style={{ filter: 'drop-shadow(0 1px 2px rgba(74,59,54,0.2))' }}>{plushie.glyph}</span>
        {/* shine */}
        <div style={{
          position: 'absolute', top: size * 0.12, left: size * 0.18,
          width: size * 0.22, height: size * 0.16, borderRadius: '50%',
          background: 'rgba(255,255,255,0.55)', filter: 'blur(2px)',
        }} />
      </div>
      {label && (
        <div style={{
          fontFamily: 'Fredoka', fontWeight: 500, fontSize: 11,
          color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.2,
        }}>{plushie.name}</div>
      )}
    </div>
  );
}

// ─────────────── Soft pill button ────────────────
function PlushButton({ children, onClick, variant = 'primary', size = 'md', full = false, disabled }) {
  const base = {
    primary: { bg: 'var(--plush)', fg: '#fff', border: 'var(--plush-deep)' },
    pink:    { bg: '#F2A5BA',     fg: '#fff', border: '#D98AA1' },
    cream:   { bg: '#fff',        fg: 'var(--ink)', border: 'rgba(74,59,54,0.10)' },
    lav:     { bg: 'var(--lavender)', fg: '#fff', border: '#A992C7' },
    ghost:   { bg: 'transparent', fg: 'var(--ink-soft)', border: 'rgba(74,59,54,0.18)' },
  }[variant];
  const sizes = { sm: { h: 36, fs: 13, pad: 16 }, md: { h: 48, fs: 15, pad: 22 }, lg: { h: 56, fs: 17, pad: 28 } }[size];
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        height: sizes.h,
        padding: `0 ${sizes.pad}px`,
        background: base.bg,
        color: base.fg,
        border: `1px solid ${base.border}`,
        borderRadius: sizes.h / 2,
        fontFamily: 'Fredoka',
        fontWeight: 600,
        fontSize: sizes.fs,
        letterSpacing: '0.01em',
        boxShadow: variant === 'ghost' ? 'none'
          : `0 1px 0 rgba(255,255,255,0.6) inset, 0 -2px 0 ${base.border} inset, 0 4px 10px rgba(198, 156, 132, 0.22)`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        width: full ? '100%' : undefined,
        transition: 'transform 0.15s ease-out, box-shadow 0.15s',
        WebkitTapHighlightColor: 'transparent',
      }}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'translateY(1px) scale(0.99)')}
      onMouseUp={e => (e.currentTarget.style.transform = '')}
      onMouseLeave={e => (e.currentTarget.style.transform = '')}
    >{children}</button>
  );
}

// ─────────────── Card surface ────────────────
function PlushCard({ children, style = {}, accent = '#fff', tilt = 0 }) {
  return (
    <div style={{
      background: accent,
      borderRadius: 24,
      padding: 16,
      boxShadow: 'var(--shadow-card)',
      transform: tilt ? `rotate(${tilt}deg)` : 'none',
      border: '1px solid rgba(255,255,255,0.6)',
      ...style,
    }}>{children}</div>
  );
}

// ─────────────── Stickers ────────────────
function Sticker({ emoji, size = 22, rotate = 0, style = {} }) {
  return (
    <span style={{
      display: 'inline-block', transform: `rotate(${rotate}deg)`,
      fontSize: size, lineHeight: 1,
      filter: 'drop-shadow(0 2px 3px rgba(74,59,54,0.18))',
      ...style,
    }}>{emoji}</span>
  );
}

// ─────────────── Tape strip (like washi tape) ────────────────
function Tape({ width = 60, color = 'rgba(255, 214, 194, 0.75)', rotate = -6, style = {} }) {
  return (
    <div style={{
      width, height: 18, background: color, transform: `rotate(${rotate}deg)`,
      backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.25) 0 4px, transparent 4px 8px)`,
      boxShadow: '0 2px 4px rgba(74,59,54,0.1)',
      ...style,
    }} />
  );
}

// ─────────────── Title (Fredoka heading) ────────────────
function Title({ children, size = 24, color = 'var(--ink)', weight = 600, style = {} }) {
  return (
    <h1 style={{
      fontFamily: 'Fredoka', fontWeight: weight, fontSize: size,
      color, margin: 0, lineHeight: 1.15, letterSpacing: '-0.005em',
      ...style,
    }}>{children}</h1>
  );
}

// ─────────────── Bottom tab bar ────────────────
function TabBar({ active, onChange, onSend, mobile = false }) {
  const tabs = [
    { id: 'shelf',  label: 'Shelf',  icon: '🪴' },
    { id: 'arcade', label: 'Arcade', icon: '🎀' },
    { id: 'send',   label: 'Send',   icon: '💌', big: true },
    { id: 'inbox',  label: 'Inbox',  icon: '✉️' },
    { id: 'me',     label: 'You',    icon: '🌸' },
  ];
  return (
    <div style={{
      position: mobile ? 'fixed' : 'absolute',
      bottom: mobile ? 'calc(8px + env(safe-area-inset-bottom, 0px))' : 8,
      left: mobile ? 'max(12px, calc((100% - 430px) / 2 + 12px))' : 12,
      right: mobile ? 'max(12px, calc((100% - 430px) / 2 + 12px))' : 12,
      height: 70, borderRadius: 28,
      background: 'rgba(255, 249, 245, 0.85)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.7)',
      boxShadow: '0 8px 24px rgba(198, 156, 132, 0.22), 0 -1px 0 rgba(255,255,255,0.6) inset',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      zIndex: 30, paddingBottom: 6,
    }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        if (t.big) {
          return (
            <button key={t.id} onClick={onSend} style={{
              position: 'relative', top: -22,
              width: 60, height: 60, borderRadius: 30,
              border: '3px solid #fff',
              background: 'linear-gradient(160deg, #F2A5BA 0%, #D98AA1 100%)',
              boxShadow: '0 6px 16px rgba(217, 138, 161, 0.5), 0 1px 0 rgba(255,255,255,0.5) inset',
              color: '#fff', fontSize: 26, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{t.icon}</button>
          );
        }
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            background: 'transparent', border: 0, padding: '4px 10px',
            color: isActive ? 'var(--plush-deep)' : 'var(--ink-faint)',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            transform: isActive ? 'translateY(-2px)' : 'none',
          }}>
            <span style={{ fontSize: 20, opacity: isActive ? 1 : 0.6, filter: isActive ? 'none' : 'saturate(0.5)' }}>{t.icon}</span>
            <span style={{ fontFamily: 'Fredoka', fontWeight: 500, fontSize: 10, letterSpacing: '0.02em' }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────── Top bar (in-screen header) ────────────────
function TopBar({ title, subtitle, left, right, accent = 'transparent' }) {
  return (
    <div style={{
      padding: '8px 20px 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: accent,
    }}>
      <div style={{ width: 36 }}>{left}</div>
      <div style={{ textAlign: 'center', flex: 1 }}>
        <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 17, color: 'var(--ink)' }}>{title}</div>
        {subtitle && <div style={{ fontFamily: 'Caveat', fontSize: 14, color: 'var(--ink-soft)', marginTop: -2 }}>{subtitle}</div>}
      </div>
      <div style={{ width: 36, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}

// ─────────────── Circular icon button ────────────────
function RoundBtn({ children, onClick, size = 36, bg = 'rgba(255,255,255,0.7)' }) {
  return (
    <button onClick={onClick} style={{
      width: size, height: size, borderRadius: size/2,
      background: bg, border: '1px solid rgba(74,59,54,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.46, cursor: 'pointer', color: 'var(--ink)',
      boxShadow: '0 2px 6px rgba(198, 156, 132, 0.15)',
    }}>{children}</button>
  );
}

// expose globally
Object.assign(window, {
  PLUSHIES, PLUSHIE_BY_ID, RARITY_LABEL,
  PlushieCapsule, PlushButton, PlushCard, Sticker, Tape, Title, TabBar, TopBar, RoundBtn,
});
