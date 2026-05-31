// Firestore helper functions for Royale Sleepy

import {
  collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc,
  doc, query, orderBy, where, serverTimestamp, limit
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase'

// ---- PRODUCTS ----
export const getProducts = async () => {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const addProduct = async (data) => {
  return await addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() })
}

export const updateProduct = async (id, data) => {
  return await updateDoc(doc(db, 'products', id), data)
}

export const deleteProduct = async (id) => {
  return await deleteDoc(doc(db, 'products', id))
}

// ---- REVIEWS ----
export const getReviews = async () => {
  const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const addReview = async (data) => {
  return await addDoc(collection(db, 'reviews'), { ...data, createdAt: serverTimestamp() })
}

export const updateReview = async (id, data) => {
  return await updateDoc(doc(db, 'reviews', id), data)
}

export const deleteReview = async (id) => {
  return await deleteDoc(doc(db, 'reviews', id))
}

// ---- LEADS ----
export const addLead = async (name, phone) => {
  return await addDoc(collection(db, 'leads'), {
    name, phone, createdAt: serverTimestamp()
  })
}

export const getLeads = async () => {
  const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ---- HOMEPAGE SETTINGS ----
export const getHomepageSettings = async () => {
  const snap = await getDoc(doc(db, 'settings', 'homepage'))
  return snap.exists() ? snap.data() : {}
}

export const updateHomepageSettings = async (data) => {
  return await updateDoc(doc(db, 'settings', 'homepage'), data)
}

// ---- OFFERS ----
export const getOffer = async () => {
  const snap = await getDoc(doc(db, 'settings', 'offer'))
  return snap.exists() ? snap.data() : null
}

export const updateOffer = async (data) => {
  return await updateDoc(doc(db, 'settings', 'offer'), data)
}

// ---- STORAGE UPLOAD ----
export const uploadFile = async (file, path) => {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return await getDownloadURL(storageRef)
}
