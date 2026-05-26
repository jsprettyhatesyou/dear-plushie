// app.jsx — dear plushie! orchestrator

const { useState, useEffect, useRef } = React;

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
function encodeGift(g) {
  try {
    const json = JSON.stringify({ p: g.plushie, m: g.message, f: g.from || '' });
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
window.buildGiftLink = buildGiftLink;

// ─── Parse #to=username from hash ───
function decodeToUsername(hash) {
  if (!hash) return null;
  const m = hash.match(/[#&]?to=([a-z0-9_-]+)/i);
  return m ? m[1].toLowerCase() : null;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useState('shelf');
  const [machineId, setMachineId] = useState(null);
  const [openItemId, setOpenItemId] = useState(null);
  const [localItems, setLocalItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [sendToFriend, setSendToFriend] = useState(null); // { uid, displayName, username }
  const [currentCircleId, setCurrentCircleId] = useState(null);

  // ── Firebase hooks ──
  const { user, signIn, signOut } = useFirebaseAuth();
  const { profile, createProfile } = useProfile(user?.uid);
  const { friends, addFriend } = useFriends(user?.uid);
  const { inbox, addGift, openGift: markOpened } = useFirebaseInbox(user?.uid);
  const { circles, createCircle, addCircleToState } = useCircles(user?.uid);

  // ── Gift link / #to= detection ──
  const [activeGift, setActiveGift] = useState(() => decodeGift(typeof window !== 'undefined' ? window.location.hash : ''));
  const [toUsername, setToUsername] = useState(() => decodeToUsername(typeof window !== 'undefined' ? window.location.hash : ''));
  const [toProfile, setToProfile] = useState(null); // resolved profile for #to=

  // Resolve #to=username → profile
  useEffect(() => {
    if (!toUsername) return;
    window.firebaseDB.init().then(() =>
      window.firebaseDB.getProfileByUsername(toUsername)
    ).then(p => {
      setToProfile(p);
      if (p) {
        setSendToFriend(p);
        setScreen('send');
      }
    }).catch(() => {});
    // Clean hash after reading
    try { history.replaceState(null, '', window.location.pathname); } catch (e) {}
  }, [toUsername]);

  useEffect(() => {
    const onHash = () => {
      const g = decodeGift(window.location.hash);
      if (g) { setActiveGift(g); setScreen('gift'); return; }
      const u = decodeToUsername(window.location.hash);
      if (u) setToUsername(u);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (activeGift) setScreen('gift');
  // eslint-disable-next-line
  }, []);

  // ── Palette / font tweaks ──
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
    document.documentElement.style.setProperty('--font-body',    `'${t.bodyFont}', system-ui`);
  }, [t.headingFont, t.bodyFont]);

  // ── Actions ──
  const showToast = (msg, ms = 2200) => {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  };

  const openItem = (id) => {
    setOpenItemId(id);
    if (!localItems.some(i => i.id === id)) markOpened(id);
    setScreen('open');
  };

  const onCaught = (plushieId) => {
    const senders  = ['a soft stranger', 'iris 🪻', 'mochi 🍡', 'sunny ☀️', 'taro 🐝'];
    const messages = [
      'you picked this plushie · or did it pick you?',
      'a tiny feeling, kept for you.',
      "today's small wish: rest well.",
      'thinking of you in the soft way.',
    ];
    addGift({
      id: 'caught-' + Date.now(),
      plushie: plushieId,
      from:    senders[Math.floor(Math.random() * senders.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      when:    'just now',
      opened:  false,
    });
    setMachineId(null);
    setScreen('shelf');
    showToast('caught! kept on your shelf ♡');
  };

  const onSent = () => {
    setSendToFriend(null);
    setScreen('shelf');
  };

  const handleAddFriend = async (friendUid) => {
    await addFriend(friendUid); // throws on duplicate/self
    showToast('added to your cozy circle 🧸');
  };

  // ── Auth gates ──
  if (user === undefined || (user && profile === undefined)) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100dvh' }}>
      <div style={{ fontFamily:'Caveat, cursive', fontSize:22, color:'var(--ink-soft)' }}>loading softly… 🌸</div>
    </div>
  );
  if (!user) return <LoginScreen onSignIn={signIn} />;
  if (user && profile === null) return <SetupAccountScreen user={user} onComplete={createProfile} />;

  // ── Screen routing ──
  const captions = {
    shelf:        '01 · your collected plushies',
    arcade:       '02 · pick a claw machine',
    machine:      '03 · drop the claw gently',
    open:         '04 · open the envelope',
    send:         '05 · send a tiny secret',
    inbox:        '06 · all your unopened feelings',
    me:           '07 · cozy profile',
    circles:      '08 · cozy circles · shared worlds',
    createCircle: '09 · create a new circle',
    joinCircle:   '10 · join a circle',
    circle:       '11 · inside a cozy circle',
    join:         '12 · find a friend by shelf code',
  };

  let content;
  if (screen === 'shelf')   content = <ShelfScreen inbox={inbox} onOpen={openItem} />;
  else if (screen === 'arcade')  content = <ArcadeScreen onEnter={(id) => { setMachineId(id); setScreen('machine'); }} />;
  else if (screen === 'machine') content = <MachineScreen machineId={machineId} onBack={() => setScreen('arcade')} onCaught={onCaught} />;
  else if (screen === 'open') {
    const item = [...localItems, ...inbox].find(i => i.id === openItemId);
    content = item
      ? <OpenScreen item={item} onBack={() => setScreen('shelf')} onReply={() => setScreen('send')} />
      : <ShelfScreen inbox={inbox} onOpen={openItem} />;
  }
  else if (screen === 'send') content = (
    <SendScreen
      onBack={() => { setSendToFriend(null); setScreen(sendToFriend ? 'circles' : 'shelf'); }}
      onSent={onSent}
      receiverProfile={sendToFriend}
      senderProfile={profile}
    />
  );
  else if (screen === 'inbox')   content = <InboxScreen inbox={inbox} onOpen={openItem} />;
  else if (screen === 'me')      content = (
    <MeScreen
      inbox={inbox}
      user={user}
      profile={profile}
      onSignOut={signOut}
      onOpenCircles={() => setScreen('circles')}
      circleCount={(circles || []).length}
    />
  );
  else if (screen === 'circles') content = (
    <MyCirclesScreen
      circles={circles}
      onBack={() => setScreen('me')}
      onOpenCircle={(id) => { setCurrentCircleId(id); setScreen('circle'); }}
      onCreateCircle={() => setScreen('createCircle')}
      onJoinCircle={() => setScreen('joinCircle')}
    />
  );
  else if (screen === 'createCircle') content = (
    <CreateCircleScreen
      onBack={() => setScreen('circles')}
      onCreated={async (data) => {
        const circle = await createCircle(data);
        setCurrentCircleId(circle.id);
        showToast(`${circle.name} is live 🧸`);
        setScreen('circle');
      }}
    />
  );
  else if (screen === 'joinCircle') content = (
    <JoinCircleScreen
      onBack={() => setScreen('circles')}
      myUid={user.uid}
      onJoined={(circle) => {
        addCircleToState(circle);
        setCurrentCircleId(circle.id);
        showToast(`welcome to ${circle.name} 🧸`);
        setScreen('circle');
      }}
    />
  );
  else if (screen === 'circle') content = (
    <CircleRoomScreen
      circleId={currentCircleId}
      myUid={user.uid}
      myProfile={profile}
      onBack={() => setScreen('circles')}
    />
  );
  else if (screen === 'join') content = (
    <JoinCodeScreen
      onBack={() => setScreen('circles')}
      myUid={user.uid}
      onAddFriend={handleAddFriend}
    />
  );
  else if (screen === 'gift' && activeGift) {
    content = <GiftArcadeScreen
      gift={activeGift}
      onKept={() => {
        addGift({
          id:      'gift-' + Date.now(),
          plushie: activeGift.plushie,
          from:    activeGift.from || 'a soft stranger',
          message: activeGift.message,
          when:    'just now',
          opened:  true,
        });
        setActiveGift(null);
        try { history.replaceState(null, '', window.location.pathname); } catch (e) { window.location.hash = ''; }
        setScreen('shelf');
        showToast('kept on your shelf ♡');
      }}
    />;
  }
  else if (screen === 'circle') content = null; // legacy — unused

  const tabActive = ['shelf','arcade','inbox','me'].includes(screen) ? screen
                  : screen === 'open'    ? 'shelf'
                  : screen === 'machine' ? 'arcade'
                  : screen === 'send'    ? 'send'
                  : ['circles','createCircle','joinCircle','circle','join'].includes(screen) ? 'me'
                  : 'shelf';

  const tabVisible = !['machine','send','open','join','gift','createCircle','joinCircle','circle'].includes(screen);

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
          { value: 'shelf',        label: 'Shelf (home)' },
          { value: 'arcade',       label: 'Arcade list' },
          { value: 'machine',      label: 'Claw machine' },
          { value: 'send',         label: 'Send a plushie' },
          { value: 'open',         label: 'Open a message' },
          { value: 'inbox',        label: 'Inbox' },
          { value: 'me',           label: 'You / profile' },
          { value: 'circles',      label: 'My circles' },
          { value: 'createCircle', label: 'Create circle' },
          { value: 'joinCircle',   label: 'Join circle' },
          { value: 'circle',       label: 'Circle room' },
        ]}
        onChange={(v) => {
          if (v === 'machine' && !machineId) setMachineId('daily');
          if (v === 'open' && !openItemId) setOpenItemId(inbox[0]?.id);
          setScreen(v);
        }}
      />
    </TweaksPanel>
  );

  const toastEl = toast && <div className="app-toast fade-in">{toast}</div>;

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
            onSend={() => { setSendToFriend(null); setScreen('send'); }}
            mobile
          />
        )}
      </div>

      {/* Desktop shell — visible ≥768px */}
      <div className="stage" data-screen-label={`prototype · ${screen}`}>
        <div style={{ position:'relative', fontFamily:'var(--font-body, Inter), system-ui' }}>
          <IOSDevice width={402} height={874}>
            <div className="device-scroll" style={{
              position:'absolute', inset:0, paddingTop:60,
              overflow:'auto', background:'transparent',
            }}>
              {content}
            </div>
            {tabVisible && (
              <TabBar
                active={tabActive}
                onChange={(id) => setScreen(id)}
                onSend={() => { setSendToFriend(null); setScreen('send'); }}
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
