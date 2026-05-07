import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export const saveRoomSession = async (roomId, userName) => {
  await setDoc(doc(db, "rooms", roomId), {
    roomId,
    userName,
    active: true,
    joinedAt: Date.now(),
  });
};

export const getRoomSession = async (roomId) => {
  const roomRef = doc(db, "rooms", roomId);

  const snapshot = await getDoc(roomRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }

  return null;
};

export const removeRoomSession = async (roomId) => {
  await deleteDoc(doc(db, "rooms", roomId));
};