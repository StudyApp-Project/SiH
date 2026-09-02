/**
 * Firestore Helper Utilities
 * 
 * Centralized collection references, CRUD helpers, and timestamp utilities
 * used across all contexts.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  writeBatch,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// ─── COLLECTION REFERENCES ───

export const usersRef = collection(db, 'users');
export const roomsRef = collection(db, 'rooms');
export const notesRef = collection(db, 'notes');
export const flashcardDecksRef = collection(db, 'flashcardDecks');
export const quizzesRef = collection(db, 'quizzes');
export const doubtsRef = collection(db, 'doubts');
export const filesRef = collection(db, 'files');

// ─── SUBCOLLECTION HELPERS ───

/** Get a subcollection reference inside a room */
export const roomClassrooms = (roomId) => collection(db, 'rooms', roomId, 'classrooms');
export const roomMembers = (roomId) => collection(db, 'rooms', roomId, 'members');
export const roomMessages = (roomId) => collection(db, 'rooms', roomId, 'messages');

/** Get a subcollection reference inside a doubt */
export const doubtAnswers = (doubtId) => collection(db, 'doubts', doubtId, 'answers');

/** Get user subcollections */
export const userTasks = (uid) => collection(db, 'users', uid, 'tasks');
export const userNotifications = (uid) => collection(db, 'users', uid, 'notifications');
export const userVotes = (uid) => collection(db, 'users', uid, 'votes');
export const userFolders = (uid) => collection(db, 'users', uid, 'folders');

// ─── DOCUMENT HELPERS ───

/** Get a single document reference */
export const userDoc = (uid) => doc(db, 'users', uid);
export const roomDoc = (roomId) => doc(db, 'rooms', roomId);
export const noteDoc = (noteId) => doc(db, 'notes', noteId);
export const flashcardDeckDoc = (deckId) => doc(db, 'flashcardDecks', deckId);
export const quizDoc = (quizId) => doc(db, 'quizzes', quizId);
export const doubtDoc = (doubtId) => doc(db, 'doubts', doubtId);
export const fileDoc = (fileId) => doc(db, 'files', fileId);

// ─── TIMESTAMP HELPERS ───

/** Get a Firestore server timestamp */
export const now = () => serverTimestamp();

/** Convert a Firestore Timestamp to a relative time string */
export function timeAgo(timestamp) {
  if (!timestamp) return 'just now';
  
  const date = timestamp instanceof Timestamp 
    ? timestamp.toDate() 
    : new Date(timestamp);
  
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
  return date.toLocaleDateString();
}

/** Convert Firestore Timestamp to ISO string */
export function toISO(timestamp) {
  if (!timestamp) return new Date().toISOString();
  if (timestamp instanceof Timestamp) return timestamp.toDate().toISOString();
  return new Date(timestamp).toISOString();
}

// ─── CRUD WRAPPERS ───

/** Fetch a single document and return its data with id */
export async function fetchDoc(docRef) {
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/** Fetch all documents in a query and return as array */
export async function fetchQuery(q) {
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Create a document with auto-generated ID */
export async function createDoc(collectionRef, data) {
  const docRef = await addDoc(collectionRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/** Create a document with a specific ID */
export async function createDocWithId(docRef, data) {
  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

/** Update fields on an existing document */
export async function patchDoc(docRef, updates) {
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/** Delete a document */
export async function removeDoc(docRef) {
  await deleteDoc(docRef);
}

/** Batch write helper — execute multiple writes atomically */
export async function batchWrite(operations) {
  const batch = writeBatch(db);
  for (const op of operations) {
    if (op.type === 'set') batch.set(op.ref, op.data);
    if (op.type === 'update') batch.update(op.ref, op.data);
    if (op.type === 'delete') batch.delete(op.ref);
  }
  await batch.commit();
}

// Re-export commonly used Firestore functions for convenience
export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  writeBatch,
  Timestamp,
  arrayUnion,
  arrayRemove,
};
