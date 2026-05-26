// firebase-integration.js — Auth + Firestore React hooks for dear plushie!

// ── Auth ──────────────────────────────────────────────
function useFirebaseAuth() {
  const [user, setUser] = React.useState(undefined); // undefined = checking

  React.useEffect(() => {
    let unsub;
    window.firebaseDB.init().then(() => {
      unsub = firebase.auth().onAuthStateChanged(u => setUser(u || null));
    });
    return () => { if (unsub) unsub(); };
  }, []);

  const signIn = React.useCallback(async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
  }, []);

  const signOut = React.useCallback(async () => {
    await firebase.auth().signOut();
  }, []);

  return { user, signIn, signOut };
}

// ── Profile ───────────────────────────────────────────
function useProfile(uid) {
  const [profile, setProfile] = React.useState(undefined); // undefined = loading

  React.useEffect(() => {
    if (!uid) { setProfile(null); return; }
    window.firebaseDB.getProfile(uid)
      .then(p => setProfile(p || null))
      .catch(() => setProfile(null));
  }, [uid]);

  const createProfile = React.useCallback(async (data) => {
    const p = await window.firebaseDB.createProfile(uid, data);
    setProfile(p);
    return p;
  }, [uid]);

  const updateProfile = React.useCallback(async (updates) => {
    await window.firebaseDB.updateProfile(uid, updates);
    setProfile(prev => ({ ...prev, ...updates }));
  }, [uid]);

  return { profile, createProfile, updateProfile };
}

// ── Friends ───────────────────────────────────────────
function useFriends(uid) {
  const [friends, setFriends] = React.useState([]);

  React.useEffect(() => {
    if (!uid) { setFriends([]); return; }
    window.firebaseDB.getFriends(uid).then(setFriends).catch(() => setFriends([]));
  }, [uid]);

  const addFriend = React.useCallback(async (friendUid) => {
    const fp = await window.firebaseDB.addFriend(uid, friendUid);
    setFriends(prev => [{ uid: friendUid, ...fp }, ...prev]);
    return fp;
  }, [uid]);

  return { friends, addFriend };
}

// ── Inbox ─────────────────────────────────────────────
function useFirebaseInbox(userId) {
  const [inbox, setInbox] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!userId) { setInbox([]); setLoading(false); return; }
    window.firebaseDB.init().then(async () => {
      try {
        const items = await window.firebaseDB.loadInbox(userId);
        setInbox(items);
        setLoading(false);
      } catch (err) {
        setInbox([]);
        setLoading(false);
        setError(err.message);
      }
    });
  }, [userId]);

  const addGift = React.useCallback(async (gift) => {
    if (!userId) return;
    try {
      const giftId = await window.firebaseDB.saveGift(userId, gift);
      setInbox(arr => [{ id: giftId, ...gift, createdAt: new Date().toISOString() }, ...arr]);
      return giftId;
    } catch (err) { setError(err.message); }
  }, [userId]);

  const openGift = React.useCallback(async (giftId) => {
    if (!userId) return;
    try {
      await window.firebaseDB.markOpened(userId, giftId);
      setInbox(arr => arr.map(item => item.id === giftId ? { ...item, opened: true } : item));
    } catch (err) { console.error('openGift error:', err); }
  }, [userId]);

  const removeGift = React.useCallback(async (giftId) => {
    if (!userId) return;
    try {
      await window.firebaseDB.deleteGift(userId, giftId);
      setInbox(arr => arr.filter(item => item.id !== giftId));
    } catch (err) { console.error('removeGift error:', err); }
  }, [userId]);

  return { inbox, loading, error, addGift, openGift, removeGift };
}

// ── Circles ───────────────────────────────────────────
function useCircles(uid) {
  const [circles, setCircles] = React.useState(undefined);

  React.useEffect(() => {
    if (!uid) { setCircles([]); return; }
    window.firebaseDB.getCirclesForUser(uid).then(setCircles).catch(() => setCircles([]));
  }, [uid]);

  const createCircle = React.useCallback(async ({ name, theme }) => {
    const circle = await window.firebaseDB.createCircle(uid, { name, theme });
    setCircles(prev => [circle, ...(prev || [])]);
    return circle;
  }, [uid]);

  const joinCircle = React.useCallback(async (inviteCode) => {
    const circle = await window.firebaseDB.joinCircle(uid, inviteCode);
    setCircles(prev => [...(prev || []), circle]);
    return circle;
  }, [uid]);

  const addCircleToState = React.useCallback((circle) => {
    setCircles(prev => [...(prev || []).filter(c => c.id !== circle.id), circle]);
  }, []);

  return { circles, createCircle, joinCircle, addCircleToState };
}

function useCircleRoom(circleId, uid) {
  const [circle, setCircle] = React.useState(undefined);
  const [shelf, setShelf] = React.useState([]);
  const [notes, setNotes] = React.useState([]);

  React.useEffect(() => {
    if (!circleId) return;
    window.firebaseDB.getCircle(circleId).then(setCircle);
    const unsubShelf = window.firebaseDB.subscribeToCircleShelf(circleId, setShelf);
    const unsubNotes = window.firebaseDB.subscribeToCircleNotes(circleId, setNotes);
    return () => { unsubShelf(); unsubNotes(); };
  }, [circleId]);

  const sendPlushie = React.useCallback(async ({ plushie, message, displayName, anonymous }) => {
    return window.firebaseDB.sendToCircleShelf(circleId, { plushie, message, fromUid: uid, displayName, anonymous });
  }, [circleId, uid]);

  const react = React.useCallback((itemId, emoji) => {
    return window.firebaseDB.reactToCircleShelfItem(circleId, itemId, emoji, uid);
  }, [circleId, uid]);

  const leaveNote = React.useCallback((text) => {
    return window.firebaseDB.leaveCircleNote(circleId, text, uid);
  }, [circleId, uid]);

  return { circle, shelf, notes, sendPlushie, react, leaveNote };
}

window.useFirebaseAuth  = useFirebaseAuth;
window.useProfile       = useProfile;
window.useFriends       = useFriends;
window.useFirebaseInbox = useFirebaseInbox;
window.useCircles       = useCircles;
window.useCircleRoom    = useCircleRoom;
