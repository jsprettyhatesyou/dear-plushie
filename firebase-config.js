// firebase-config.js — Firebase Firestore setup for dear plushie!
// Initialize Firebase and Firestore database

// ⚠️ IMPORTANT: Replace with your own Firebase config
// Get this from: Firebase Console → Project Settings → Web App
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAXIxJ6--uEx6yepoYrJSBl87eppFfj4nU",
  authDomain: "dear-plushie.firebaseapp.com",
  projectId: "dear-plushie",
  storageBucket: "dear-plushie.firebasestorage.app",
  messagingSenderId: "234347046572",
  appId: "1:234347046572:web:68ace8429de5500955a109"
};

// Initialize Firebase (using CDN, so global firebase object exists)
// Assumes firebase SDK is loaded in HTML

let db = null;

async function initializeFirebase() {
  if (db) return db;
  
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    console.log('✓ Firebase initialized');
    return db;
  } catch (e) {
    console.error('Firebase init failed:', e);
    return null;
  }
}

// ──────────────────────────────────────────────────────
// INBOX OPERATIONS — save/load gifts
// ──────────────────────────────────────────────────────

async function saveGiftToInbox(userId, gift) {
  if (!db) await initializeFirebase();
  if (!db) throw new Error('Firebase not initialized');
  
  const inboxRef = db.collection('users').doc(userId).collection('inbox');
  const docRef = await inboxRef.add({
    plushie: gift.plushie,
    message: gift.message,
    from: gift.from,
    when: gift.when || new Date().toISOString(),
    opened: gift.opened || false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  
  return docRef.id;
}

async function loadInboxForUser(userId) {
  if (!db) await initializeFirebase();
  if (!db) throw new Error('Firebase not initialized');
  
  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('inbox')
    .orderBy('createdAt', 'desc')
    .get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

async function markGiftAsOpened(userId, giftId) {
  if (!db) await initializeFirebase();
  if (!db) throw new Error('Firebase not initialized');
  
  await db
    .collection('users')
    .doc(userId)
    .collection('inbox')
    .doc(giftId)
    .update({ opened: true });
}

async function deleteGift(userId, giftId) {
  if (!db) await initializeFirebase();
  if (!db) throw new Error('Firebase not initialized');
  
  await db
    .collection('users')
    .doc(userId)
    .collection('inbox')
    .doc(giftId)
    .delete();
}

// ──────────────────────────────────────────────────────
// USER OPERATIONS
// ──────────────────────────────────────────────────────

async function createOrGetUser(userId, userData = {}) {
  if (!db) await initializeFirebase();
  if (!db) throw new Error('Firebase not initialized');
  
  const userRef = db.collection('users').doc(userId);
  const doc = await userRef.get();
  
  if (doc.exists) {
    return doc.data();
  }
  
  const newUserData = {
    userId,
    username: userData.username || 'anonymous',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    ...userData,
  };
  
  await userRef.set(newUserData);
  return newUserData;
}

// ──────────────────────────────────────────────────────
// REALTIME LISTENERS (optional)
// ──────────────────────────────────────────────────────

function subscribeToInbox(userId, onUpdate) {
  if (!db) {
    console.error('Firebase not initialized');
    return () => {};
  }
  
  return db
    .collection('users')
    .doc(userId)
    .collection('inbox')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      const inbox = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      onUpdate(inbox);
    });
}

// Expose for use in React
window.firebaseDB = {
  init: initializeFirebase,
  saveGift: saveGiftToInbox,
  loadInbox: loadInboxForUser,
  markOpened: markGiftAsOpened,
  deleteGift,
  createUser: createOrGetUser,
  subscribeInbox: subscribeToInbox,
};
