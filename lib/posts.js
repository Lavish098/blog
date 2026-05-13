"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseDb, getFirebaseStorage } from "@/lib/firebase/client";

const POSTS_COLLECTION = "blogPosts";

function toPost(docSnapshot) {
  const data = docSnapshot.data();
  const date = data.date?.toDate ? data.date.toDate() : data.date ? new Date(data.date) : null;

  return {
    id: docSnapshot.id,
    blogID: data.blogID || docSnapshot.id,
    blogTitle: data.blogTitle || "Untitled post",
    blogHTML: data.blogHTML || "",
    blogCoverPhoto: data.blogCoverPhoto || "",
    blogCoverPhotoName: data.blogCoverPhotoName || "",
    profileId: data.profileId || "",
    date,
    dateLabel: date
      ? date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "Draft"
  };
}

export async function fetchPosts() {
  const db = getFirebaseDb();
  const postsQuery = query(collection(db, POSTS_COLLECTION), orderBy("date", "desc"));
  const snapshot = await getDocs(postsQuery);
  return snapshot.docs.map(toPost);
}

export async function uploadPostImage(file, folder = "documents/blogPostPhotos") {
  const storage = getFirebaseStorage();
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const imageRef = ref(storage, `${folder}/${safeName}`);
  await uploadBytes(imageRef, file);

  return {
    url: await getDownloadURL(imageRef),
    name: safeName
  };
}

export async function createPost({ title, html, coverFile, profileId }) {
  const db = getFirebaseDb();
  const cover = await uploadPostImage(coverFile, "document/BlogCoverPhotos");
  const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
    blogID: "",
    blogHTML: html,
    blogCoverPhoto: cover.url,
    blogCoverPhotoName: cover.name,
    blogTitle: title,
    profileId,
    date: serverTimestamp()
  });

  await updateDoc(docRef, { blogID: docRef.id });
  return docRef.id;
}

export async function updatePost(postId, { title, html, coverFile }) {
  const db = getFirebaseDb();
  const payload = {
    blogHTML: html,
    blogTitle: title
  };

  if (coverFile) {
    const cover = await uploadPostImage(coverFile, "document/BlogCoverPhotos");
    payload.blogCoverPhoto = cover.url;
    payload.blogCoverPhotoName = cover.name;
  }

  await updateDoc(doc(db, POSTS_COLLECTION, postId), payload);
}

export async function deletePost(postId) {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, POSTS_COLLECTION, postId));
}
