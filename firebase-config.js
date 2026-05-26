// firebase-config.js — Firebase Firestore + Auth setup for dear plushie!

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAXIxJ6--uEx6yepoYrJSBl87eppFfj4nU",
  authDomain: "dear-plushie.firebaseapp.com",
  projectId: "dear-plushie",
  storageBucket: "dear-plushie.firebasestorage.app",
  messagingSenderId: "234347046572",
  appId: "1:234347046572:web:68ace8429de5500955a109"
};

let db = null;

async function initializeFirebase() {
  if (db) return db;
  try { firebase.initializeApp(FIREBASE_CONFIG); } catch (e) { /* already init */ }
  db = firebase.firestore();
  return db;
}

// ──────────────────────────────────────────────────────
// INBOX OPERATIONS
// ──────────────────────────────────────────────────────

async function saveGiftToInbox(userId, gift) {
  if (!db) await initializeFirebase();
  const ref = await db.collection('users').doc(userId).collection('inbox').add({
    plushie: gift.plushie,
    message: gift.message,
    from: gift.from,
    when: gift.when || new Date().toISOString(),
    opened: gift.opened || false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  return ref.id;
}

async function loadInboxForUser(userId) {
  if (!db) await initializeFirebase();
  const snap = await db.collection('users').doc(userId).collection('inbox')
    .orderBy('createdAt', 'desc').get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function markGiftAsOpened(userId, giftId) {
  if (!db) await initializeFirebase();
  await db.collection('users').doc(userId).collection('inbox').doc(giftId).update({ opened: true });
}

async function deleteGift(userId, giftId) {
  if (!db) await initializeFirebase();
  await db.collection('users').doc(userId).collection('inbox').doc(giftId).delete();
}

function subscribeToInbox(userId, onUpdate) {
  if (!db) { console.error('Firebase not initialized'); return () => {}; }
  return db.collection('users').doc(userId).collection('inbox')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snap => onUpdate(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
}

// ──────────────────────────────────────────────────────
// PROFILE OPERATIONS
// ──────────────────────────────────────────────────────

function generateShelfCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function isUsernameAvailable(username) {
  if (!db) await initializeFirebase();
  const doc = await db.collection('usernames').doc(username.toLowerCase()).get();
  return !doc.exists;
}

async function createProfile(uid, { displayName, username }) {
  if (!db) await initializeFirebase();
  const uname = username.toLowerCase();

  const usernameDoc = await db.collection('usernames').doc(uname).get();
  if (usernameDoc.exists) throw new Error('username taken');

  let shelfCode = '';
  for (let i = 0; i < 10; i++) {
    const c = generateShelfCode();
    const d = await db.collection('shelfCodes').doc(c).get();
    if (!d.exists) { shelfCode = c; break; }
  }
  if (!shelfCode) throw new Error('could not generate shelf code · try again');

  const now = firebase.firestore.FieldValue.serverTimestamp();
  const profileData = {
    uid, displayName, username: uname, shelfCode,
    bio: '', avatarUrl: '', setupCompleted: true,
    createdAt: now, updatedAt: now,
  };

  const batch = db.batch();
  batch.set(db.collection('profiles').doc(uid), profileData);
  batch.set(db.collection('usernames').doc(uname), { uid });
  batch.set(db.collection('shelfCodes').doc(shelfCode), { uid });
  await batch.commit();

  return { ...profileData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}

async function getProfile(uid) {
  if (!db) await initializeFirebase();
  const doc = await db.collection('profiles').doc(uid).get();
  return doc.exists ? doc.data() : null;
}

async function getProfileByShelfCode(code) {
  if (!db) await initializeFirebase();
  const codeDoc = await db.collection('shelfCodes').doc(code.toUpperCase()).get();
  if (!codeDoc.exists) return null;
  return getProfile(codeDoc.data().uid);
}

async function getProfileByUsername(username) {
  if (!db) await initializeFirebase();
  const doc = await db.collection('usernames').doc(username.toLowerCase()).get();
  if (!doc.exists) return null;
  return getProfile(doc.data().uid);
}

async function updateProfile(uid, updates) {
  if (!db) await initializeFirebase();
  await db.collection('profiles').doc(uid).update({
    ...updates,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

// ──────────────────────────────────────────────────────
// CIRCLE OPERATIONS
// ──────────────────────────────────────────────────────

function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function createCircle(ownerUid, { name, theme }) {
  if (!db) await initializeFirebase();
  let inviteCode = '';
  for (let i = 0; i < 10; i++) {
    const c = generateInviteCode();
    const d = await db.collection('circleInvites').doc(c).get();
    if (!d.exists) { inviteCode = c; break; }
  }
  if (!inviteCode) throw new Error('could not generate invite code · try again');
  const circleRef = db.collection('circles').doc();
  const now = firebase.firestore.FieldValue.serverTimestamp();
  const circleData = {
    id: circleRef.id, name, inviteCode,
    theme: theme || 'rose', ownerUid,
    memberUids: [ownerUid], createdAt: now,
  };
  const batch = db.batch();
  batch.set(circleRef, circleData);
  batch.set(db.collection('circleInvites').doc(inviteCode), { circleId: circleRef.id });
  await batch.commit();
  return { ...circleData, id: circleRef.id, createdAt: new Date().toISOString() };
}

async function joinCircle(uid, inviteCode) {
  if (!db) await initializeFirebase();
  const codeDoc = await db.collection('circleInvites').doc(inviteCode.toUpperCase()).get();
  if (!codeDoc.exists) throw new Error('invite code not found');
  const { circleId } = codeDoc.data();
  const circleRef = db.collection('circles').doc(circleId);
  const circleDoc = await circleRef.get();
  if (!circleDoc.exists) throw new Error('circle not found');
  const circle = circleDoc.data();
  if ((circle.memberUids || []).includes(uid)) throw new Error('already a member');
  await circleRef.update({ memberUids: firebase.firestore.FieldValue.arrayUnion(uid) });
  return { ...circle, id: circleId };
}

async function leaveCircle(uid, circleId) {
  if (!db) await initializeFirebase();
  await db.collection('circles').doc(circleId).update({
    memberUids: firebase.firestore.FieldValue.arrayRemove(uid),
  });
}

async function getCircle(circleId) {
  if (!db) await initializeFirebase();
  const doc = await db.collection('circles').doc(circleId).get();
  return doc.exists ? { ...doc.data(), id: doc.id } : null;
}

async function getCircleByInviteCode(code) {
  if (!db) await initializeFirebase();
  const codeDoc = await db.collection('circleInvites').doc(code.toUpperCase()).get();
  if (!codeDoc.exists) return null;
  return getCircle(codeDoc.data().circleId);
}

async function getCirclesForUser(uid) {
  if (!db) await initializeFirebase();
  const snap = await db.collection('circles')
    .where('memberUids', 'array-contains', uid)
    .orderBy('createdAt', 'desc')
    .get();
  return snap.docs.map(d => ({ ...d.data(), id: d.id }));
}

async function sendToCircleShelf(circleId, { plushie, message, fromUid, displayName, anonymous }) {
  if (!db) await initializeFirebase();
  const ref = await db.collection('circles').doc(circleId).collection('shelf').add({
    plushie, message: message || '',
    fromUid, senderName: anonymous ? null : (displayName || 'someone'),
    anonymous: anonymous || false,
    reactions: {}, openedBy: [],
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  return ref.id;
}

async function reactToCircleShelfItem(circleId, itemId, emoji, uid) {
  if (!db) await initializeFirebase();
  const ref = db.collection('circles').doc(circleId).collection('shelf').doc(itemId);
  const doc = await ref.get();
  if (!doc.exists) return;
  const current = (doc.data().reactions || {})[emoji] || [];
  if (current.includes(uid)) {
    await ref.update({ [`reactions.${emoji}`]: firebase.firestore.FieldValue.arrayRemove(uid) });
  } else {
    await ref.update({ [`reactions.${emoji}`]: firebase.firestore.FieldValue.arrayUnion(uid) });
  }
}

function subscribeToCircleShelf(circleId, onUpdate) {
  if (!db) { console.error('Firebase not initialized'); return () => {}; }
  return db.collection('circles').doc(circleId).collection('shelf')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snap => onUpdate(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
}

async function leaveCircleNote(circleId, text, uid) {
  if (!db) await initializeFirebase();
  await db.collection('circles').doc(circleId).collection('notes').add({
    text, fromUid: uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

function subscribeToCircleNotes(circleId, onUpdate) {
  if (!db) { console.error('Firebase not initialized'); return () => {}; }
  return db.collection('circles').doc(circleId).collection('notes')
    .orderBy('createdAt', 'desc').limit(30)
    .onSnapshot(snap => onUpdate(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
}

// ──────────────────────────────────────────────────────
// FRIENDSHIP OPERATIONS
// ──────────────────────────────────────────────────────

async function addFriend(myUid, friendUid) {
  if (!db) await initializeFirebase();
  if (myUid === friendUid) throw new Error('self');

  const existing = await db.collection('users').doc(myUid).collection('friends').doc(friendUid).get();
  if (existing.exists) throw new Error('duplicate');

  const friendProfile = await getProfile(friendUid);
  if (!friendProfile) throw new Error('not found');

  await db.collection('users').doc(myUid).collection('friends').doc(friendUid).set({
    uid: friendUid,
    displayName: friendProfile.displayName,
    username: friendProfile.username,
    shelfCode: friendProfile.shelfCode,
    addedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

  return friendProfile;
}

async function getFriends(uid) {
  if (!db) await initializeFirebase();
  const snap = await db.collection('users').doc(uid).collection('friends')
    .orderBy('addedAt', 'desc').get();
  return snap.docs.map(d => ({ ...d.data() }));
}

// ──────────────────────────────────────────────────────
// EXPOSE
// ──────────────────────────────────────────────────────

window.firebaseDB = {
  init: initializeFirebase,
  saveGift: saveGiftToInbox,
  loadInbox: loadInboxForUser,
  markOpened: markGiftAsOpened,
  deleteGift,
  subscribeInbox: subscribeToInbox,
  createProfile,
  getProfile,
  getProfileByShelfCode,
  getProfileByUsername,
  updateProfile,
  isUsernameAvailable,
  addFriend,
  getFriends,
  createCircle,
  joinCircle,
  leaveCircle,
  getCircle,
  getCircleByInviteCode,
  getCirclesForUser,
  sendToCircleShelf,
  reactToCircleShelfItem,
  subscribeToCircleShelf,
  leaveCircleNote,
  subscribeToCircleNotes,
};
