"use client";
import { FC } from "react";
import React, { useEffect, useState } from "react";
import { app, firestore } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import ChatRoom from "../components/chat-room";
import Users from "../components/users";
import { IChatRoom, IUser } from "@/types";

const HomePage: FC = () => {
  const auth = getAuth(app);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const router = useRouter();
  const [selectedChatroom, setSelectedChatroom] = useState<IChatRoom | null>(
    null
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(firestore, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const id = docSnap.id;
          const data = docSnap.data() as IUser;
          setCurrentUser({ id, ...data });
        } else {
          console.log("No such document!");
        }
      } else {
        setCurrentUser(null);
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  if (currentUser == null) return <div className="text-4xl">Loading...</div>;

  return (
    <div className="flex h-screen">
      {/* Left side users */}
      <div className="flex-shrink-0 w-3/12">
        <Users
          currentUser={currentUser}
          setSelectedChatroom={setSelectedChatroom}
        />
      </div>

      {/* Right side chat room */}
      <div className="flex-grow w-9/12">
        {selectedChatroom ? (
          <>
            <ChatRoom
              currentUser={currentUser}
              selectedChatroom={selectedChatroom}
            />
          </>
        ) : (
          <>
            <div className="flex items-center justify-center h-full">
              <div className="text-2xl text-gray-400">Select a chatroom</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
