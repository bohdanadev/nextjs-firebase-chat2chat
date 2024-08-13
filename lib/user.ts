import { auth, firestore } from "@/lib/firebase";
import { IUser } from "@/types";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const createUser = async (
  email: string,
  password: string,
  name: string,
  avatarUrl: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  const docRef = doc(firestore, "users", user.uid);
  return await setDoc(docRef, {
    name,
    email: email,
    avatarUrl,
    status: "online",
  });
};

export const signin = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  return user;
};

export const getUser = async (currentUser: User) => {
  const docRef = doc(firestore, "users", currentUser.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const id = docSnap.id;
    const data = docSnap.data() as IUser;
    return { id, ...data };
  } else {
    throw new Error("Document not found");
  }
};
