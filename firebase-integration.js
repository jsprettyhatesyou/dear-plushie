// firebase-integration.js — Auth + Firestore hooks for dear plushie!

// ── Auth hook ──────────────────────────────────────────────
function useFirebaseAuth() {
  const [user, setUser] = React.useState(undefined); // undefined = still checking

  React.useEffect(() => {
    let unsub;
    window.firebaseDB.init().then(() => {
      unsub = firebase.auth().onAuthStateChanged((u) => {
        setUser(u || null);
      });
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

// ── Inbox hook ─────────────────────────────────────────────
function useFirebaseInbox(userId) {
  const [inbox, setInbox] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!userId) {
      setInbox([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        await window.firebaseDB.init();
        const u = firebase.auth().currentUser;
        await window.firebaseDB.createUser(userId, {
          username: u?.displayName || 'soft friend',
          email: u?.email || '',
        });
        const items = await window.firebaseDB.loadInbox(userId);
        setInbox(items);
        setLoading(false);
      } catch (err) {
        console.error('Inbox load error:', err);
        setInbox([]);
        setLoading(false);
        setError(err.message);
      }
    };

    load();
  }, [userId]);

  const addGift = React.useCallback(async (gift) => {
    if (!userId) return;
    try {
      const giftId = await window.firebaseDB.saveGift(userId, gift);
      setInbox(arr => [{ id: giftId, ...gift, createdAt: new Date().toISOString() }, ...arr]);
      return giftId;
    } catch (err) {
      console.error('Error saving gift:', err);
      setError(err.message);
    }
  }, [userId]);

  const openGift = React.useCallback(async (giftId) => {
    if (!userId) return;
    try {
      await window.firebaseDB.markOpened(userId, giftId);
      setInbox(arr => arr.map(item => item.id === giftId ? { ...item, opened: true } : item));
    } catch (err) {
      console.error('Error opening gift:', err);
    }
  }, [userId]);

  const removeGift = React.useCallback(async (giftId) => {
    if (!userId) return;
    try {
      await window.firebaseDB.deleteGift(userId, giftId);
      setInbox(arr => arr.filter(item => item.id !== giftId));
    } catch (err) {
      console.error('Error deleting gift:', err);
    }
  }, [userId]);

  return { inbox, loading, error, addGift, openGift, removeGift };
}

window.useFirebaseAuth = useFirebaseAuth;
window.useFirebaseInbox = useFirebaseInbox;
