"use client";

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

export function getInitials(firstName = "", lastName = "") {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "SB";
}

export async function fetchUserProfile(uid) {
  const db = getFirebaseDb();
  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  };
}

export async function createUserProfile(uid, profile) {
  const db = getFirebaseDb();
  await setDoc(doc(db, "users", uid), profile);
}

export async function updateUserProfile(uid, profile) {
  const db = getFirebaseDb();
  await updateDoc(doc(db, "users", uid), profile);
}
