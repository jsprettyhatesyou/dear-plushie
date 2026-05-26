// screens.jsx — all screens for dear plushie!

const CIRCLE_THEMES = {
  rose:     { bg: 'linear-gradient(160deg,#FFE6EE 0%,#FFF0F3 100%)', accent:'#F2A5BA', text:'#D98AA1', dot:'#FFB3C8', emoji:'🌸', label:'rose garden' },
  lavender: { bg: 'linear-gradient(160deg,#EDE8FF 0%,#F8F5FF 100%)', accent:'#C8B8E8', text:'#9B7FD4', dot:'#D4C7F0', emoji:'💜', label:'lavender dream' },
  mint:     { bg: 'linear-gradient(160deg,#E4F8EE 0%,#F2FFF7 100%)', accent:'#B8E8C8', text:'#7FAF8F', dot:'#A8D8B8', emoji:'🌿', label:'mint meadow' },
  peach:    { bg: 'linear-gradient(160deg,#FFF0E4 0%,#FFF8F2 100%)', accent:'#FFD0A0', text:'#C4804E', dot:'#FFBF88', emoji:'🍑', label:'peach cloud' },
  night:    { bg: 'linear-gradient(160deg,#1E1538 0%,#2E2060 100%)', accent:'#9B7FE8', text:'#C8B4F8', dot:'#7B5FC8', emoji:'🌙', label:'night sky' },
};

// ───────────────────────────────────────────────────────────
// SHELF — your collected plushies displayed on cozy shelves
// ───────────────────────────────────────────────────────────
function ShelfScreen({ inbox, onOpen }) {
  // group inbox onto shelves of 4
  const rows = [];
  for (let i = 0; i < inbox.length; i += 4) rows.push(inbox.slice(i, i + 4));
  while (rows.length < 3) rows.push([]);

  return (
    <div style={{ padding: '0 0 120px', minHeight: '100%' }}>
      <TopBar
        title="my little shelf"
        subtitle="tiny things, kept softly"
        left={<RoundBtn>🌙</RoundBtn>}
        right={<RoundBtn>⚙︎</RoundBtn>}
      />
      {/* hero card */}
      <div style={{ padding: '4px 20px 18px' }}>
        <div style={{
          background: 'linear-gradient(160deg, #FFE6EE 0%, #F8E5DA 100%)',
          borderRadius: 26, padding: '16px 18px',
          display: 'flex', gap: 14, alignItems: 'center',
          boxShadow: 'var(--shadow-card)',
          position: 'relative', overflow: 'hidden',
        }}>
          <Sticker emoji="✨" size={18} rotate={-12} style={{ position:'absolute', top: 10, right: 14 }} />
          <Sticker emoji="🎀" size={16} rotate={20} style={{ position:'absolute', bottom: 10, right: 30 }} />
          <div style={{
            width: 56, height: 56, borderRadius: 28,
            background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(198, 156, 132, 0.20)', fontSize: 28,
          }}>{inbox.length === 0 ? '🌸' : '💌'}</div>
          <div style={{ flex: 1 }}>
            {inbox.length === 0 ? (
              <>
                <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>
                  your shelf is empty
                </div>
                <div style={{ fontFamily: 'Caveat', fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.1 }}>
                  send a plushie to start · ↓ tap 💌
                </div>
              </>
            ) : (
              <>
                <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>
                  {inbox.filter(i => !i.opened).length} unopened
                </div>
                <div style={{ fontFamily: 'Caveat', fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.1 }}>
                  someone left tiny feelings for you ↓
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* shelves */}
      <div style={{ padding: '4px 16px 0', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {rows.map((row, i) => (
          <div key={i}>
            <div style={{
              display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
              minHeight: 80, padding: '0 6px 6px',
            }}>
              {row.length === 0 && Array.from({ length: 4 }).map((_, j) => (
                <div key={j} style={{
                  width: 64, height: 64, borderRadius: 32,
                  border: '2px dashed rgba(198, 156, 132, 0.3)',
                  background: 'rgba(255,255,255,0.3)',
                }} />
              ))}
              {row.map((item, j) => {
                const p = PLUSHIE_BY_ID[item.plushie];
                return (
                  <div key={item.id} style={{ position: 'relative', cursor: 'pointer' }} onClick={() => onOpen(item.id)}>
                    {!item.opened && (
                      <div style={{
                        position: 'absolute', top: -6, right: -4, zIndex: 2,
                        width: 18, height: 18, borderRadius: 9,
                        background: '#F2A5BA', color: '#fff', fontSize: 10,
                        fontFamily: 'Fredoka', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(217, 138, 161, 0.5)',
                        animation: 'heart-beat 1.8s ease-in-out infinite',
                      }}>♥</div>
                    )}
                    <PlushieCapsule plushie={p} size={64} idle />
                  </div>
                );
              })}
            </div>
            {/* shelf board */}
            <div style={{
              height: 12, borderRadius: 4,
              background: 'linear-gradient(180deg, #D9B797 0%, #B89077 100%)',
              boxShadow: '0 4px 10px rgba(198, 156, 132, 0.3), 0 1px 0 rgba(255,255,255,0.5) inset',
              margin: '0 8px',
            }} />
            <div style={{
              height: 4, margin: '0 28px', borderRadius: '0 0 8px 8px',
              background: 'rgba(74, 59, 54, 0.08)',
            }} />
          </div>
        ))}
      </div>

      <div style={{ padding: '24px 20px 0', textAlign: 'center' }}>
        <span style={{ fontFamily: 'Caveat', fontSize: 18, color: 'var(--ink-faint)' }}>
          {inbox.length === 0 ? '✿ catch one at the arcade ✿' : '✿ catch more at the arcade ✿'}
        </span>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// ARCADE — choose a claw machine
// ───────────────────────────────────────────────────────────
function ArcadeScreen({ onEnter }) {
  const machines = [
    { id: 'daily',     title: "today's machine", subtitle: 'fresh batch · refills at midnight', tint: '#FFE6EE', glyphs: ['🧸','🎀','💗','🐰','🍧'] },
    { id: 'friends',   title: 'friends only',    subtitle: 'plushies from people who know you', tint: '#F3E6F7', glyphs: ['🎀','💗','🛍️','💐','🩰'] },
    { id: 'anonymous', title: 'soft strangers',  subtitle: 'anonymous tiny secrets',           tint: '#E6F0F7', glyphs: ['👻','💌','💐','⭐','🐸'] },
    { id: 'rare',      title: 'midnight capsule',subtitle: 'one-in-a-cloud plushies · 11 left',tint: '#F5E9D9', glyphs: ['⭐','💅🏻','🥓','🩰'] },
  ];
  return (
    <div style={{ padding: '0 0 120px' }}>
      <TopBar
        title="arcade"
        subtitle="catch a tiny feeling"
        left={<RoundBtn>🪙</RoundBtn>}
        right={<RoundBtn>♡</RoundBtn>}
      />
      {/* coins */}
      <div style={{ padding: '0 20px 14px' }}>
        <div style={{
          background: 'linear-gradient(160deg, #FFF1B8 0%, #FFD6C2 100%)',
          borderRadius: 22, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 22,
            background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, boxShadow: '0 2px 6px rgba(198,156,132,0.18)',
          }}>🪙</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 18, color: 'var(--ink)' }}>12 capsule coins</div>
            <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--ink-soft)' }}>1 free drop refills in 3h 14m</div>
          </div>
          <PlushButton size="sm" variant="cream">refill</PlushButton>
        </div>
      </div>

      {/* machines list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {machines.map(m => (
          <div key={m.id} onClick={() => onEnter(m.id)} style={{
            background: m.tint, borderRadius: 26, padding: 16,
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer', position: 'relative', overflow: 'hidden',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            {/* mini machine illustration */}
            <div style={{
              width: 80, height: 92, borderRadius: 14,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 100%)',
              border: '2px solid #fff', position: 'relative',
              boxShadow: 'inset 0 -4px 8px rgba(74,59,54,0.06), 0 4px 10px rgba(198,156,132,0.18)',
              padding: 6, display: 'flex', alignItems: 'flex-end',
              flexShrink: 0,
            }}>
              {/* tiny claw line */}
              <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', width: 1, height: 16, background: 'rgba(74,59,54,0.3)' }} />
              <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', fontSize: 8 }}>⚙</div>
              <div style={{ display: 'flex', gap: 2, fontSize: 18, lineHeight: 1, paddingBottom: 4 }}>
                {m.glyphs.slice(0, 3).map((g, i) => <span key={i} style={{ transform: `translateY(${i % 2 ? -1 : 2}px)` }}>{g}</span>)}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 17, color: 'var(--ink)' }}>{m.title}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>{m.subtitle}</div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                {m.glyphs.map((g, i) => (
                  <span key={i} style={{ fontSize: 14, opacity: 0.85 }}>{g}</span>
                ))}
                <span style={{
                  marginLeft: 'auto', fontFamily: 'Fredoka', fontWeight: 600, fontSize: 12,
                  color: 'var(--plush-deep)',
                }}>tap to play →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// CLAW MACHINE — hero interaction
// ───────────────────────────────────────────────────────────
function MachineScreen({ machineId, onBack, onCaught }) {
  // 8 plushies arranged at the bottom of the cabinet
  const initialToys = React.useMemo(() => {
    const pool = ['bear','ribbon','heart','bunny','bingsu','piglet','cat','posy','nail','dog','letter','ballet'];
    const picks = machineId === 'anonymous'
      ? ['ghost','frog','star','letter','posy','sheep','bunny','heart']
      : machineId === 'rare'
        ? ['ghost','star','nail','heart','ballet','bacon','panda','ribbon']
        : machineId === 'friends'
          ? ['ribbon','heart','tote','bingsu','piglet','posy','ballet','suit']
          : pool.slice(0, 8);
    // arrange in two rows
    return picks.map((id, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      // jitter
      const jx = (Math.sin(i * 2.3) * 8);
      const jy = (Math.cos(i * 1.7) * 4);
      return {
        id: `toy-${i}`, plushie: id,
        x: 28 + col * 58 + jx,
        y: 200 + row * 56 + jy,
        rot: (i % 2 ? 1 : -1) * (4 + (i % 3) * 3),
      };
    });
  }, [machineId]);

  const [toys, setToys] = React.useState(initialToys);
  const [clawX, setClawX] = React.useState(140);   // 28..240
  const [clawY, setClawY] = React.useState(40);
  const [phase, setPhase] = React.useState('aim'); // aim | dropping | gripping | lifting | result
  const [grabbed, setGrabbed] = React.useState(null);
  const [missed, setMissed] = React.useState(false);
  const [shake, setShake] = React.useState(false);

  const CAB_W = 280, CAB_H = 340;
  const CLAW_MIN = 28, CLAW_MAX = 240;
  const FLOOR_Y = 270;

  const moveClaw = (dir) => {
    if (phase !== 'aim') return;
    setClawX(x => Math.max(CLAW_MIN, Math.min(CLAW_MAX, x + dir * 38)));
  };

  const dropClaw = () => {
    if (phase !== 'aim') return;
    setPhase('dropping');
    setClawY(FLOOR_Y);
    setTimeout(() => {
      // find closest toy within reach
      const reach = 32;
      let best = null, bestD = Infinity;
      toys.forEach(t => {
        const d = Math.abs(t.x + 30 - clawX);
        if (d < bestD) { bestD = d; best = t; }
      });
      const caught = best && bestD < reach;
      setPhase('gripping');
      setTimeout(() => {
        if (caught) {
          setGrabbed(best);
          setToys(ts => ts.filter(t => t.id !== best.id));
          setPhase('lifting');
          setClawY(40);
          setTimeout(() => {
            setPhase('result');
          }, 1100);
        } else {
          setMissed(true);
          setShake(true);
          setPhase('lifting');
          setClawY(40);
          setTimeout(() => {
            setShake(false);
            setMissed(false);
            setPhase('aim');
          }, 1500);
        }
      }, 500);
    }, 1000);
  };

  return (
    <div style={{ padding: '0 0 120px', minHeight: '100%' }}>
      <TopBar
        title="catch carefully…"
        subtitle={machineId === 'anonymous' ? 'soft strangers' : machineId === 'rare' ? 'midnight capsule' : machineId === 'friends' ? 'friends only' : "today's machine"}
        left={<RoundBtn onClick={onBack}>‹</RoundBtn>}
        right={<div style={{
          height: 32, padding: '0 12px', borderRadius: 16,
          background: 'rgba(255,255,255,0.7)',
          display: 'flex', alignItems: 'center', gap: 4,
          fontFamily: 'Fredoka', fontWeight: 600, fontSize: 13, color: 'var(--ink)',
        }}>🪙 12</div>}
      />

      {/* the machine cabinet */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 16px 0' }}>
        <div style={{
          width: CAB_W + 40, position: 'relative',
          transform: shake ? 'translateX(-2px)' : 'none',
          transition: 'transform 0.08s',
          animation: shake ? 'sway-claw 0.1s 6' : 'none',
        }}>
          {/* cabinet top sign */}
          <div style={{
            background: 'linear-gradient(180deg, #F2A5BA 0%, #D98AA1 100%)',
            borderRadius: '22px 22px 8px 8px',
            padding: '8px 14px 10px',
            border: '3px solid #fff',
            boxShadow: '0 6px 16px rgba(217, 138, 161, 0.35), inset 0 1px 0 rgba(255,255,255,0.6)',
            textAlign: 'center', position: 'relative',
          }}>
            <Sticker emoji="🎀" size={18} rotate={-18} style={{ position:'absolute', top: -6, left: -2 }} />
            <Sticker emoji="✨" size={14} rotate={20} style={{ position:'absolute', top: -4, right: 8 }} />
            <div style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '0.04em', textShadow: '0 1px 0 rgba(0,0,0,0.1)' }}>
              ♡ dear plushie ♡
            </div>
            <div style={{ fontFamily: 'Caveat', fontSize: 14, color: 'rgba(255,255,255,0.95)', lineHeight: 1 }}>
              one drop · one tiny secret
            </div>
          </div>

          {/* cabinet glass */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(248, 221, 227, 0.55) 0%, rgba(255, 249, 245, 0.85) 100%)',
            border: '4px solid #fff',
            borderTop: 'none',
            height: CAB_H,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 0 8px 20px rgba(255,255,255,0.5), inset 0 -10px 30px rgba(198, 156, 132, 0.18), 0 12px 30px rgba(198, 156, 132, 0.22)',
          }}>
            {/* glass reflections */}
            <div style={{ position: 'absolute', top: 0, left: 8, bottom: 0, width: 14,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1))', borderRadius: 2 }} />
            <div style={{ position: 'absolute', top: 0, right: 24, height: 80, width: 6,
              background: 'rgba(255,255,255,0.5)', borderRadius: 2 }} />

            {/* claw rail */}
            <div style={{
              position: 'absolute', top: 14, left: 6, right: 6, height: 4,
              background: 'linear-gradient(180deg, #BDA3A3 0%, #8E7373 100%)',
              borderRadius: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
            }} />

            {/* claw + cable */}
            <div style={{
              position: 'absolute',
              left: clawX, top: 18,
              transition: phase === 'dropping' ? 'top 1s cubic-bezier(0.5, 0, 0.4, 1)'
                : phase === 'lifting' ? 'top 1.1s cubic-bezier(0.3, 0, 0.3, 1)'
                : 'left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.4s',
              width: 60,
              transformOrigin: 'top center',
              transform: phase === 'aim' ? 'translateY(0)' : 'none',
              animation: phase === 'aim' ? 'sway-claw 2.4s ease-in-out infinite' : 'none',
            }}>
              {/* cable */}
              <div style={{
                position: 'absolute', top: 0, left: 29, width: 2, height: clawY,
                background: 'linear-gradient(180deg, #8E7373, #6E5959)',
                transition: phase === 'dropping' ? 'height 1s cubic-bezier(0.5, 0, 0.4, 1)'
                  : phase === 'lifting' ? 'height 1.1s cubic-bezier(0.3, 0, 0.3, 1)'
                  : 'height 0.4s',
              }} />
              {/* claw head */}
              <div style={{
                position: 'absolute', top: clawY, left: 0, width: 60, height: 50,
                transition: phase === 'dropping' ? 'top 1s cubic-bezier(0.5, 0, 0.4, 1)'
                  : phase === 'lifting' ? 'top 1.1s cubic-bezier(0.3, 0, 0.3, 1)'
                  : 'top 0.4s',
              }}>
                {/* claw body */}
                <div style={{
                  width: 32, height: 18, margin: '0 auto', borderRadius: '6px 6px 8px 8px',
                  background: 'linear-gradient(180deg, #E5C9C9 0%, #B58B8B 100%)',
                  border: '1.5px solid #fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.6)',
                }} />
                {/* claw arms */}
                <div style={{
                  position: 'absolute', top: 14, left: 12,
                  width: 0, height: 0,
                  borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
                  borderTop: `${phase === 'gripping' || phase === 'lifting' ? 22 : 28}px solid #B58B8B`,
                  transform: `rotate(${phase === 'gripping' || phase === 'lifting' ? '14deg' : '-2deg'})`,
                  transformOrigin: 'top',
                  transition: 'all 0.4s',
                  filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))',
                }} />
                <div style={{
                  position: 'absolute', top: 14, right: 12,
                  width: 0, height: 0,
                  borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
                  borderTop: `${phase === 'gripping' || phase === 'lifting' ? 22 : 28}px solid #B58B8B`,
                  transform: `rotate(${phase === 'gripping' || phase === 'lifting' ? '-14deg' : '2deg'})`,
                  transformOrigin: 'top',
                  transition: 'all 0.4s',
                  filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))',
                }} />

                {/* grabbed plushie attaches to claw */}
                {grabbed && (phase === 'lifting' || phase === 'gripping') && (
                  <div style={{
                    position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)',
                  }}>
                    <PlushieCapsule plushie={PLUSHIE_BY_ID[grabbed.plushie]} size={46} idle={false} />
                  </div>
                )}
              </div>
            </div>

            {/* toys on floor */}
            {toys.map(t => (
              <div key={t.id} style={{
                position: 'absolute',
                left: t.x, top: t.y,
                transform: `rotate(${t.rot}deg)`,
                transition: 'all 0.3s',
              }}>
                <PlushieCapsule plushie={PLUSHIE_BY_ID[t.plushie]} size={52} idle={phase === 'aim'} />
              </div>
            ))}

            {/* floor */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 40,
              background: 'linear-gradient(180deg, rgba(248, 221, 227, 0.4) 0%, rgba(242, 196, 208, 0.6) 100%)',
              borderTop: '1px dashed rgba(74,59,54,0.15)',
            }} />

            {/* hint */}
            {phase === 'aim' && (
              <div style={{
                position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center',
                fontFamily: 'Caveat', fontSize: 16, color: 'rgba(74,59,54,0.55)',
              }}>aim with ← →, then drop ♡</div>
            )}
            {missed && (
              <div className="fade-in" style={{
                position: 'absolute', top: '40%', left: 0, right: 0, textAlign: 'center',
                fontFamily: 'Fredoka', fontWeight: 600, fontSize: 22, color: '#D98AA1',
                textShadow: '0 2px 4px rgba(255,255,255,0.8)',
              }}>almost!</div>
            )}
          </div>

          {/* cabinet base / control panel */}
          <div style={{
            background: 'linear-gradient(180deg, #E8D9CF 0%, #D9C2B0 100%)',
            border: '3px solid #fff',
            borderTop: 'none',
            borderRadius: '0 0 22px 22px',
            padding: '14px 14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 10,
            boxShadow: '0 8px 16px rgba(198, 156, 132, 0.25)',
          }}>
            <button onClick={() => moveClaw(-1)} disabled={phase !== 'aim'} style={{
              width: 52, height: 52, borderRadius: 26,
              border: '2px solid #fff', background: '#fff',
              fontSize: 22, color: 'var(--plush-deep)',
              boxShadow: '0 3px 0 #B89077, 0 6px 10px rgba(74,59,54,0.18)',
              cursor: phase === 'aim' ? 'pointer' : 'not-allowed',
              opacity: phase === 'aim' ? 1 : 0.5,
            }}>◀</button>
            <button onClick={dropClaw} disabled={phase !== 'aim'} style={{
              flex: 1, height: 52, borderRadius: 26,
              border: '2px solid #fff',
              background: phase === 'aim'
                ? 'linear-gradient(160deg, #F2A5BA 0%, #D98AA1 100%)'
                : 'linear-gradient(160deg, #D9C2B0 0%, #BFA391 100%)',
              color: '#fff', fontFamily: 'Fredoka', fontWeight: 700, fontSize: 16,
              letterSpacing: '0.04em',
              boxShadow: phase === 'aim'
                ? '0 4px 0 #B07385, 0 8px 14px rgba(217,138,161,0.4), inset 0 1px 0 rgba(255,255,255,0.6)'
                : 'none',
              cursor: phase === 'aim' ? 'pointer' : 'not-allowed',
            }}>{phase === 'aim' ? 'DROP ♡' : '...'}</button>
            <button onClick={() => moveClaw(1)} disabled={phase !== 'aim'} style={{
              width: 52, height: 52, borderRadius: 26,
              border: '2px solid #fff', background: '#fff',
              fontSize: 22, color: 'var(--plush-deep)',
              boxShadow: '0 3px 0 #B89077, 0 6px 10px rgba(74,59,54,0.18)',
              cursor: phase === 'aim' ? 'pointer' : 'not-allowed',
              opacity: phase === 'aim' ? 1 : 0.5,
            }}>▶</button>
          </div>
        </div>
      </div>

      {/* result modal */}
      {phase === 'result' && grabbed && (
        <CaughtModal
          plushie={PLUSHIE_BY_ID[grabbed.plushie]}
          onKeep={() => onCaught(grabbed.plushie)}
          onDrop={() => {
            setGrabbed(null);
            setPhase('aim');
          }}
        />
      )}
    </div>
  );
}

// ─────────────── Caught modal ───────────────
function CaughtModal({ plushie, onKeep, onDrop }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 40,
      background: 'rgba(74, 59, 54, 0.32)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 28,
    }} className="fade-in">
      <div className="pop-in" style={{
        background: 'linear-gradient(180deg, #fff 0%, #FFF4EE 100%)',
        borderRadius: 28, padding: '28px 22px 22px',
        textAlign: 'center', width: '100%',
        boxShadow: '0 20px 50px rgba(74,59,54,0.3)',
        border: '1px solid rgba(255,255,255,0.7)',
        position: 'relative',
      }}>
        <Sticker emoji="✨" size={20} rotate={-16} style={{ position:'absolute', top: 14, left: 18 }} />
        <Sticker emoji="🎀" size={18} rotate={18} style={{ position:'absolute', top: 18, right: 22 }} />
        <Sticker emoji="♡" size={22} rotate={-8} style={{ position:'absolute', bottom: 88, left: 10, color: '#F2A5BA' }} />
        <div style={{ fontFamily: 'Caveat', fontSize: 22, color: 'var(--ink-soft)' }}>caught!</div>
        <Title size={26} style={{ marginTop: 2 }}>you got a {plushie.name.toLowerCase()}</Title>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '14px 0 6px' }}>
          <PlushieCapsule plushie={plushie} size={108} glow />
        </div>
        <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>
          {RARITY_LABEL[plushie.rarity]} · holding a tiny secret
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <PlushButton variant="cream" full onClick={onDrop}>drop back</PlushButton>
          <PlushButton variant="pink" full onClick={onKeep}>keep ♡</PlushButton>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// OPEN — read the message inside an envelope
// ───────────────────────────────────────────────────────────
function OpenScreen({ item, onBack, onReply }) {
  const [opened, setOpened] = React.useState(item.opened);
  const p = PLUSHIE_BY_ID[item.plushie];
  return (
    <div style={{ padding: '0 0 120px', minHeight: '100%' }}>
      <TopBar
        title={opened ? 'a tiny secret' : 'open gently…'}
        subtitle={item.from}
        left={<RoundBtn onClick={onBack}>‹</RoundBtn>}
        right={<RoundBtn>♡</RoundBtn>}
      />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 24px', gap: 14 }}>
        {/* plushie */}
        <PlushieCapsule plushie={p} size={120} idle />
        <div style={{ fontFamily: 'Caveat', fontSize: 18, color: 'var(--ink-soft)' }}>
          {opened ? 'from ' + item.from : item.from + ' left you a plushie'}
        </div>

        {!opened ? (
          <>
            {/* closed envelope */}
            <div style={{
              width: '100%', maxWidth: 280, aspectRatio: '1.5 / 1', position: 'relative',
              marginTop: 6,
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, #FFF6F0 0%, #FFE9D9 100%)',
                borderRadius: 14,
                border: '1px solid rgba(74,59,54,0.1)',
                boxShadow: '0 12px 24px rgba(198, 156, 132, 0.25)',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  clipPath: 'polygon(0 0, 100% 0, 50% 60%)',
                  background: 'linear-gradient(180deg, #FFE6EE 0%, #F2A5BA 100%)',
                  borderRadius: '14px 14px 0 0',
                  boxShadow: 'inset 0 -2px 4px rgba(74,59,54,0.1)',
                }} />
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -10%)',
                  width: 36, height: 36, borderRadius: 18,
                  background: 'linear-gradient(160deg, #F2A5BA 0%, #D98AA1 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 20, boxShadow: '0 2px 4px rgba(74,59,54,0.2)',
                  animation: 'heart-beat 1.8s ease-in-out infinite',
                }}>♥</div>
                <Tape width={70} rotate={-8} style={{ position: 'absolute', top: -8, left: '50%', marginLeft: -35 }} />
              </div>
            </div>
            <PlushButton variant="pink" size="lg" onClick={() => setOpened(true)}>
              open gently ♡
            </PlushButton>
          </>
        ) : (
          <>
            {/* opened letter */}
            <div style={{
              width: '100%', position: 'relative', marginTop: 4,
              animation: 'letter-rise 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
            }}>
              <div style={{
                background: 'linear-gradient(180deg, #FFF9F5 0%, #FFF4ED 100%)',
                borderRadius: 18, padding: '20px 22px 22px',
                border: '1px solid rgba(74,59,54,0.08)',
                boxShadow: '0 10px 26px rgba(198, 156, 132, 0.22)',
                position: 'relative',
                backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 30px, rgba(248, 221, 227, 0.35) 30px 31px)',
              }}>
                <Tape width={50} color="rgba(200, 182, 226, 0.7)" rotate={-12} style={{ position: 'absolute', top: -10, left: 14 }} />
                <Tape width={50} color="rgba(255, 214, 194, 0.8)" rotate={8} style={{ position: 'absolute', top: -10, right: 14 }} />
                <div style={{ fontFamily: 'Caveat', fontSize: 18, color: 'var(--ink-soft)', marginBottom: 8 }}>
                  dear plushie keeper,
                </div>
                <div style={{
                  fontFamily: 'Fredoka', fontWeight: 400, fontSize: 16,
                  color: 'var(--ink)', lineHeight: 1.7, textWrap: 'pretty',
                }}>
                  {item.message}
                </div>
                <div style={{
                  marginTop: 14, textAlign: 'right',
                  fontFamily: 'Caveat', fontSize: 20, color: 'var(--plush-deep)',
                }}>— {item.from}</div>
                <div style={{
                  marginTop: 6, textAlign: 'right',
                  fontFamily: 'Inter', fontSize: 11, color: 'var(--ink-faint)',
                }}>{item.when}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <PlushButton variant="cream" full onClick={onBack}>back to shelf</PlushButton>
              <PlushButton variant="pink" full onClick={onReply}>reply softly ♡</PlushButton>
            </div>
            <div style={{ fontFamily: 'Caveat', fontSize: 16, color: 'var(--ink-faint)', marginTop: 4 }}>
              ✿ kept gently in your shelf ✿
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// SEND — compose & send a plushie
// ───────────────────────────────────────────────────────────
function SendScreen({ onBack, onSent, receiverProfile, senderProfile }) {
  // receiverProfile = { uid, displayName, username } when sending directly to a friend
  const [step, setStep] = React.useState(1); // 1 pick · 2 write · 3 result
  const [picked, setPicked] = React.useState('bear');
  const [msg, setMsg] = React.useState('');
  const [fromName, setFromName] = React.useState(senderProfile?.displayName || '');
  const [anon, setAnon] = React.useState(false);
  const [link, setLink] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  const prompts = [
    "you make ordinary days feel softer.",
    "i think of you when it rains.",
    "thank you for existing today.",
    "saving this little feeling for you.",
  ];

  const generate = async () => {
    const giftFrom = anon ? '' : (fromName.trim() || 'a soft stranger');
    if (receiverProfile) {
      // direct send to friend's inbox
      setSending(true);
      try {
        await window.firebaseDB.saveGift(receiverProfile.uid, {
          plushie: picked, message: msg.trim(), from: giftFrom,
          when: 'just now', opened: false,
        });
        setStep(3);
      } catch (e) {
        console.error('send error', e);
      } finally {
        setSending(false);
      }
    } else {
      // public link (anonymous send)
      const url = window.buildGiftLink({ plushie: picked, message: msg.trim(), from: giftFrom });
      setLink(url);
      setStep(3);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      // fallback: select the text
      const ta = document.createElement('textarea');
      ta.value = link; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy'); ta.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'dear plushie!',
          text: 'i left you a tiny plushie ♡ catch it gently:',
          url: link,
        });
      } catch (e) { /* user cancelled */ }
    } else {
      handleCopy();
    }
  };

  return (
    <div style={{ padding: '0 0 120px', minHeight: '100%' }}>
      <TopBar
        title={receiverProfile ? `sending to ${receiverProfile.displayName}` : 'send a plushie'}
        subtitle={['', 'pick one ♡', 'tiny secret', receiverProfile ? 'delivered ♡' : 'your link is ready'][step]}
        left={<RoundBtn onClick={step === 1 ? onBack : () => setStep(s => s - 1)}>‹</RoundBtn>}
        right={<div style={{ fontFamily:'Fredoka', fontWeight:600, fontSize:12, color:'var(--ink-faint)' }}>{step}/3</div>}
      />

      {/* progress */}
      <div style={{ padding: '0 20px 14px' }}>
        <div style={{
          height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.6)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: `${(step / 3) * 100}%`,
            background: 'linear-gradient(90deg, #F2A5BA, #D98AA1)',
            transition: 'width 0.4s ease-out',
          }} />
        </div>
      </div>

      {step === 1 && (
        <div className="fade-in" style={{ padding: '4px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 14 }}>
            <PlushieCapsule plushie={PLUSHIE_BY_ID[picked]} size={108} idle glow />
            <Title size={20} style={{ marginTop: 10, textAlign: 'center' }}>{PLUSHIE_BY_ID[picked].name}</Title>
            <div style={{ fontFamily: 'Caveat', fontSize: 16, color: 'var(--ink-soft)' }}>
              {RARITY_LABEL[PLUSHIE_BY_ID[picked].rarity]}
            </div>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10,
            background: 'rgba(255,255,255,0.6)', borderRadius: 22, padding: 14,
            border: '1px solid rgba(255,255,255,0.6)',
          }}>
            {PLUSHIES.map(p => (
              <button key={p.id} onClick={() => setPicked(p.id)} style={{
                background: picked === p.id ? '#FFE6EE' : 'transparent',
                border: picked === p.id ? '2px solid #F2A5BA' : '2px solid transparent',
                borderRadius: 16, padding: 6, cursor: 'pointer',
                transition: 'all 0.15s',
              }}>
                <PlushieCapsule plushie={p} size={48} idle={false} />
              </button>
            ))}
          </div>
          <div style={{ marginTop: 18 }}>
            <PlushButton variant="pink" size="lg" full onClick={() => setStep(2)}>
              pick this plushie ♡
            </PlushButton>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="fade-in" style={{ padding: '4px 20px' }}>
          <div style={{
            background: 'linear-gradient(180deg, #FFF9F5 0%, #FFF4ED 100%)',
            borderRadius: 20, padding: '18px 18px 14px',
            boxShadow: 'var(--shadow-card)', position: 'relative',
            backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 30px, rgba(248, 221, 227, 0.35) 30px 31px)',
          }}>
            <Tape width={50} color="rgba(200, 182, 226, 0.7)" rotate={-12} style={{ position: 'absolute', top: -10, left: 14 }} />
            <div style={{ fontFamily: 'Caveat', fontSize: 18, color: 'var(--ink-soft)', marginBottom: 4 }}>
              tiny secret to leave inside…
            </div>
            <textarea
              value={msg}
              onChange={e => setMsg(e.target.value.slice(0, 140))}
              placeholder="say something gentle…"
              rows={5}
              style={{
                width: '100%', border: 0, background: 'transparent',
                fontFamily: 'Fredoka', fontWeight: 400, fontSize: 16, color: 'var(--ink)',
                resize: 'none', outline: 'none', lineHeight: 1.7,
                padding: 0, boxSizing: 'border-box',
              }}
            />
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: 'Inter', fontSize: 11, color: 'var(--ink-faint)', marginTop: 4,
            }}>
              <span>♡ kept private until they open</span>
              <span>{msg.length}/140</span>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 13, color: 'var(--ink-soft)', marginBottom: 8 }}>
              ✿ borrow a prompt
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {prompts.map(p => (
                <button key={p} onClick={() => setMsg(p)} style={{
                  background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.7)',
                  borderRadius: 14, padding: '6px 10px',
                  fontFamily: 'Caveat', fontSize: 14, color: 'var(--ink-soft)',
                  cursor: 'pointer',
                }}>{p}</button>
              ))}
            </div>
          </div>

          {/* from name */}
          <div style={{ marginTop: 14 }}>
            <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 13, color: 'var(--ink-soft)', marginBottom: 8 }}>
              ✿ sign it (optional)
            </div>
            <div style={{
              background: anon ? 'rgba(200, 182, 226, 0.18)' : 'rgba(255,255,255,0.6)',
              border: anon ? '2px solid #C8B6E2' : '1px solid rgba(255,255,255,0.7)',
              borderRadius: 16, padding: '4px 4px 4px 14px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <input
                value={anon ? '' : fromName}
                onChange={e => setFromName(e.target.value.slice(0, 24))}
                placeholder={anon ? 'sent as a soft stranger' : 'your name · e.g. moony'}
                disabled={anon}
                style={{
                  flex: 1, border: 0, background: 'transparent', outline: 'none',
                  fontFamily: 'Fredoka', fontWeight: 500, fontSize: 15,
                  color: anon ? 'var(--ink-faint)' : 'var(--ink)',
                  padding: '10px 0',
                }}
              />
              <button onClick={() => setAnon(a => !a)} style={{
                height: 36, padding: '0 12px', borderRadius: 18,
                border: 0,
                background: anon ? '#C8B6E2' : 'rgba(255,255,255,0.9)',
                color: anon ? '#fff' : 'var(--ink-soft)',
                fontFamily: 'Fredoka', fontWeight: 600, fontSize: 12,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
              }}>👻 anon</button>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <PlushButton variant="pink" size="lg" full disabled={!msg.trim() || sending} onClick={generate}>
              {sending ? 'sending softly…' : receiverProfile ? `send to ${receiverProfile.displayName} ♡` : 'create link ♡'}
            </PlushButton>
            {!receiverProfile && (
              <div style={{ textAlign:'center', marginTop:8, fontFamily:'Inter', fontSize:11, color:'var(--ink-faint)' }}>
                no account needed · the link IS the gift
              </div>
            )}
          </div>
        </div>
      )}

      {step === 3 && receiverProfile && (
        /* ── direct send confirmation ── */
        <div className="fade-in" style={{ padding: '20px 20px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:20, textAlign:'center' }}>
          <div className="pop-in" style={{
            width:'100%', background:'linear-gradient(160deg, #FFE6EE 0%, #F3E6F7 100%)',
            borderRadius:26, padding:'28px 18px',
            boxShadow:'var(--shadow-card)', border:'1px solid rgba(255,255,255,0.7)',
            position:'relative', overflow:'hidden',
          }}>
            <Sticker emoji="✨" size={18} rotate={-12} style={{ position:'absolute', top:12, left:16 }} />
            <Sticker emoji="🎀" size={16} rotate={20} style={{ position:'absolute', top:14, right:18 }} />
            <div style={{ fontSize:60, marginBottom:8 }}>💌</div>
            <Title size={22}>your plushie landed softly</Title>
            <div style={{ fontFamily:'Caveat', fontSize:20, color:'var(--plush-deep)', marginTop:6 }}>
              on {receiverProfile.displayName}'s shelf ♡
            </div>
            <div style={{ marginTop:12 }}>
              <PlushieCapsule plushie={PLUSHIE_BY_ID[picked]} size={72} idle glow />
            </div>
          </div>
          <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:10 }}>
            <PlushButton variant="pink" full size="md" onClick={() => { setStep(1); setMsg(''); }}>
              send another plushie
            </PlushButton>
            <PlushButton variant="cream" full size="md" onClick={onSent}>
              back to shelf ♡
            </PlushButton>
          </div>
        </div>
      )}

      {step === 3 && !receiverProfile && (
        /* ── public link ── */
        <div className="fade-in" style={{ padding: '4px 20px' }}>
          <div className="pop-in" style={{
            background: 'linear-gradient(160deg, #FFE6EE 0%, #F3E6F7 100%)',
            borderRadius: 26, padding: '20px 18px 18px',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
            boxShadow: 'var(--shadow-card)', border: '1px solid rgba(255,255,255,0.7)',
          }}>
            <Sticker emoji="✨" size={18} rotate={-12} style={{ position:'absolute', top:12, left:16 }} />
            <Sticker emoji="🎀" size={16} rotate={20} style={{ position:'absolute', top:14, right:18 }} />
            <PlushieCapsule plushie={PLUSHIE_BY_ID[picked]} size={84} idle glow />
            <div style={{ fontFamily:'Caveat', fontSize:20, color:'var(--ink-soft)', marginTop:8 }}>your link is ready ♡</div>
            <Title size={20} style={{ marginTop:2 }}>
              {anon || !fromName.trim() ? 'a soft stranger' : fromName.trim()} → someone
            </Title>
          </div>
          <div style={{
            marginTop:14, background:'#fff',
            border:'1.5px solid rgba(217,138,161,0.25)',
            borderRadius:18, padding:'14px 16px',
            boxShadow:'0 4px 12px rgba(198,156,132,0.18)',
          }}>
            <div style={{ fontFamily:'Caveat', fontSize:15, color:'var(--ink-soft)', marginBottom:6 }}>✎ your plushie link</div>
            <div style={{
              fontFamily:'ui-monospace, monospace', fontSize:12, color:'var(--plush-deep)',
              wordBreak:'break-all', lineHeight:1.4, background:'#FFF9F5',
              borderRadius:10, padding:'10px 12px',
              border:'1px dashed rgba(217,138,161,0.3)', maxHeight:92, overflow:'auto',
            }}>{link}</div>
          </div>
          <div style={{ display:'flex', gap:10, marginTop:14 }}>
            <PlushButton variant="cream" full size="lg" onClick={handleCopy}>{copied ? 'copied ♡' : 'copy link'}</PlushButton>
            <PlushButton variant="pink" full size="lg" onClick={handleNativeShare}>share ♡</PlushButton>
          </div>
          <button onClick={() => { window.location.hash = link.split('#')[1]; }} style={{
            width:'100%', marginTop:12, padding:'12px 14px',
            background:'rgba(255,255,255,0.5)', border:'1px dashed rgba(74,59,54,0.18)',
            borderRadius:16, cursor:'pointer',
            fontFamily:'Fredoka', fontWeight:500, fontSize:13, color:'var(--ink-soft)',
          }}>✎ preview how it looks for them →</button>
          <div style={{
            marginTop:14, padding:'14px 16px', background:'rgba(255,230,238,0.5)',
            borderRadius:16, fontFamily:'Caveat', fontSize:15, color:'var(--ink-soft)',
            textAlign:'center', lineHeight:1.3,
          }}>
            paste the link anywhere · line, ig, sms<br/>
            when they open it they'll see a tiny claw machine ♡
          </div>
          <div style={{ marginTop:16 }}>
            <PlushButton variant="ghost" full size="md" onClick={onSent}>done · back to shelf</PlushButton>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// INBOX — list of received plushies
// ───────────────────────────────────────────────────────────
function InboxScreen({ inbox, onOpen }) {
  return (
    <div style={{ padding: '0 0 120px' }}>
      <TopBar
        title="inbox"
        subtitle="someone left these for you"
        left={<RoundBtn>⌕</RoundBtn>}
        right={<RoundBtn>⋯</RoundBtn>}
      />
      <div style={{ padding: '4px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {inbox.map(item => {
          const p = PLUSHIE_BY_ID[item.plushie];
          return (
            <div key={item.id} onClick={() => onOpen(item.id)} style={{
              background: item.opened ? 'rgba(255,255,255,0.55)' : '#FFE6EE',
              borderRadius: 22, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
              border: '1px solid rgba(255,255,255,0.7)',
              boxShadow: item.opened ? 'none' : 'var(--shadow-card)',
              cursor: 'pointer', position: 'relative',
            }}>
              <PlushieCapsule plushie={p} size={56} idle={!item.opened} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>
                    {item.from}
                  </div>
                  {!item.opened && (
                    <div style={{
                      width: 8, height: 8, borderRadius: 4, background: '#F2A5BA',
                      animation: 'heart-beat 1.8s ease-in-out infinite',
                    }} />
                  )}
                </div>
                <div style={{
                  fontFamily: 'Inter', fontSize: 12, color: 'var(--ink-soft)', marginTop: 2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  maxWidth: 200,
                  fontStyle: item.opened ? 'normal' : 'italic',
                }}>
                  {item.opened ? item.message : '✿ unopened · tap to open gently'}
                </div>
              </div>
              <div style={{ fontFamily: 'Caveat', fontSize: 14, color: 'var(--ink-faint)' }}>
                {item.when}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// ME — profile / cozy stats
// ───────────────────────────────────────────────────────────
function MeScreen({ inbox, user, profile, onSignOut, onOpenCircles, circleCount = 0 }) {
  const displayName = profile?.displayName || user?.displayName || 'soft friend';
  const handle = profile?.username ? '@' + profile.username : '@' + (user?.email?.split('@')[0] || 'softfriend');
  const total = inbox.length;
  const opened = inbox.filter(i => i.opened).length;
  return (
    <div style={{ padding: '0 0 120px' }}>
      <TopBar title="you" subtitle={`hi, ${displayName.split(' ')[0]} ♡`} left={<RoundBtn>⚙︎</RoundBtn>} right={<RoundBtn>♡</RoundBtn>} />
      <div style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* profile card */}
        <div style={{
          background: 'linear-gradient(160deg, #FFE6EE 0%, #F3E6F7 100%)',
          borderRadius: 26, padding: '20px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: 'var(--shadow-card)',
          position: 'relative', overflow: 'hidden',
        }}>
          <Sticker emoji="✨" size={16} rotate={-12} style={{ position:'absolute', top: 14, right: 18 }} />
          <PlushieCapsule plushie={PLUSHIE_BY_ID.bunny} size={72} idle glow />
          <div style={{ flex: 1 }}>
            <Title size={20}>{displayName}</Title>
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--ink-soft)' }}>{handle}</div>
            <div style={{
              marginTop: 8, fontFamily: 'Caveat', fontSize: 16, color: 'var(--plush-deep)',
            }}>"keeper of tiny feelings"</div>
          </div>
        </div>

        {/* stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { n: total, l: 'received', e: '💌' },
            { n: opened, l: 'opened',   e: '✿' },
            { n: 7,      l: 'sent out', e: '🎀' },
          ].map(s => (
            <div key={s.l} style={{
              background: 'rgba(255,255,255,0.7)',
              borderRadius: 18, padding: '14px 10px', textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.7)',
            }}>
              <div style={{ fontSize: 18 }}>{s.e}</div>
              <div style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: 22, color: 'var(--ink)' }}>{s.n}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 10, color: 'var(--ink-soft)' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* cozy circles row */}
        <button onClick={onOpenCircles} style={{
          background: 'linear-gradient(160deg, #F3E6F7 0%, #FFE6EE 100%)',
          borderRadius: 22, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow: 'var(--shadow-card)',
          cursor: 'pointer', textAlign: 'left',
          position: 'relative', overflow: 'hidden',
        }}>
          <Sticker emoji="✨" size={14} rotate={-12} style={{ position:'absolute', top: 10, right: 14 }} />
          <div style={{
            width: 44, height: 44, borderRadius: 22, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, boxShadow: '0 2px 6px rgba(198,156,132,0.18)',
          }}>🎀</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>
              cozy circles
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--ink-soft)' }}>
              {circleCount > 0 ? `you’re in ${circleCount} · share your code MOON42` : 'join one with a code · share yours'}
            </div>
          </div>
          <span style={{ color: 'var(--plush-deep)', fontSize: 22 }}>›</span>
        </button>

        {/* settings list */}
        <div style={{
          background: 'rgba(255,255,255,0.7)', borderRadius: 22,
          border: '1px solid rgba(255,255,255,0.7)', overflow: 'hidden',
        }}>
          {[
            { icon: '🌙', label: 'cozy mode', meta: 'on' },
            { icon: '🔔', label: 'gentle notifications', meta: 'softly' },
            { icon: '🎵', label: 'arcade ambience', meta: 'lofi piano' },
            { icon: '✿', label: 'who can send to you', meta: 'friends' },
          ].map((row, i, a) => (
            <div key={row.label} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              borderBottom: i < a.length - 1 ? '1px dashed rgba(74,59,54,0.08)' : 'none',
            }}>
              <span style={{ fontSize: 18 }}>{row.icon}</span>
              <div style={{ flex: 1, fontFamily: 'Fredoka', fontWeight: 500, fontSize: 14, color: 'var(--ink)' }}>{row.label}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--ink-soft)' }}>{row.meta}</div>
            </div>
          ))}
        </div>

        {/* sign out */}
        <button onClick={onSignOut} style={{
          background: 'none', border: '1.5px solid var(--milk)',
          borderRadius: 100, padding: '10px 22px',
          fontFamily: 'var(--font-body, Inter)', fontSize: 13, color: 'var(--ink-soft)',
          cursor: 'pointer', alignSelf: 'center',
        }}>
          sign out softly ♡
        </button>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// MY CIRCLES — list of cozy circle worlds
// ───────────────────────────────────────────────────────────
function MyCirclesScreen({ onBack, circles, onOpenCircle, onCreateCircle, onJoinCircle }) {
  const loading = circles === undefined;
  return (
    <div style={{ padding: '0 0 120px', minHeight: '100%' }}>
      <TopBar
        title="cozy circles"
        subtitle="your shared plushie worlds"
        left={<RoundBtn onClick={onBack}>‹</RoundBtn>}
      />

      {/* CTA row */}
      <div style={{ padding: '4px 16px 18px', display: 'flex', gap: 10 }}>
        <button onClick={onCreateCircle} style={{
          flex: 1, padding: '16px 10px',
          background: 'linear-gradient(160deg,#F2A5BA 0%,#D98AA1 100%)',
          border: 'none', borderRadius: 22, cursor: 'pointer',
          color: '#fff', fontFamily: 'Fredoka', fontWeight: 700, fontSize: 15,
          boxShadow: '0 6px 18px rgba(217,138,161,0.4)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
        }}>
          <span style={{ fontSize: 26 }}>✦</span>
          create a circle
        </button>
        <button onClick={onJoinCircle} style={{
          flex: 1, padding: '16px 10px',
          background: 'rgba(255,255,255,0.72)',
          border: '2px dashed rgba(217,138,161,0.38)',
          borderRadius: 22, cursor: 'pointer',
          color: 'var(--ink)', fontFamily: 'Fredoka', fontWeight: 700, fontSize: 15,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
        }}>
          <span style={{ fontSize: 26 }}>🔑</span>
          join a circle
        </button>
      </div>

      {/* circles list */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ fontFamily:'Fredoka', fontWeight:600, fontSize:13, color:'var(--ink-soft)', padding:'0 6px 10px', letterSpacing:'0.04em' }}>
          ✿ your circles
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:40, fontFamily:'Caveat', fontSize:18, color:'var(--ink-soft)' }}>
            gathering your circles… 🌸
          </div>
        ) : circles.length === 0 ? (
          <div style={{
            background:'rgba(255,255,255,0.5)', border:'2px dashed rgba(74,59,54,0.12)',
            borderRadius:24, padding:'36px 20px', textAlign:'center',
          }}>
            <div style={{ fontSize:40, marginBottom:10 }}>🪴</div>
            <div style={{ fontFamily:'Fredoka', fontWeight:600, fontSize:18, color:'var(--ink)', marginBottom:6 }}>
              no circles yet
            </div>
            <div style={{ fontFamily:'Caveat', fontSize:16, color:'var(--ink-soft)', lineHeight:1.5 }}>
              create one to share plushies<br />with your close people
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {circles.map(circle => {
              const t = CIRCLE_THEMES[circle.theme] || CIRCLE_THEMES.rose;
              const memberCount = (circle.memberUids || []).length;
              return (
                <button key={circle.id} onClick={() => onOpenCircle(circle.id)} style={{
                  width:'100%', textAlign:'left', background: t.bg,
                  borderRadius:24, padding:'16px 18px',
                  border:'1px solid rgba(255,255,255,0.7)',
                  boxShadow:'var(--shadow-card)', cursor:'pointer',
                  position:'relative', overflow:'hidden',
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{
                      width:52, height:52, borderRadius:26, flexShrink:0,
                      background:'#fff', fontSize:26,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      boxShadow:`0 4px 12px ${t.accent}55`,
                    }}>{t.emoji}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:'Fredoka', fontWeight:700, fontSize:17, color: t.text === '#C8B4F8' ? t.text : 'var(--ink)' }}>
                        {circle.name}
                      </div>
                      <div style={{ fontFamily:'Inter', fontSize:12, color:'var(--ink-soft)', marginTop:2 }}>
                        {memberCount} {memberCount === 1 ? 'keeper' : 'keepers'} · {t.label}
                      </div>
                    </div>
                    <span style={{ color: t.text, fontSize:20 }}>›</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// CREATE CIRCLE — name + theme picker
// ───────────────────────────────────────────────────────────
function CreateCircleScreen({ onBack, onCreated }) {
  const [name, setName] = React.useState('');
  const [theme, setTheme] = React.useState('rose');
  const [creating, setCreating] = React.useState(false);
  const [error, setError] = React.useState('');
  const canCreate = name.trim().length >= 2 && name.trim().length <= 32;
  const t = CIRCLE_THEMES[theme];

  const handleCreate = async () => {
    if (!canCreate || creating) return;
    setCreating(true); setError('');
    try { await onCreated({ name: name.trim(), theme }); }
    catch (e) { setError('something went soft · try again'); setCreating(false); }
  };

  return (
    <div style={{ padding: '0 0 120px', minHeight: '100%' }}>
      <TopBar title="new circle" subtitle="create a shared plushie world" left={<RoundBtn onClick={onBack}>‹</RoundBtn>} />
      <div style={{ padding: '12px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

        <div className="float-soft" style={{
          width: 92, height: 92, borderRadius: 46,
          background: t.bg, fontSize: 42,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 10px 28px ${t.accent}55`,
          border: '2px solid rgba(255,255,255,0.8)', transition: 'all 0.35s ease',
        }}>{t.emoji}</div>

        {/* name */}
        <div style={{ width: '100%' }}>
          <div style={{ fontFamily:'Fredoka', fontWeight:600, fontSize:13, color:'var(--ink-soft)', marginBottom:8, letterSpacing:'0.04em' }}>
            circle name
          </div>
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="softgirl club, cottagecore crew…"
            maxLength={32}
            style={{
              width:'100%', padding:'14px 16px',
              background:'#fff', border:'2px solid rgba(217,138,161,0.25)',
              borderRadius:16, fontFamily:'Fredoka', fontWeight:500, fontSize:17,
              color:'var(--ink)', outline:'none',
              boxShadow:'0 2px 8px rgba(198,156,132,0.1)',
            }}
          />
          <div style={{ fontFamily:'Inter', fontSize:11, color:'var(--ink-faint)', marginTop:4, textAlign:'right' }}>{name.length}/32</div>
        </div>

        {/* theme picker */}
        <div style={{ width: '100%' }}>
          <div style={{ fontFamily:'Fredoka', fontWeight:600, fontSize:13, color:'var(--ink-soft)', marginBottom:10, letterSpacing:'0.04em' }}>
            room vibe
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {Object.entries(CIRCLE_THEMES).map(([key, ct]) => (
              <button key={key} onClick={() => setTheme(key)} style={{
                flex:1, padding:'10px 4px',
                background: ct.bg,
                border: `2px solid ${theme === key ? ct.text : 'rgba(255,255,255,0.5)'}`,
                borderRadius:16, cursor:'pointer',
                display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                boxShadow: theme === key ? `0 4px 14px ${ct.accent}55` : '0 2px 6px rgba(198,156,132,0.1)',
                transition:'all 0.2s',
              }}>
                <span style={{ fontSize:20 }}>{ct.emoji}</span>
                <span style={{ fontFamily:'Inter', fontSize:9, color: ct.text, fontWeight:700 }}>{key}</span>
              </button>
            ))}
          </div>
        </div>

        {error && <div style={{ fontFamily:'Caveat', fontSize:16, color:'#D98AA1' }}>{error}</div>}

        <div style={{ width:'100%' }}>
          <PlushButton variant="pink" size="lg" full disabled={!canCreate || creating} onClick={handleCreate}>
            {creating ? 'creating your world…' : `create ${t.emoji} ${name.trim() || 'your circle'}`}
          </PlushButton>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// JOIN CIRCLE — enter invite code
// ───────────────────────────────────────────────────────────
function JoinCircleScreen({ onBack, myUid, onJoined }) {
  const [code, setCode] = React.useState(['','','','','','']);
  const [status, setStatus] = React.useState('idle');
  const [foundCircle, setFoundCircle] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [joining, setJoining] = React.useState(false);
  const inputRef = React.useRef(null);
  const value = code.join('');
  const filled = value.length === 6;

  React.useEffect(() => { setTimeout(() => inputRef.current?.focus(), 200); }, []);

  const updateChar = (v) => {
    const clean = v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    const arr = ['','','','','',''];
    for (let i = 0; i < clean.length; i++) arr[i] = clean[i];
    setCode(arr); setStatus('idle'); setFoundCircle(null); setErrorMsg('');
  };

  const search = async () => {
    if (!filled || status === 'searching') return;
    setStatus('searching'); setFoundCircle(null); setErrorMsg('');
    try {
      const circle = await window.firebaseDB.getCircleByInviteCode(value);
      if (!circle) { setStatus('error'); setErrorMsg('no circle found with this code'); return; }
      if ((circle.memberUids || []).includes(myUid)) { setStatus('error'); setErrorMsg("you're already inside this circle ♡"); return; }
      setFoundCircle(circle); setStatus('found');
    } catch (e) { setStatus('error'); setErrorMsg('something went soft · try again'); }
  };

  const confirmJoin = async () => {
    if (!foundCircle || joining) return;
    setJoining(true);
    try {
      await window.firebaseDB.joinCircle(myUid, value);
      setStatus('joined');
      setTimeout(() => onJoined(foundCircle), 1400);
    } catch (e) {
      setStatus('error');
      setErrorMsg(e.message === 'already a member' ? "you're already inside this circle ♡" : 'something went soft · try again');
      setJoining(false);
    }
  };

  return (
    <div style={{ padding: '0 0 120px', minHeight: '100%' }}>
      <TopBar title="join a circle" subtitle="enter the 6-letter invite code" left={<RoundBtn onClick={onBack}>‹</RoundBtn>} />
      <div style={{ padding:'8px 24px', display:'flex', flexDirection:'column', alignItems:'center', gap:18 }}>

        <div className="float-soft" style={{
          width:88, height:88, borderRadius:44,
          background:'linear-gradient(160deg,#F3E6F7 0%,#E6EEFF 100%)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:40, boxShadow:'0 8px 24px rgba(168,130,214,0.25)',
          border:'2px solid rgba(255,255,255,0.8)',
        }}>🔑</div>

        <div style={{ textAlign:'center' }}>
          <Title size={22}>find your circle</Title>
          <div style={{ fontFamily:'Caveat', fontSize:17, color:'var(--ink-soft)', marginTop:4 }}>ask a friend for their invite code</div>
        </div>

        <div onClick={() => inputRef.current?.focus()} style={{ display:'flex', gap:8, cursor:'text' }}>
          {code.map((ch, i) => {
            const focused = !ch && i === value.length;
            const isErr = status === 'error', isGood = status === 'found' || status === 'joined';
            return (
              <div key={i} style={{
                width:42, height:54, borderRadius:14,
                background: ch ? '#fff' : 'rgba(255,255,255,0.6)',
                border:`2px solid ${isErr ? '#D98AA1' : isGood ? '#7FAF7F' : focused ? '#C8B8E8' : ch ? 'rgba(200,184,232,0.5)' : 'rgba(200,184,232,0.25)'}`,
                boxShadow: focused ? '0 0 0 4px rgba(200,184,232,0.2)' : '0 2px 6px rgba(198,156,132,0.1)',
                display:'flex', alignItems:'center', justifyContent:'center', position:'relative',
                fontFamily:'Fredoka', fontWeight:700, fontSize:26, color:'var(--plush-deep)',
                transition:'all 0.2s',
              }}>
                {ch}
                {focused && <div style={{ position:'absolute', width:2, height:24, background:'#C8B8E8', borderRadius:1 }} />}
              </div>
            );
          })}
        </div>
        <input ref={inputRef} value={value} onChange={e => updateChar(e.target.value)}
          maxLength={6} autoCapitalize="characters" autoComplete="off"
          style={{ position:'absolute', left:-9999, opacity:0, width:1, height:1 }} />

        {status === 'searching' && <div style={{ fontFamily:'Caveat', fontSize:18, color:'var(--ink-soft)' }}>searching gently… 🌸</div>}
        {status === 'error'     && <div className="fade-in" style={{ fontFamily:'Caveat', fontSize:17, color:'#D98AA1', textAlign:'center' }}>{errorMsg}</div>}
        {status === 'joined'    && foundCircle && (
          <div className="fade-in pop-in" style={{ fontFamily:'Caveat', fontSize:18, color:'#7FAF7F', textAlign:'center' }}>
            welcome to {foundCircle.name}! 🧸✨
          </div>
        )}

        {(status === 'found' || status === 'joined') && foundCircle && (() => {
          const t = CIRCLE_THEMES[foundCircle.theme] || CIRCLE_THEMES.rose;
          const mc = (foundCircle.memberUids || []).length;
          return (
            <div className="fade-in pop-in" style={{
              width:'100%', borderRadius:22, padding:'16px 18px',
              background: t.bg, boxShadow:'var(--shadow-card)',
              border:'1px solid rgba(255,255,255,0.7)',
              display:'flex', alignItems:'center', gap:14,
            }}>
              <div style={{ width:52, height:52, borderRadius:26, flexShrink:0, background:'#fff', fontSize:26, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 10px ${t.accent}50` }}>{t.emoji}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:'Fredoka', fontWeight:700, fontSize:17, color:'var(--ink)' }}>{foundCircle.name}</div>
                <div style={{ fontFamily:'Inter', fontSize:12, color:'var(--ink-soft)', marginTop:2 }}>{mc} {mc === 1 ? 'keeper' : 'keepers'} already inside</div>
              </div>
            </div>
          );
        })()}

        {status === 'found' && (
          <div style={{ width:'100%' }}>
            <PlushButton variant="pink" size="lg" full disabled={joining} onClick={confirmJoin}>
              {joining ? 'joining…' : `join ${foundCircle.name} ♡`}
            </PlushButton>
          </div>
        )}
        {(status === 'idle' || status === 'error') && (
          <div style={{ width:'100%', marginTop:4 }}>
            <PlushButton variant="pink" size="lg" full disabled={!filled || status === 'searching'} onClick={search}>
              find circle ♡
            </PlushButton>
          </div>
        )}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// JOIN — enter shelf code to add a friend
// ───────────────────────────────────────────────────────────
function JoinCodeScreen({ onBack, myUid, onAddFriend }) {
  const [code, setCode] = React.useState(['', '', '', '', '', '']);
  const [status, setStatus] = React.useState('idle'); // idle | searching | found | error
  const [foundProfile, setFoundProfile] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [adding, setAdding] = React.useState(false);
  const inputRef = React.useRef(null);
  const value = code.join('');
  const filled = value.length === 6;

  React.useEffect(() => { setTimeout(() => inputRef.current?.focus(), 200); }, []);

  const updateChar = (v) => {
    const clean = v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    const arr = ['', '', '', '', '', ''];
    for (let i = 0; i < clean.length; i++) arr[i] = clean[i];
    setCode(arr);
    setStatus('idle');
    setFoundProfile(null);
    setErrorMsg('');
  };

  const search = async () => {
    if (!filled || status === 'searching') return;
    setStatus('searching');
    setFoundProfile(null);
    setErrorMsg('');
    try {
      const profile = await window.firebaseDB.getProfileByShelfCode(value);
      if (!profile) {
        setStatus('error');
        setErrorMsg('no shelf found with this tiny code');
        return;
      }
      if (profile.uid === myUid) {
        setStatus('error');
        setErrorMsg('this is your own shelf code ♡');
        return;
      }
      setFoundProfile(profile);
      setStatus('found');
    } catch (e) {
      setStatus('error');
      setErrorMsg('something went soft · try again');
    }
  };

  const confirmAdd = async () => {
    if (!foundProfile || adding) return;
    setAdding(true);
    try {
      await onAddFriend(foundProfile.uid);
      setStatus('added');
    } catch (e) {
      if (e.message === 'duplicate') {
        setStatus('error');
        setErrorMsg("you're already connected ♡");
      } else {
        setStatus('error');
        setErrorMsg('something went soft · try again');
      }
      setAdding(false);
    }
  };

  const avatarColor = ['#FFE6EE','#F3E6F7','#FFD6C2','#E8D9CF','#C7DDB7'];

  return (
    <div style={{ padding: '0 0 120px', minHeight: '100%' }}>
      <TopBar
        title="add a friend"
        subtitle="enter 6 tiny letters from a friend"
        left={<RoundBtn onClick={onBack}>‹</RoundBtn>}
      />
      <div style={{ padding: '8px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div className="float-soft" style={{
          width: 88, height: 88, borderRadius: 44,
          background: 'linear-gradient(160deg, #FFE6EE 0%, #F3E6F7 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40,
          boxShadow: '0 8px 24px rgba(198,156,132,0.25)', border: '1px solid rgba(255,255,255,0.8)',
          position: 'relative',
        }}>
          🧸
          <Sticker emoji="✨" size={14} rotate={-12} style={{ position:'absolute', top: 8, right: 6 }} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <Title size={22}>find their shelf</Title>
          <div style={{ fontFamily: 'Caveat', fontSize: 17, color: 'var(--ink-soft)', marginTop: 4 }}>
            ask a friend for their shelf code
          </div>
        </div>

        {/* code boxes */}
        <div onClick={() => inputRef.current?.focus()} style={{ display: 'flex', gap: 8, cursor: 'text', marginTop: 4 }}>
          {code.map((ch, i) => {
            const focused = !ch && i === value.length;
            const isError = status === 'error';
            const isFound = status === 'found' || status === 'added';
            return (
              <div key={i} style={{
                width: 42, height: 54, borderRadius: 14,
                background: ch ? '#fff' : 'rgba(255,255,255,0.6)',
                border: `2px solid ${isError ? '#D98AA1' : isFound ? '#7FAF7F' : focused ? '#F2A5BA' : ch ? 'rgba(217,138,161,0.35)' : 'rgba(217,138,161,0.18)'}`,
                boxShadow: focused ? '0 0 0 4px rgba(242,165,186,0.18)' : '0 2px 6px rgba(198,156,132,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fredoka', fontWeight: 700, fontSize: 26, color: 'var(--plush-deep)',
                transition: 'all 0.2s', position: 'relative',
              }}>
                {ch}
                {focused && <div style={{ position:'absolute', bottom:8, width:2, height:24, background:'#F2A5BA', borderRadius:1 }} />}
              </div>
            );
          })}
        </div>
        <input
          ref={inputRef}
          value={value}
          onChange={e => updateChar(e.target.value)}
          maxLength={6}
          autoCapitalize="characters"
          autoComplete="off"
          style={{ position:'absolute', left:-9999, opacity:0, width:1, height:1 }}
        />

        {/* status messages */}
        {status === 'searching' && (
          <div style={{ fontFamily:'Caveat', fontSize:18, color:'var(--ink-soft)' }}>searching gently… 🌸</div>
        )}
        {status === 'error' && (
          <div className="fade-in" style={{ fontFamily:'Caveat', fontSize:17, color:'#D98AA1', textAlign:'center' }}>{errorMsg}</div>
        )}
        {status === 'added' && (
          <div className="fade-in pop-in" style={{ fontFamily:'Caveat', fontSize:18, color:'#7FAF7F', textAlign:'center' }}>
            you're now in {foundProfile?.displayName}'s cozy circle 🧸
          </div>
        )}

        {/* found profile card */}
        {status === 'found' && foundProfile && (
          <div className="fade-in pop-in" style={{
            width: '100%', background: 'linear-gradient(160deg, #FFE6EE 0%, #F3E6F7 100%)',
            borderRadius: 22, padding: '16px 18px',
            boxShadow: 'var(--shadow-card)', border: '1px solid rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 26, flexShrink: 0,
              background: avatarColor[foundProfile.displayName.charCodeAt(0) % avatarColor.length],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Fredoka', fontWeight: 700, fontSize: 22, color: 'var(--plush-deep)',
              boxShadow: '0 2px 8px rgba(198,156,132,0.2)',
            }}>
              {foundProfile.displayName.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily:'Fredoka', fontWeight:600, fontSize:17, color:'var(--ink)' }}>
                {foundProfile.displayName}
              </div>
              <div style={{ fontFamily:'Inter', fontSize:12, color:'var(--ink-soft)' }}>
                @{foundProfile.username}
              </div>
            </div>
            <div style={{ fontFamily:'Fredoka', fontWeight:600, fontSize:11, color:'var(--ink-faint)', letterSpacing:'0.08em' }}>
              {foundProfile.shelfCode}
            </div>
          </div>
        )}

        {/* action buttons */}
        {status === 'found' && (
          <div style={{ width: '100%' }}>
            <PlushButton variant="pink" size="lg" full disabled={adding} onClick={confirmAdd}>
              {adding ? 'adding…' : `add ${foundProfile.displayName} to your cozy circle ♡`}
            </PlushButton>
          </div>
        )}
        {(status === 'idle' || status === 'error') && (
          <div style={{ width: '100%', marginTop: 4 }}>
            <PlushButton variant="pink" size="lg" full disabled={!filled || status === 'searching'} onClick={search}>
              find friend ♡
            </PlushButton>
          </div>
        )}
        {status === 'added' && (
          <div style={{ width: '100%' }}>
            <PlushButton variant="cream" size="lg" full onClick={onBack}>back to circles ♡</PlushButton>
          </div>
        )}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// CIRCLE SEND PLUSHIE SHEET — bottom sheet picker
// ───────────────────────────────────────────────────────────
function CircleSendPlushieSheet({ circleId, circleName, myUid, myDisplayName, theme, onSent, onCancel }) {
  const [step, setStep] = React.useState('pick');
  const [selectedPlushie, setSelectedPlushie] = React.useState(null);
  const [message, setMessage] = React.useState('');
  const [anonymous, setAnonymous] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  const handleSend = async () => {
    if (!selectedPlushie || sending) return;
    setSending(true);
    try {
      await window.firebaseDB.sendToCircleShelf(circleId, {
        plushie: selectedPlushie.id, message: message.trim(),
        fromUid: myUid, displayName: myDisplayName, anonymous,
      });
      onSent();
    } catch (e) { setSending(false); }
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(74,59,54,0.42)', display:'flex', alignItems:'flex-end' }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{
        width:'100%', background:'#fff', borderRadius:'28px 28px 0 0',
        padding:'20px 20px 44px', boxShadow:'0 -8px 32px rgba(74,59,54,0.15)',
        maxHeight:'82vh', overflow:'auto',
      }}>
        <div style={{ width:40, height:4, borderRadius:2, background:'rgba(74,59,54,0.13)', margin:'0 auto 18px' }} />

        {step === 'pick' ? (
          <>
            <div style={{ fontFamily:'Fredoka', fontWeight:700, fontSize:18, color:'var(--ink)', marginBottom:4 }}>pick a plushie 🧸</div>
            <div style={{ fontFamily:'Caveat', fontSize:15, color:'var(--ink-soft)', marginBottom:16 }}>for everyone in {circleName}</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8, marginBottom:18 }}>
              {PLUSHIES.map(p => (
                <button key={p.id} onClick={() => setSelectedPlushie(p)} style={{
                  padding:'10px 6px', borderRadius:14,
                  background: selectedPlushie?.id === p.id ? `${theme.accent}28` : 'rgba(255,255,255,0.7)',
                  border:`2px solid ${selectedPlushie?.id === p.id ? theme.accent : 'rgba(217,138,161,0.15)'}`,
                  cursor:'pointer', textAlign:'center',
                  boxShadow: selectedPlushie?.id === p.id ? `0 4px 12px ${theme.accent}45` : '0 2px 6px rgba(198,156,132,0.1)',
                  transition:'all 0.18s',
                }}>
                  <PlushieCapsule plushie={p} size={36} idle={false} />
                  <div style={{ fontFamily:'Inter', fontSize:9, color:'var(--ink-faint)', marginTop:3 }}>{p.name.split(' ')[0]}</div>
                </button>
              ))}
            </div>
            <PlushButton variant="pink" full size="lg" disabled={!selectedPlushie} onClick={() => setStep('write')}>next ›</PlushButton>
          </>
        ) : (
          <>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <button onClick={() => setStep('pick')} style={{ width:32, height:32, borderRadius:16, background:'rgba(217,138,161,0.12)', border:'none', cursor:'pointer', fontSize:18, color:'var(--plush-deep)' }}>‹</button>
              <div>
                <div style={{ fontFamily:'Fredoka', fontWeight:700, fontSize:17, color:'var(--ink)' }}>add a message</div>
                <div style={{ fontFamily:'Caveat', fontSize:14, color:'var(--ink-soft)' }}>optional · keep it soft</div>
              </div>
              {selectedPlushie && <div style={{ marginLeft:'auto' }}><PlushieCapsule plushie={selectedPlushie} size={38} idle={false} /></div>}
            </div>
            <textarea value={message} onChange={e => setMessage(e.target.value)}
              placeholder="a tiny feeling for everyone here…" maxLength={140}
              style={{ width:'100%', height:100, padding:'12px 14px', background:'#FFF9F5', border:'2px solid rgba(217,138,161,0.22)', borderRadius:16, fontFamily:'Caveat', fontSize:17, color:'var(--ink)', outline:'none', resize:'none', lineHeight:1.5, marginBottom:6 }} />
            <div style={{ fontFamily:'Inter', fontSize:11, color:'var(--ink-faint)', textAlign:'right', marginBottom:12 }}>{message.length}/140</div>

            {/* anonymous toggle */}
            <button onClick={() => setAnonymous(a => !a)} style={{
              width:'100%', padding:'11px 14px', marginBottom:14,
              background: anonymous ? 'rgba(200,184,232,0.18)' : 'rgba(255,255,255,0.65)',
              border:`2px solid ${anonymous ? '#C8B8E8' : 'rgba(74,59,54,0.1)'}`,
              borderRadius:14, cursor:'pointer', display:'flex', alignItems:'center', gap:10,
            }}>
              <span style={{ fontSize:18 }}>{anonymous ? '🎭' : '🧸'}</span>
              <div style={{ flex:1, textAlign:'left' }}>
                <div style={{ fontFamily:'Fredoka', fontWeight:600, fontSize:14, color:'var(--ink)' }}>
                  {anonymous ? 'anonymous mode on' : 'show your name'}
                </div>
                <div style={{ fontFamily:'Inter', fontSize:11, color:'var(--ink-soft)' }}>
                  {anonymous ? `"someone in ${circleName} 💌"` : `shows as "${myDisplayName}"`}
                </div>
              </div>
              <div style={{ width:36, height:20, borderRadius:10, background: anonymous ? '#C8B8E8' : 'rgba(74,59,54,0.12)', position:'relative', transition:'background 0.2s' }}>
                <div style={{ position:'absolute', top:2, width:16, height:16, borderRadius:8, background:'#fff', left: anonymous ? 18 : 2, transition:'left 0.2s', boxShadow:'0 1px 3px rgba(74,59,54,0.2)' }} />
              </div>
            </button>

            <PlushButton variant="pink" full size="lg" disabled={sending} onClick={handleSend}>
              {sending ? 'leaving it on the shelf…' : 'leave on shared shelf 🧸'}
            </PlushButton>
          </>
        )}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// CIRCLE ROOM — the shared plushie world
// ───────────────────────────────────────────────────────────
function CircleRoomScreen({ circleId, myUid, myProfile, onBack }) {
  const { circle, shelf, notes, react, leaveNote } = useCircleRoom(circleId, myUid);
  const [activeTab, setActiveTab] = React.useState('shelf');
  const [showSend, setShowSend] = React.useState(false);
  const [showNote, setShowNote] = React.useState(false);
  const [noteText, setNoteText] = React.useState('');
  const [sendingNote, setSendingNote] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopyInvite = async () => {
    try { await navigator.clipboard.writeText(circle.inviteCode); } catch (e) {}
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  const handleSubmitNote = async () => {
    if (!noteText.trim() || sendingNote) return;
    setSendingNote(true);
    try { await leaveNote(noteText.trim()); setNoteText(''); setShowNote(false); }
    catch (e) {}
    setSendingNote(false);
  };

  if (circle === undefined) return (
    <div style={{ padding:'0 0 120px', minHeight:'100%' }}>
      <TopBar title="loading…" left={<RoundBtn onClick={onBack}>‹</RoundBtn>} />
      <div style={{ textAlign:'center', padding:52, fontFamily:'Caveat', fontSize:18, color:'var(--ink-soft)' }}>stepping inside… 🌸</div>
    </div>
  );
  if (!circle) return (
    <div style={{ padding:'0 0 120px', minHeight:'100%' }}>
      <TopBar title="circle not found" left={<RoundBtn onClick={onBack}>‹</RoundBtn>} />
    </div>
  );

  const t = CIRCLE_THEMES[circle.theme] || CIRCLE_THEMES.rose;
  const memberCount = (circle.memberUids || []).length;
  const avatarColors = ['#FFE6EE','#F3E6F7','#FFD6C2','#E8D9CF','#C7DDB7'];
  const nightMode = circle.theme === 'night';

  return (
    <div style={{ padding:'0 0 120px', minHeight:'100%', background: nightMode ? '#1A1230' : 'transparent', transition:'background 0.4s' }}>
      <TopBar
        title={circle.name}
        subtitle={`${memberCount} ${memberCount === 1 ? 'keeper' : 'keepers'} inside`}
        left={<RoundBtn onClick={onBack}>‹</RoundBtn>}
        right={<RoundBtn onClick={handleCopyInvite} title="copy invite code">{copied ? '✓' : '🔗'}</RoundBtn>}
      />

      {/* Room header card */}
      <div style={{ padding:'4px 16px 14px' }}>
        <div style={{ borderRadius:24, padding:'16px 18px', background: t.bg, boxShadow:'var(--shadow-card)', border:'1px solid rgba(255,255,255,0.7)', position:'relative', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:56, height:56, borderRadius:28, flexShrink:0, background:'#fff', fontSize:30, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 14px ${t.accent}55` }}>{t.emoji}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:'Fredoka', fontWeight:700, fontSize:18, color: nightMode ? t.text : 'var(--ink)' }}>{circle.name}</div>
              <div style={{ display:'flex', alignItems:'center', marginTop:6, gap:5 }}>
                <div style={{ display:'flex' }}>
                  {(circle.memberUids || []).slice(0, 5).map((uid, i) => (
                    <div key={uid} style={{
                      width:22, height:22, borderRadius:11,
                      background: uid === myUid ? t.accent : avatarColors[i % 5],
                      border:'2px solid #fff', marginLeft: i ? -7 : 0,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:10, fontFamily:'Fredoka', fontWeight:700, color: uid === myUid ? '#fff' : t.text,
                      boxShadow:'0 1px 3px rgba(74,59,54,0.12)',
                    }}>{uid === myUid ? '✿' : '·'}</div>
                  ))}
                  {memberCount > 5 && (
                    <div style={{ width:22, height:22, borderRadius:11, background:'rgba(255,255,255,0.7)', border:'2px solid #fff', marginLeft:-7, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter', fontSize:9, color:'var(--ink-soft)' }}>+{memberCount-5}</div>
                  )}
                </div>
                <span style={{ fontFamily:'Inter', fontSize:11, color: nightMode ? t.text : 'var(--ink-soft)' }}>{memberCount} keeper{memberCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          {/* invite strip */}
          <div style={{ marginTop:12, padding:'8px 12px', background:'rgba(255,255,255,0.55)', borderRadius:12, display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontFamily:'Inter', fontSize:11, color:'var(--ink-soft)', flex:1 }}>invite code</span>
            <span style={{ fontFamily:'Fredoka', fontWeight:700, fontSize:16, color: t.text, letterSpacing:'0.14em' }}>{circle.inviteCode}</span>
            <button onClick={handleCopyInvite} style={{ padding:'3px 10px', borderRadius:8, background: t.accent, border:'none', cursor:'pointer', fontFamily:'Fredoka', fontWeight:600, fontSize:12, color:'#fff' }}>
              {copied ? '✓' : 'copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Tab selector */}
      <div style={{ padding:'0 16px 14px', display:'flex', gap:8 }}>
        {[['shelf','🧸','shared shelf'],['notes','💌','notes board']].map(([tab, emoji, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex:1, padding:'10px 8px',
            background: activeTab === tab ? t.accent : 'rgba(255,255,255,0.62)',
            border:`1.5px solid ${activeTab === tab ? t.accent : 'rgba(255,255,255,0.45)'}`,
            borderRadius:16, cursor:'pointer',
            fontFamily:'Fredoka', fontWeight:600, fontSize:14,
            color: activeTab === tab ? '#fff' : (nightMode ? t.text : 'var(--ink-soft)'),
            transition:'all 0.2s',
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          }}>
            <span>{emoji}</span> {label}
          </button>
        ))}
      </div>

      {/* SHELF TAB */}
      {activeTab === 'shelf' && (
        <div style={{ padding:'0 16px' }}>
          <button onClick={() => setShowSend(true)} style={{
            width:'100%', marginBottom:14, padding:'13px 16px',
            background:'linear-gradient(160deg,#F2A5BA 0%,#D98AA1 100%)',
            border:'none', borderRadius:18, cursor:'pointer',
            color:'#fff', fontFamily:'Fredoka', fontWeight:600, fontSize:15,
            boxShadow:'0 6px 16px rgba(217,138,161,0.35)',
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          }}>
            <span>🧸</span> leave a plushie
          </button>
          {shelf.length === 0 ? (
            <div style={{ background:'rgba(255,255,255,0.45)', border:'2px dashed rgba(74,59,54,0.1)', borderRadius:22, padding:'34px 20px', textAlign:'center' }}>
              <div style={{ fontSize:34, marginBottom:8 }}>🌱</div>
              <div style={{ fontFamily:'Caveat', fontSize:17, color: nightMode ? t.text : 'var(--ink-soft)' }}>the shelf is empty · be the first to leave something</div>
            </div>
          ) : (
            <div style={{
              background:'linear-gradient(180deg,#FFF6F0 0%,#FBEAF0 100%)',
              borderRadius:22, padding:14,
              border:'1px solid rgba(255,255,255,0.7)',
              boxShadow:'inset 0 2px 6px rgba(198,156,132,0.1), var(--shadow-card)',
              backgroundImage:'radial-gradient(circle at 10px 10px, rgba(217,138,161,0.1) 1.5px, transparent 2px)',
              backgroundSize:'18px 18px',
            }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10 }}>
                {shelf.map((item, i) => {
                  const p = PLUSHIE_BY_ID[item.plushie];
                  if (!p) return null;
                  const tilt = [-3,2,-1,3,-2,1][i % 6];
                  const senderLabel = item.anonymous ? `someone in ${circle.name} 💌` : (item.senderName || 'someone');
                  return (
                    <div key={item.id} style={{
                      background:'#fff', borderRadius:16, padding:'10px 8px 8px',
                      border:'1px solid rgba(255,255,255,0.7)',
                      boxShadow:'0 4px 10px rgba(198,156,132,0.15)',
                      transform:`rotate(${tilt}deg)`, position:'relative', textAlign:'center',
                    }}>
                      <Tape width={28} rotate={tilt * -3} style={{ position:'absolute', top:-8, left:'50%', marginLeft:-14 }} />
                      <PlushieCapsule plushie={p} size={40} idle={false} />
                      <div style={{ fontFamily:'Caveat', fontSize:11, color:'var(--ink-soft)', marginTop:3, lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{senderLabel}</div>
                      {item.message ? (
                        <div style={{ fontFamily:'Caveat', fontSize:10, color:'var(--ink-faint)', marginTop:2, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{item.message}</div>
                      ) : null}
                      {/* reactions */}
                      <div style={{ display:'flex', justifyContent:'center', gap:2, marginTop:5, flexWrap:'wrap' }}>
                        {['🩷','✨','🥺'].map(emoji => {
                          const uids = item.reactions?.[emoji] || [];
                          const active = uids.includes(myUid);
                          return (
                            <button key={emoji} onClick={() => react(item.id, emoji)} style={{
                              padding:'1px 5px', borderRadius:8,
                              background: active ? `${t.accent}38` : 'rgba(255,255,255,0.7)',
                              border:`1px solid ${active ? t.accent : 'rgba(217,138,161,0.2)'}`,
                              cursor:'pointer', fontSize:10,
                            }}>
                              {emoji}{uids.length > 0 ? ` ${uids.length}` : ''}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* NOTES TAB */}
      {activeTab === 'notes' && (
        <div style={{ padding:'0 16px' }}>
          <button onClick={() => setShowNote(true)} style={{
            width:'100%', marginBottom:14, padding:'13px 16px',
            background:'linear-gradient(160deg,#C8B8E8 0%,#A89CC8 100%)',
            border:'none', borderRadius:18, cursor:'pointer',
            color:'#fff', fontFamily:'Fredoka', fontWeight:600, fontSize:15,
            boxShadow:'0 6px 16px rgba(168,130,214,0.3)',
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          }}>
            <span>💌</span> leave an anonymous note
          </button>
          {notes.length === 0 ? (
            <div style={{ background:'rgba(255,255,255,0.45)', border:'2px dashed rgba(74,59,54,0.1)', borderRadius:22, padding:'34px 20px', textAlign:'center' }}>
              <div style={{ fontSize:34, marginBottom:8 }}>🕊️</div>
              <div style={{ fontFamily:'Caveat', fontSize:17, color: nightMode ? t.text : 'var(--ink-soft)' }}>no notes yet · leave something soft</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {notes.map((note, i) => {
                const tilt = [-1.5,1,-0.5,1.5,-1,0.5][i % 6];
                return (
                  <div key={note.id} style={{ background:'#fff', borderRadius:18, padding:'16px 16px 12px', border:'1px solid rgba(255,255,255,0.8)', boxShadow:'0 4px 12px rgba(198,156,132,0.14)', transform:`rotate(${tilt}deg)`, position:'relative' }}>
                    <Tape width={24} rotate={tilt * -2} style={{ position:'absolute', top:-7, left:'50%', marginLeft:-12 }} />
                    <div style={{ fontFamily:'Caveat', fontSize:17, color:'var(--ink)', lineHeight:1.45 }}>{note.text}</div>
                    <div style={{ fontFamily:'Inter', fontSize:10, color:'var(--ink-faint)', marginTop:7 }}>someone in {circle.name} 💌</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Send plushie bottom sheet */}
      {showSend && (
        <CircleSendPlushieSheet
          circleId={circleId} circleName={circle.name}
          myUid={myUid} myDisplayName={myProfile?.displayName || 'someone'}
          theme={t} onSent={() => setShowSend(false)} onCancel={() => setShowSend(false)}
        />
      )}

      {/* Leave note bottom sheet */}
      {showNote && (
        <div style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(74,59,54,0.42)', display:'flex', alignItems:'flex-end' }} onClick={() => setShowNote(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width:'100%', background:'#fff', borderRadius:'28px 28px 0 0', padding:'24px 20px 44px', boxShadow:'0 -8px 32px rgba(74,59,54,0.15)' }}>
            <div style={{ width:40, height:4, borderRadius:2, background:'rgba(74,59,54,0.13)', margin:'0 auto 20px' }} />
            <div style={{ fontFamily:'Fredoka', fontWeight:700, fontSize:18, color:'var(--ink)', marginBottom:4 }}>leave a note 💌</div>
            <div style={{ fontFamily:'Caveat', fontSize:15, color:'var(--ink-soft)', marginBottom:14 }}>anonymous · only people in {circle.name} can read this</div>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
              placeholder="thinking of you all softly…" maxLength={200} autoFocus
              style={{ width:'100%', height:120, padding:'12px 14px', background:'#FFF9F5', border:'2px solid rgba(200,184,232,0.35)', borderRadius:16, fontFamily:'Caveat', fontSize:17, color:'var(--ink)', outline:'none', resize:'none', lineHeight:1.5 }} />
            <div style={{ fontFamily:'Inter', fontSize:11, color:'var(--ink-faint)', textAlign:'right', marginBottom:14 }}>{noteText.length}/200</div>
            <PlushButton variant="lav" full size="lg" disabled={!noteText.trim() || sendingNote} onClick={handleSubmitNote}>
              {sendingNote ? 'leaving it softly…' : 'leave this note 💌'}
            </PlushButton>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LEGACY placeholder — kept so old screen=circle refs compile ───────────
function CircleScreen({ circle, onBack, onLeavePlushie, onOpenWallItem }) {
  if (!circle) return null;
  return (
    <div style={{ padding: '0 0 120px', minHeight: '100%' }}>
      <TopBar
        title={circle.name}
        subtitle={`${circle.members.length} keepers · code ${circle.code}`}
        left={<RoundBtn onClick={onBack}>‹</RoundBtn>}
        right={<RoundBtn>⋯</RoundBtn>}
      />
      {/* circle hero */}
      <div style={{ padding: '4px 20px 14px' }}>
        <div style={{
          background: circle.tint, borderRadius: 26, padding: '16px 18px',
          boxShadow: 'var(--shadow-card)', border: '1px solid rgba(255,255,255,0.7)',
          position: 'relative', overflow: 'hidden',
        }}>
          <Sticker emoji="✨" size={14} rotate={-12} style={{ position:'absolute', top: 10, right: 14 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 28,
              background: '#fff', fontSize: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(198, 156, 132, 0.20)',
            }}>{circle.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Caveat', fontSize: 17, color: 'var(--ink-soft)' }}>
                {circle.tagline}
              </div>
              {/* members row */}
              <div style={{ display: 'flex', marginTop: 6 }}>
                {circle.members.map((m, i) => (
                  <div key={i} title={m.name} style={{
                    width: 26, height: 26, borderRadius: 13,
                    background: ['#FFE6EE','#F3E6F7','#FFD6C2','#E8D9CF','#C7DDB7'][i % 5],
                    border: '2px solid #fff',
                    marginLeft: i ? -8 : 0, fontSize: 13,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 1px 3px rgba(74,59,54,0.15)',
                  }}>{m.emoji}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* shared wall */}
      <div style={{ padding: '0 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 6px 8px',
        }}>
          <div style={{
            fontFamily: 'Fredoka', fontWeight: 600, fontSize: 13,
            color: 'var(--ink-soft)', letterSpacing: '0.04em',
          }}>♡ shared shelf</div>
          <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--ink-faint)' }}>
            tap to open · tap + to leave one
          </div>
        </div>

        {/* grid wall — like a corkboard */}
        <div style={{
          background: 'linear-gradient(180deg, #FFF6F0 0%, #FBEAF0 100%)',
          borderRadius: 22, padding: 14,
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow: 'inset 0 2px 6px rgba(198,156,132,0.12), var(--shadow-card)',
          backgroundImage: 'radial-gradient(circle at 12px 12px, rgba(217, 138, 161, 0.12) 1.5px, transparent 2px)',
          backgroundSize: '20px 20px',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
          }}>
            {circle.wall.map((w, i) => {
              const p = PLUSHIE_BY_ID[w.plushie];
              const tilt = [-3, 2, -1, 3, -2, 1][i % 6];
              return (
                <div key={w.id} onClick={() => onOpenWallItem(w)} style={{
                  background: '#fff', borderRadius: 16, padding: '10px 8px 8px',
                  border: '1px solid rgba(255,255,255,0.7)',
                  boxShadow: '0 4px 10px rgba(198,156,132,0.18)',
                  transform: `rotate(${tilt}deg)`,
                  cursor: 'pointer', position: 'relative',
                  textAlign: 'center',
                }}>
                  <Tape width={28} rotate={tilt * -3} style={{ position: 'absolute', top: -8, left: '50%', marginLeft: -14 }} />
                  <PlushieCapsule plushie={p} size={42} idle={false} />
                  <div style={{
                    fontFamily: 'Caveat', fontSize: 13, color: 'var(--ink-soft)',
                    marginTop: 2, lineHeight: 1.1,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>from {w.from}</div>
                  <div style={{
                    fontFamily: 'Inter', fontSize: 10, color: 'var(--ink-faint)',
                  }}>{w.when}</div>
                </div>
              );
            })}
            {/* leave-one tile */}
            <button onClick={onLeavePlushie} style={{
              background: 'rgba(255,255,255,0.4)',
              border: '2px dashed rgba(217, 138, 161, 0.4)',
              borderRadius: 16, padding: '10px 8px 8px',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 90,
              fontFamily: 'Fredoka', fontWeight: 600, fontSize: 13,
              color: 'var(--plush-deep)',
            }}>
              <span style={{ fontSize: 22, marginBottom: 4 }}>＋</span>
              leave one
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// GIFT ARCADE — what the RECIPIENT sees when they open a gift link.
// A focused, single-plushie mini claw machine. One tap to catch.
// After catching, the envelope opens.
// ───────────────────────────────────────────────────────────
function GiftArcadeScreen({ gift, onKept }) {
  const [phase, setPhase] = React.useState('intro');   // intro · machine · dropping · caught · letter
  const [clawY, setClawY] = React.useState(28);
  const p = PLUSHIE_BY_ID[gift.plushie];
  const TOY_Y = 210;

  const drop = () => {
    if (phase !== 'machine') return;
    setPhase('dropping');
    setClawY(TOY_Y);
    setTimeout(() => {
      setPhase('caught');
      setClawY(28);
      setTimeout(() => setPhase('letter'), 1400);
    }, 1100);
  };

  // intro screen — “someone left you a plushie!”
  if (phase === 'intro') {
    return (
      <div className="fade-in" style={{
        padding: '0 0 60px', minHeight: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', position: 'relative',
      }}>
        {/* floating bg sparkles */}
        <Sticker emoji="✨" size={24} rotate={-12} style={{ position: 'absolute', top: 80, left: 30 }} />
        <Sticker emoji="🎀" size={22} rotate={20} style={{ position: 'absolute', top: 120, right: 40 }} />
        <Sticker emoji="♡" size={20} rotate={-20} style={{ position: 'absolute', bottom: 120, left: 50, color: '#F2A5BA' }} />
        <Sticker emoji="✿" size={22} rotate={10} style={{ position: 'absolute', bottom: 160, right: 30 }} />

        <div style={{ padding: '60px 24px 0' }}>
          <div style={{ fontFamily: 'Caveat', fontSize: 22, color: 'var(--ink-soft)' }}>
            {gift.from || 'a soft stranger'} left
          </div>
          <Title size={36} style={{ marginTop: 4, marginBottom: 6 }}>
            you a plushie ♡
          </Title>
          <div style={{ fontFamily: 'Caveat', fontSize: 20, color: 'var(--plush-deep)' }}>
            ✿ catch it carefully ✿
          </div>
        </div>

        {/* preview machine */}
        <div className="float-soft" style={{
          marginTop: 24, position: 'relative',
        }}>
          <div style={{
            width: 200, height: 220,
            background: 'linear-gradient(180deg, rgba(248, 221, 227, 0.65) 0%, rgba(255, 249, 245, 0.95) 100%)',
            borderRadius: '32px 32px 18px 18px',
            border: '4px solid #fff',
            boxShadow: '0 16px 36px rgba(217, 138, 161, 0.35), inset 0 8px 20px rgba(255,255,255,0.5)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* sign */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              background: 'linear-gradient(180deg, #F2A5BA 0%, #D98AA1 100%)',
              padding: '8px 0', textAlign: 'center',
              fontFamily: 'Fredoka', fontWeight: 700, fontSize: 13, color: '#fff',
              letterSpacing: '0.04em', textShadow: '0 1px 0 rgba(0,0,0,0.15)',
            }}>♡ for you ♡</div>
            {/* claw silhouette */}
            <div style={{ position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)', width: 1, height: 70, background: 'rgba(74,59,54,0.3)' }} />
            <div style={{ position: 'absolute', top: 110, left: '50%', transform: 'translateX(-50%)', fontSize: 18 }}>⚙</div>
            {/* the plushie waiting inside */}
            <div style={{
              position: 'absolute', bottom: 30, left: '50%',
              transform: 'translateX(-50%)',
            }}>
              <PlushieCapsule plushie={p} size={84} idle glow />
            </div>
            {/* glass reflection */}
            <div style={{ position: 'absolute', top: 28, left: 12, bottom: 24, width: 6,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1))', borderRadius: 2 }} />
          </div>
        </div>

        <div style={{ padding: '30px 24px 0', width: '100%', maxWidth: 360, boxSizing: 'border-box' }}>
          <PlushButton variant="pink" size="lg" full onClick={() => setPhase('machine')}>
            tap to play ♡
          </PlushButton>
          <div style={{
            textAlign: 'center', marginTop: 8,
            fontFamily: 'Caveat', fontSize: 15, color: 'var(--ink-faint)',
          }}>just one tap · one tiny catch</div>
        </div>
      </div>
    );
  }

  // letter reveal
  if (phase === 'letter') {
    return (
      <div className="fade-in" style={{
        padding: '0 24px 80px', minHeight: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{ padding: '40px 0 14px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Caveat', fontSize: 24, color: 'var(--plush-deep)' }}>caught it ♡</div>
          <Title size={26} style={{ marginTop: 4 }}>{p.name}</Title>
        </div>
        <PlushieCapsule plushie={p} size={120} idle glow />

        {/* letter */}
        <div style={{
          width: '100%', maxWidth: 340, marginTop: 20,
          animation: 'letter-rise 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        }}>
          <div style={{
            background: 'linear-gradient(180deg, #FFF9F5 0%, #FFF4ED 100%)',
            borderRadius: 18, padding: '20px 22px 22px',
            border: '1px solid rgba(74,59,54,0.08)',
            boxShadow: '0 10px 26px rgba(198, 156, 132, 0.22)',
            position: 'relative',
            backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 30px, rgba(248, 221, 227, 0.35) 30px 31px)',
          }}>
            <Tape width={50} color="rgba(200, 182, 226, 0.7)" rotate={-12} style={{ position: 'absolute', top: -10, left: 14 }} />
            <Tape width={50} color="rgba(255, 214, 194, 0.8)" rotate={8} style={{ position: 'absolute', top: -10, right: 14 }} />
            <div style={{ fontFamily: 'Caveat', fontSize: 18, color: 'var(--ink-soft)', marginBottom: 8 }}>
              dear you,
            </div>
            <div style={{
              fontFamily: 'Fredoka', fontWeight: 400, fontSize: 16,
              color: 'var(--ink)', lineHeight: 1.7, textWrap: 'pretty',
              minHeight: 60,
            }}>
              {gift.message || '(a quiet plushie · no words today)'}
            </div>
            <div style={{
              marginTop: 14, textAlign: 'right',
              fontFamily: 'Caveat', fontSize: 20, color: 'var(--plush-deep)',
            }}>— {gift.from || 'a soft stranger'}</div>
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: 340, marginTop: 20 }}>
          <PlushButton variant="pink" size="lg" full onClick={onKept}>
            keep it on my shelf ♡
          </PlushButton>
          <div style={{
            textAlign: 'center', marginTop: 10,
            fontFamily: 'Caveat', fontSize: 15, color: 'var(--ink-faint)',
          }}>✿ make a shelf of your own ✿</div>
        </div>
      </div>
    );
  }

  // machine view — single plushie inside the cabinet
  return (
    <div style={{ padding: '0 0 60px', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ padding: '24px 24px 0', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Caveat', fontSize: 18, color: 'var(--ink-soft)' }}>
          from {gift.from || 'a soft stranger'}
        </div>
        <Title size={22} style={{ marginTop: 2 }}>
          {phase === 'caught' ? 'lifting…' : 'tap drop to catch ♡'}
        </Title>
      </div>

      {/* cabinet */}
      <div style={{ marginTop: 18, width: 280, position: 'relative' }}>
        {/* sign */}
        <div style={{
          background: 'linear-gradient(180deg, #F2A5BA 0%, #D98AA1 100%)',
          borderRadius: '22px 22px 8px 8px',
          padding: '10px 14px 12px',
          border: '3px solid #fff',
          boxShadow: '0 6px 16px rgba(217, 138, 161, 0.35), inset 0 1px 0 rgba(255,255,255,0.6)',
          textAlign: 'center', position: 'relative',
        }}>
          <Sticker emoji="🎀" size={18} rotate={-18} style={{ position:'absolute', top: -6, left: -2 }} />
          <Sticker emoji="✨" size={14} rotate={20} style={{ position:'absolute', top: -4, right: 8 }} />
          <div style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '0.04em', textShadow: '0 1px 0 rgba(0,0,0,0.1)' }}>
            ♡ a gift for you ♡
          </div>
          <div style={{ fontFamily: 'Caveat', fontSize: 14, color: 'rgba(255,255,255,0.95)', lineHeight: 1 }}>
            one tap · one tiny feeling
          </div>
        </div>

        {/* glass */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(248, 221, 227, 0.55) 0%, rgba(255, 249, 245, 0.85) 100%)',
          border: '4px solid #fff', borderTop: 'none',
          height: 300, position: 'relative', overflow: 'hidden',
          boxShadow: 'inset 0 8px 20px rgba(255,255,255,0.5), inset 0 -10px 30px rgba(198, 156, 132, 0.18), 0 12px 30px rgba(198, 156, 132, 0.22)',
        }}>
          {/* rail */}
          <div style={{ position: 'absolute', top: 14, left: 6, right: 6, height: 4,
            background: 'linear-gradient(180deg, #BDA3A3 0%, #8E7373 100%)', borderRadius: 2 }} />

          {/* claw */}
          <div style={{
            position: 'absolute', left: '50%', top: 18, transform: 'translateX(-50%)', width: 60,
            transformOrigin: 'top center',
            animation: phase === 'machine' ? 'sway-claw 2.4s ease-in-out infinite' : 'none',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 29, width: 2, height: clawY,
              background: 'linear-gradient(180deg, #8E7373, #6E5959)',
              transition: 'height 1.1s cubic-bezier(0.5, 0, 0.4, 1)',
            }} />
            <div style={{
              position: 'absolute', top: clawY, left: 0, width: 60, height: 50,
              transition: 'top 1.1s cubic-bezier(0.5, 0, 0.4, 1)',
            }}>
              <div style={{
                width: 32, height: 18, margin: '0 auto', borderRadius: '6px 6px 8px 8px',
                background: 'linear-gradient(180deg, #E5C9C9 0%, #B58B8B 100%)',
                border: '1.5px solid #fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
              }} />
              <div style={{
                position: 'absolute', top: 14, left: 12,
                width: 0, height: 0,
                borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
                borderTop: `${phase === 'caught' ? 22 : 28}px solid #B58B8B`,
                transform: `rotate(${phase === 'caught' ? '14deg' : '-2deg'})`,
                transformOrigin: 'top',
                transition: 'all 0.4s',
              }} />
              <div style={{
                position: 'absolute', top: 14, right: 12,
                width: 0, height: 0,
                borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
                borderTop: `${phase === 'caught' ? 22 : 28}px solid #B58B8B`,
                transform: `rotate(${phase === 'caught' ? '-14deg' : '2deg'})`,
                transformOrigin: 'top',
                transition: 'all 0.4s',
              }} />
              {phase === 'caught' && (
                <div style={{ position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)' }}>
                  <PlushieCapsule plushie={p} size={50} idle={false} glow />
                </div>
              )}
            </div>
          </div>

          {/* plushie on the floor */}
          {phase !== 'caught' && (
            <div style={{
              position: 'absolute', left: '50%', top: TOY_Y,
              transform: 'translateX(-50%)',
              transition: 'opacity 0.2s',
              opacity: phase === 'dropping' ? 0.7 : 1,
            }}>
              <PlushieCapsule plushie={p} size={64} idle={phase === 'machine'} glow={phase === 'machine'} />
            </div>
          )}

          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 36,
            background: 'linear-gradient(180deg, rgba(248, 221, 227, 0.4) 0%, rgba(242, 196, 208, 0.6) 100%)',
            borderTop: '1px dashed rgba(74,59,54,0.15)',
          }} />
        </div>

        {/* drop button */}
        <div style={{
          background: 'linear-gradient(180deg, #E8D9CF 0%, #D9C2B0 100%)',
          border: '3px solid #fff', borderTop: 'none',
          borderRadius: '0 0 22px 22px',
          padding: '14px',
          boxShadow: '0 8px 16px rgba(198, 156, 132, 0.25)',
        }}>
          <button onClick={drop} disabled={phase !== 'machine'} style={{
            width: '100%', height: 52, borderRadius: 26,
            border: '2px solid #fff',
            background: phase === 'machine'
              ? 'linear-gradient(160deg, #F2A5BA 0%, #D98AA1 100%)'
              : 'linear-gradient(160deg, #D9C2B0 0%, #BFA391 100%)',
            color: '#fff', fontFamily: 'Fredoka', fontWeight: 700, fontSize: 16,
            letterSpacing: '0.04em',
            boxShadow: phase === 'machine'
              ? '0 4px 0 #B07385, 0 8px 14px rgba(217,138,161,0.4), inset 0 1px 0 rgba(255,255,255,0.6)'
              : 'none',
            cursor: phase === 'machine' ? 'pointer' : 'not-allowed',
          }}>{phase === 'machine' ? 'DROP ♡' : '…'}</button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// SETUP ACCOUNT
// ───────────────────────────────────────────────────────────
function SetupAccountScreen({ user, onComplete }) {
  const [displayName, setDisplayName] = React.useState(user?.displayName || '');
  const [username, setUsername] = React.useState('');
  const [usernameError, setUsernameError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');

  const validateUsername = (u) => {
    if (u.length < 3) return 'at least 3 characters';
    if (u.length > 24) return 'max 24 characters';
    if (!/^[a-z0-9_-]+$/.test(u)) return 'lowercase letters, numbers, - and _ only';
    return '';
  };

  const handleUsernameChange = (v) => {
    const clean = v.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setUsername(clean);
    setUsernameError(clean.length > 0 ? validateUsername(clean) : '');
    setSubmitError('');
  };

  const handleSubmit = async () => {
    const err = validateUsername(username);
    if (err) { setUsernameError(err); return; }
    if (!displayName.trim()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const available = await window.firebaseDB.isUsernameAvailable(username);
      if (!available) { setUsernameError('this username is taken · try another'); setSubmitting(false); return; }
      await onComplete({ displayName: displayName.trim(), username });
    } catch (e) {
      setSubmitError(e.message || 'something went soft · try again');
      setSubmitting(false);
    }
  };

  const inputStyle = (hasError) => ({
    width: '100%', boxSizing: 'border-box',
    border: `2px solid ${hasError ? '#D98AA1' : 'rgba(217,138,161,0.3)'}`,
    borderRadius: 16, padding: '13px 16px',
    fontFamily: 'Fredoka', fontWeight: 500, fontSize: 16, color: 'var(--ink)',
    background: '#fff', outline: 'none', transition: 'border-color 0.2s',
  });

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100dvh', padding: '40px 24px', gap: 24,
      background: 'radial-gradient(circle at 30% 20%, #FCE9EE 0%, transparent 50%), radial-gradient(circle at 70% 80%, #F3E6F7 0%, transparent 50%), #FFF4EE',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 10 }}>🧸</div>
        <div style={{ fontFamily: 'var(--font-heading, Fredoka)', fontSize: 28, fontWeight: 700, color: 'var(--ink, #4A3B36)' }}>
          set up your shelf
        </div>
        <div style={{ fontFamily: 'Caveat, cursive', fontSize: 18, color: 'var(--ink-soft, #7B675F)', marginTop: 4 }}>
          choose a username · make it yours ♡
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* display name */}
        <div>
          <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6, paddingLeft: 4 }}>
            display name
          </div>
          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value.slice(0, 40))}
            placeholder="your name"
            style={inputStyle(false)}
          />
        </div>

        {/* username */}
        <div>
          <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 13, color: 'var(--ink-soft)', marginBottom: 6, paddingLeft: 4 }}>
            username
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              fontFamily: 'Fredoka', fontWeight: 600, fontSize: 16, color: 'var(--ink-faint)',
              pointerEvents: 'none',
            }}>@</div>
            <input
              value={username}
              onChange={e => handleUsernameChange(e.target.value)}
              placeholder="jisforjinpatcha"
              style={{ ...inputStyle(!!usernameError), paddingLeft: 32 }}
            />
          </div>
          {usernameError ? (
            <div style={{ fontFamily: 'Caveat', fontSize: 14, color: '#D98AA1', marginTop: 4, paddingLeft: 4 }}>{usernameError}</div>
          ) : username.length >= 3 ? (
            <div style={{ fontFamily: 'Caveat', fontSize: 14, color: '#7FAF7F', marginTop: 4, paddingLeft: 4 }}>looks good ♡</div>
          ) : (
            <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--ink-faint)', marginTop: 4, paddingLeft: 4 }}>
              3–24 chars · lowercase · letters, numbers, - _
            </div>
          )}
        </div>

        {submitError && (
          <div style={{ fontFamily: 'Caveat', fontSize: 15, color: '#D98AA1', textAlign: 'center' }}>{submitError}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting || !username || !!usernameError || !displayName.trim()}
          style={{
            marginTop: 4, height: 52, borderRadius: 100,
            background: 'linear-gradient(160deg, #F2A5BA 0%, #D98AA1 100%)',
            border: 'none', color: '#fff',
            fontFamily: 'Fredoka', fontWeight: 700, fontSize: 17,
            cursor: submitting ? 'wait' : 'pointer',
            boxShadow: '0 6px 16px rgba(217,138,161,0.4)',
            opacity: (!username || !!usernameError || !displayName.trim()) ? 0.55 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {submitting ? 'creating your shelf…' : 'create my shelf ♡'}
        </button>
      </div>

      <div style={{ fontFamily: 'Caveat, cursive', fontSize: 14, color: '#B49E94', textAlign: 'center', maxWidth: 280 }}>
        your shelf code is generated automatically · share it with friends ♡
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// LOGIN SCREEN
// ───────────────────────────────────────────────────────────
function LoginScreen({ onSignIn }) {
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState(null);

  const handle = async () => {
    setBusy(true);
    setErr(null);
    try {
      await onSignIn();
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') {
        setErr('something went soft · try again?');
      }
      setBusy(false);
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100dvh', padding: '40px 24px',
      gap: 28, textAlign: 'center',
      background: 'radial-gradient(circle at 30% 20%, #FCE9EE 0%, transparent 50%), radial-gradient(circle at 70% 80%, #F3E6F7 0%, transparent 50%), #FFF4EE',
    }}>
      <div style={{ fontSize: 80 }}>🧸</div>

      <div>
        <div style={{ fontFamily: 'var(--font-heading, Fredoka)', fontSize: 36, fontWeight: 700, color: 'var(--ink, #4A3B36)', marginBottom: 6 }}>
          dear plushie
        </div>
        <div style={{ fontFamily: 'Caveat, cursive', fontSize: 20, color: 'var(--ink-soft, #7B675F)' }}>
          a tiny feeling, kept just for you ♡
        </div>
      </div>

      <button
        onClick={handle}
        disabled={busy}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#fff', border: '1.5px solid #E8D9CF',
          borderRadius: 100, padding: '13px 26px',
          fontFamily: 'var(--font-body, Inter)', fontSize: 15, fontWeight: 500,
          color: '#4A3B36', cursor: busy ? 'wait' : 'pointer',
          boxShadow: '0 4px 16px rgba(198,156,132,0.18)',
          opacity: busy ? 0.7 : 1, transition: 'opacity 0.2s',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
        </svg>
        {busy ? 'signing in…' : 'sign in with Google'}
      </button>

      {err && (
        <div style={{ fontFamily: 'var(--font-body, Inter)', fontSize: 13, color: '#7B675F' }}>{err}</div>
      )}

      <div style={{ fontFamily: 'Caveat, cursive', fontSize: 15, color: '#B49E94' }}>
        your shelf · your inbox · kept safely
      </div>
    </div>
  );
}

// expose
Object.assign(window, {
  ShelfScreen, ArcadeScreen, MachineScreen, OpenScreen, SendScreen, InboxScreen, MeScreen,
  CirclesScreen, JoinCodeScreen, CircleScreen, GiftArcadeScreen, LoginScreen, SetupAccountScreen,
});
