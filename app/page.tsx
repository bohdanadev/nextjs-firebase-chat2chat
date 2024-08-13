"use client";
import { FC } from "react";
import React, { useEffect, useState } from "react";
import { app } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import ChatRoom from "../components/chat-room";
import Users from "../components/users";
import { IChatRoom, IUser } from "@/types";
import { getUser } from "@/lib/user";
import Spinner from "@/components/spinner";

const HomePage: FC = () => {
  const auth = getAuth(app);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [selectedChatroom, setSelectedChatroom] = useState<IChatRoom | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const user = (await getUser(currentUser)) as IUser;
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  if (currentUser == null) return <Spinner />;

  return (
    <div className="flex h-screen">
      <div className="flex-shrink-0 w-3/12">
        <Users
          currentUser={currentUser}
          setSelectedChatroom={setSelectedChatroom}
        />
      </div>

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
