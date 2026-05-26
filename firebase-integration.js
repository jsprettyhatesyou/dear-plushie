// firebase-integration.js — React hooks for Firebase Firestore inbox sync
// Provides persistent storage without authentication (anonymous user mode)

function useFirebaseInbox() {
  const [inbox, setInbox] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [userId, setUserId] = React.useState(null);
  const [error, setError] = React.useState(null);

  // Initialize user and load inbox on mount
  React.useEffect(() => {
    const initUser = async () => {
      try {
        // Generate a persistent anonymous user ID stored in localStorage
        let uid = localStorage.getItem('dear-plushie-uid');
        if (!uid) {
          uid = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('dear-plushie-uid', uid);
        }
        setUserId(uid);

        // Initialize Firebase
        await window.firebaseDB.init();
        
        // Create/get user record
        await window.firebaseDB.createUser(uid, { 
          username: localStorage.getItem('dear-plushie-username') || 'anon-friend'
        });
        
        // Load inbox from Firestore
        const inbox = await window.firebaseDB.loadInbox(uid);
        setInbox(inbox);
        setLoading(false);
      } catch (err) {
        console.error('Firebase init error:', err);
        // Fallback to empty inbox if Firebase fails
        setInbox([]);
        setLoading(false);
        setError(err.message);
      }
    };

    initUser();
  }, []);

  // Save gift to Firestore
  const addGift = React.useCallback(async (gift) => {
    if (!userId) {
      console.error('User ID not set');
      return;
    }
    
    try {
      const giftId = await window.firebaseDB.saveGift(userId, gift);
      
      // Optimistically update local state
      const newGift = {
        id: giftId,
        ...gift,
        createdAt: new Date().toISOString(),
      };
      setInbox(arr => [newGift, ...arr]);
      
      return giftId;
    } catch (err) {
      console.error('Error saving gift:', err);
      setError(err.message);
    }
  }, [userId]);

  // Mark gift as opened
  const openGift = React.useCallback(async (giftId) => {
    if (!userId) return;
    
    try {
      await window.firebaseDB.markOpened(userId, giftId);
      
      // Optimistically update local state
      setInbox(arr => 
        arr.map(item => 
          item.id === giftId ? { ...item, opened: true } : item
        )
      );
    } catch (err) {
      console.error('Error opening gift:', err);
      setError(err.message);
    }
  }, [userId]);

  // Delete gift
  const removeGift = React.useCallback(async (giftId) => {
    if (!userId) return;
    
    try {
      await window.firebaseDB.deleteGift(userId, giftId);
      
      // Optimistically update local state
      setInbox(arr => arr.filter(item => item.id !== giftId));
    } catch (err) {
      console.error('Error deleting gift:', err);
      setError(err.message);
    }
  }, [userId]);

  return {
    inbox,
    loading,
    userId,
    error,
    addGift,
    openGift,
    removeGift,
  };
}

// Expose hook to window
window.useFirebaseInbox = useFirebaseInbox;
