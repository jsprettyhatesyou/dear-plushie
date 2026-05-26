// app.jsx — dear plushie! orchestrator

const { useState, useEffect, useRef } = React;

const MY_CODE = 'MOON42';

const SEED_CIRCLES = [
  {
    id: 'softgirls',
    name: 'softgirl club',
    code: 'SOFT42',
    tint: '#FFE6EE',
    emoji: '🎀',
    tagline: 'tiny feelings · soft hours · pls no work talk',
    members: [
      { name: 'moony',  emoji: '🌙' },
      { name: 'mochi',  emoji: '🍡' },
      { name: 'sunny',  emoji: '☀️' },
      { name: 'rin',    emoji: '🌸' },
      { name: 'iris',   emoji: '🪻' },
    ],
    unread: 2,
    wall: [
      { id: 'w1', plushie: 'ribbon', from: 'mochi', when: '1h',  message: 'soft hour right now ♡' },
      { id: 'w2', plushie: 'star',   from: 'sunny', when: '3h',  message: 'wish for u all today' },
      { id: 'w3', plushie: 'heart',  from: 'rin',   when: 'yest',message: 'survived monday !!' },
      { id: 'w4', plushie: 'ghost',  from: 'iris',  when: '2d',  message: 'spirit hug · catch' },
      { id: 'w5', plushie: 'bingsu', from: 'mochi', when: '3d',  message: 'cloud nap rec ☁️' },
    ],
  },
  {
    id: 'rainyday',
    name: 'rainy day club',
    code: 'CLOUD9',
    tint: '#E6F0F7',
    emoji: '☔',
    tagline: 'for the gentle gloomy days · lofi only',
    members: [
      { name: 'moony', emoji: '🌙' },
      { name: 'taro',  emoji: '🐝' },
      { name: 'koji',  emoji: '🌿' },
    ],
    unread: 0,
    wall: [
      { id: 'r1', plushie: 'frog',  from: 'taro', when: '5h', message: 'matcha rec for the rain' },
      { id: 'r2', plushie: 'cat',   from: 'koji', when: '1d', message: 'cozy playlist ↘︎' },
      { id: 'r3', plushie: 'panda', from: 'taro', when: '2d', message: 'staying in today ♡' },
    ],
  },
];


// ─── tweak defaults ───
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#F8DDE3", "#FFF9F5", "#C69C84", "#C8B6E2", "#FFD6C2"],
  "headingFont": "Fredoka",
  "bodyFont": "Inter",
  "machineSignText": "♡ dear plushie ♡",
  "voice": "cozy",
  "stickers": true,
  "captionMode": "stage"
}/*EDITMODE-END*/;

// ─── Gift link encoding ───
// payload: { p: plushie id, m: message, f: from name }
// shoved into the URL hash so no backend is needed; the link IS the gift.
function encodeGift(g) {
  try {
    const json = JSON.stringify({ p: g.plushie, m: g.message, f: g.from || '' });
    // utf-8 safe base64
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) { return ''; }
}
function decodeGift(hash) {
  if (!hash) return null;
  const m = hash.match(/gift=([A-Za-z0-9_\-]+)/);
  if (!m) return null;
  try {
    let b64 = m[1].replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const json = decodeURIComponent(escape(atob(b64)));
    const o = JSON.parse(json);
    if (!o.p || !PLUSHIE_BY_ID[o.p]) return null;
    return { plushie: o.p, message: o.m || '', from: o.f || 'a soft stranger' };
  } catch (e) { return null; }
}
function buildGiftLink(g) {
  const code = encodeGift(g);
  const base = window.location.origin + window.location.pathname;
  return base + '#gift=' + code;
}
// expose for SendScreen
window.buildGiftLink = buildGiftLink;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useState('shelf');
  const [machineId, setMachineId] = useState(null);
  const [openItemId, setOpenItemId] = useState(null);
  const { inbox, addGift, openGift: markOpened } = useFirebaseInbox();
  const [localItems, setLocalItems] = useState([]); // temp items (circle wall views)
  const [circles, setCircles] = useState(SEED_CIRCLES);
  const [activeCircleId, setActiveCircleId] = useState(null);
  const [toast, setToast] = useState(null);
  // gift link state — if URL hash has a gift, the recipient experience takes over
  const [activeGift, setActiveGift] = useState(() => decodeGift(typeof window !== 'undefined' ? window.location.hash : ''));

  // re-check hash on hashchange (lets users preview their own gift link)
  useEffect(() => {
    const onHash = () => {
      const g = decodeGift(window.location.hash);
      if (g) {
        setActiveGift(g);
        setScreen('gift');
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // on mount, if there’s already a gift in the hash, route to it
  useEffect(() => {
    if (activeGift) setScreen('gift');
  // eslint-disable-next-line
  }, []);

  // apply palette tweak to CSS vars
  useEffect(() => {
    if (Array.isArray(t.palette)) {
      const root = document.documentElement;
      root.style.setProperty('--pink',     t.palette[0]);
      root.style.setProperty('--cream',    t.palette[1]);
      root.style.setProperty('--plush',    t.palette[2]);
      root.style.setProperty('--lavender', t.palette[3]);
      root.style.setProperty('--peach',    t.palette[4]);
    }
  }, [t.palette]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-heading', `'${t.headingFont}', system-ui`);
    document.documentElement.style.setProperty('--font-body', `'${t.bodyFont}', system-ui`);
  }, [t.headingFont, t.bodyFont]);

  const openItem = (id) => {
    setOpenItemId(id);
    if (!localItems.some(i => i.id === id)) markOpened(id);
    setScreen('open');
  };

  const onCaught = (plushieId) => {
    const id = 'caught-' + Date.now();
    const senders = ['a soft stranger', 'iris 🪻', 'mochi 🍡', 'sunny ☀️', 'taro 🐝'];
    const messages = [
      'you picked this plushie · or did it pick you?',
      'a tiny feeling, kept for you.',
      "today's small wish: rest well.",
      'thinking of you in the soft way.',
    ];
    const newItem = {
      id, plushie: plushieId,
      from: senders[Math.floor(Math.random() * senders.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      when: 'just now', opened: false,
    };
    addGift(newItem);
    setMachineId(null);
    setScreen('shelf');
    setToast('caught! kept on your shelf ♡');
    setTimeout(() => setToast(null), 2200);
  };

  const onSent = () => {
    setScreen('shelf');
    setToast('plushie sent gently ♡');
    setTimeout(() => setToast(null), 2200);
  };

  // captions per screen for the stage hint
  const captions = {
    shelf:   '01 · your collected plushies',
    arcade:  '02 · pick a claw machine',
    machine: '03 · drop the claw gently',
    open:    '04 · open the envelope',
    send:    '05 · send a tiny secret',
    inbox:   '06 · all your unopened feelings',
    me:      '07 · cozy profile',
    circles: '08 · cozy circles · share a code',
    join:    '09 · join with a tiny code',
    circle:  '10 · a shared shelf',
  };

  const handleJoined = (code) => {
    // if known seed code → focus that circle; else create a soft new one
    const existing = circles.find(c => c.code === code);
    if (existing) {
      setActiveCircleId(existing.id);
      setScreen('circle');
      setToast(`joined · ${existing.name} ♡`);
      setTimeout(() => setToast(null), 2200);
      return;
    }
    const fresh = {
      id: 'c-' + Date.now(),
      name: code.toLowerCase() + "'s circle",
      code,
      tint: '#F3E6F7',
      emoji: '🌷',
      tagline: 'a quiet little room you just joined',
      members: [
        { name: 'moony', emoji: '🌙' },
        { name: '?',     emoji: '✨' },
      ],
      unread: 1,
      wall: [
        { id: 'fresh-1', plushie: 'bear', from: 'host', when: 'now', message: 'welcome in ♡' },
      ],
    };
    setCircles(arr => [fresh, ...arr]);
    setActiveCircleId(fresh.id);
    setScreen('circle');
    setToast('joined a new circle ♡');
    setTimeout(() => setToast(null), 2200);
  };

  const handleShare = (mode) => {
    if (mode === 'copy') {
      try { navigator.clipboard?.writeText(MY_CODE); } catch (e) {}
      setToast(`copied · ${MY_CODE} ♡`);
    } else {
      setToast('share sheet · softly opening…');
    }
    setTimeout(() => setToast(null), 1800);
  };

  // determine current screen content
  let content;
  if (screen === 'shelf')   content = <ShelfScreen inbox={inbox} onOpen={openItem} />;
  else if (screen === 'arcade')  content = <ArcadeScreen onEnter={(id) => { setMachineId(id); setScreen('machine'); }} />;
  else if (screen === 'machine') content = <MachineScreen machineId={machineId} onBack={() => setScreen('arcade')} onCaught={onCaught} />;
  else if (screen === 'open') {
    const item = [...localItems, ...inbox].find(i => i.id === openItemId);
    content = item ? <OpenScreen item={item} onBack={() => setScreen('shelf')} onReply={() => setScreen('send')} /> : <ShelfScreen inbox={inbox} onOpen={openItem} />;
  }
  else if (screen === 'send')    content = <SendScreen onBack={() => setScreen('shelf')} onSent={onSent} />;
  else if (screen === 'inbox')   content = <InboxScreen inbox={inbox} onOpen={openItem} />;
  else if (screen === 'me')      content = <MeScreen inbox={inbox} onOpenCircles={() => setScreen('circles')} circleCount={circles.length} />;
  else if (screen === 'circles') content = <CirclesScreen
    onBack={() => setScreen('me')}
    onJoin={() => setScreen('join')}
    onOpenCircle={(id) => { setActiveCircleId(id); setScreen('circle'); }}
    circles={circles} myCode={MY_CODE} onShare={handleShare}
  />;
  else if (screen === 'join') content = <JoinCodeScreen onBack={() => setScreen('circles')} onJoined={handleJoined} />;
  else if (screen === 'gift' && activeGift) {
    content = <GiftArcadeScreen
      gift={activeGift}
      onKept={() => {
        const newItem = {
          id: 'gift-' + Date.now(),
          plushie: activeGift.plushie,
          from: activeGift.from || 'a soft stranger',
          message: activeGift.message,
          when: 'just now',
          opened: true,
        };
        addGift(newItem);
        setActiveGift(null);
        try { history.replaceState(null, '', window.location.pathname); } catch (e) { window.location.hash = ''; }
        setScreen('shelf');
        setToast('kept on your shelf ♡');
        setTimeout(() => setToast(null), 2200);
      }}
    />;
  }
  else if (screen === 'circle') {
    const c = circles.find(x => x.id === activeCircleId);
    content = <CircleScreen
      circle={c}
      onBack={() => setScreen('circles')}
      onLeavePlushie={() => setScreen('send')}
      onOpenWallItem={(w) => {
        const wallItem = { id: 'w-' + w.id, plushie: w.plushie, from: w.from, message: w.message, when: w.when, opened: true };
        setLocalItems(arr => [wallItem, ...arr]);
        setOpenItemId('w-' + w.id);
        setScreen('open');
      }}
    />;
  }

  const tabActive = ['shelf','arcade','inbox','me'].includes(screen) ? screen
                  : screen === 'open' ? 'shelf'
                  : screen === 'machine' ? 'arcade'
                  : screen === 'send' ? 'send'
                  : ['circles','join','circle'].includes(screen) ? 'me'
                  : 'shelf';

  const tabVisible = !['machine', 'send', 'open', 'join', 'gift'].includes(screen);

  // tweaks panel (single instance, lives outside both shells)
  const tweaksUI = (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Aesthetic" />
      <TweakColor
        label="Palette"
        value={t.palette}
        options={[
          ['#F8DDE3', '#FFF9F5', '#C69C84', '#C8B6E2', '#FFD6C2'],
          ['#FFE0E0', '#FFF7F7', '#9D6E5C', '#B8A4D9', '#FFC7B0'],
          ['#E7D9F5', '#FAF7FF', '#A992C7', '#F2A5BA', '#C7DDB7'],
          ['#FCEBD2', '#FFFBF2', '#B89077', '#FFD6C2', '#D9C2B0'],
          ['#D9EAEA', '#F7FBFB', '#7FA3A3', '#C8B6E2', '#FFE0E0'],
        ]}
        onChange={(v) => setTweak('palette', v)}
      />
      <TweakRadio
        label="Heading font"
        value={t.headingFont}
        options={['Fredoka', 'Baloo 2', 'Nunito']}
        onChange={(v) => setTweak('headingFont', v)}
      />
      <TweakToggle
        label="Sparkle stickers"
        value={t.stickers}
        onChange={(v) => setTweak('stickers', v)}
      />

      <TweakSection label="Voice" />
      <TweakRadio
        label="Tone"
        value={t.voice}
        options={['cozy', 'shy', 'soft']}
        onChange={(v) => setTweak('voice', v)}
      />
      <TweakText
        label="Machine sign"
        value={t.machineSignText}
        onChange={(v) => setTweak('machineSignText', v)}
      />

      <TweakSection label="Stage" />
      <TweakRadio
        label="Caption"
        value={t.captionMode}
        options={['stage', 'off']}
        onChange={(v) => setTweak('captionMode', v)}
      />

      <TweakSection label="Jump to screen" />
      <TweakSelect
        label="Screen"
        value={screen}
        options={[
          { value: 'shelf',   label: 'Shelf (home)' },
          { value: 'arcade',  label: 'Arcade list' },
          { value: 'machine', label: 'Claw machine' },
          { value: 'send',    label: 'Send a plushie' },
          { value: 'open',    label: 'Open a message' },
          { value: 'inbox',   label: 'Inbox' },
          { value: 'me',      label: 'You / profile' },
          { value: 'circles', label: 'Cozy circles' },
          { value: 'join',    label: 'Join with code' },
          { value: 'circle',  label: 'A shared shelf' },
        ]}
        onChange={(v) => {
          if (v === 'machine' && !machineId) setMachineId('daily');
          if (v === 'open' && !openItemId) setOpenItemId(inbox[0]?.id);
          if (v === 'circle' && !activeCircleId) setActiveCircleId(circles[0]?.id);
          setScreen(v);
        }}
      />
    </TweaksPanel>
  );

  const toastEl = toast && (
    <div className="app-toast fade-in">{toast}</div>
  );

  // ─── Render BOTH shells. CSS @media queries control which is visible. ───
  return (
    <>
      {/* Mobile shell — visible <768px */}
      <div className="mobile-shell" data-screen-label={`mobile · ${screen}`} style={{
        fontFamily: 'var(--font-body, Inter), system-ui',
      }}>
        <div className="mobile-status-spacer" />
        {content}
        {tabVisible && (
          <TabBar
            active={tabActive}
            onChange={(id) => setScreen(id)}
            onSend={() => setScreen('send')}
            mobile
          />
        )}
      </div>

      {/* Desktop shell — visible ≥768px */}
      <div className="stage" data-screen-label={`prototype · ${screen}`}>
        <div style={{
          position: 'relative',
          fontFamily: 'var(--font-body, Inter), system-ui',
        }}>
          <IOSDevice width={402} height={874}>
            <div className="device-scroll" style={{
              position: 'absolute', inset: 0,
              paddingTop: 60,
              overflow: 'auto',
              background: 'transparent',
            }}>
              {content}
            </div>
            {tabVisible && (
              <TabBar
                active={tabActive}
                onChange={(id) => setScreen(id)}
                onSend={() => setScreen('send')}
              />
            )}
          </IOSDevice>
        </div>
        {t.captionMode === 'stage' && (
          <div className="stage-caption">{captions[screen] || screen}</div>
        )}
      </div>

      {toastEl}
      {tweaksUI}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
