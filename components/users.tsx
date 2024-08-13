"use client";
import { FC, useEffect, useState } from "react";
import { firestore, app } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  serverTimestamp,
  where,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import UserCard from "./user-card";
import { IChatRoom, IUser } from "@/types";

interface IProps {
  currentUser: IUser;
  setSelectedChatroom: React.Dispatch<React.SetStateAction<IChatRoom | null>>;
}

const Users: FC<IProps> = ({ currentUser, setSelectedChatroom }) => {
  const [activeTab, setActiveTab] = useState<string>("chatrooms");
  const [loading, setLoading] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [userChatrooms, setUserChatrooms] = useState<IChatRoom[]>([]);
  const router = useRouter();
  const auth = getAuth(app);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setLoading2(true);
    const tasksQuery = query(collection(firestore, "users"));

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const users = snapshot.docs.map((doc) => {
          const data = doc.data() as IUser;
          return { id: doc.id, ...data };
        });
        setUsers(users);
        setLoading2(false);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setLoading(true);
    if (!currentUser?.id) return;
    const chatroomsQuery = query(
      collection(firestore, "chatrooms"),
      where("users", "array-contains", currentUser.id)
    );
    const unsubscribeChatrooms = onSnapshot(chatroomsQuery, (snapshot) => {
      const chatrooms = snapshot.docs.map((doc) => {
        const data = doc.data() as IChatRoom;
        return { id: doc.id, ...data };
      });
      setLoading(false);
      setUserChatrooms(chatrooms);
    });

    return () => unsubscribeChatrooms();
  }, [currentUser]);

  const createChat = async (user: IUser) => {
    const existingChatroomsQuery = query(
      collection(firestore, "chatrooms"),
      where("users", "==", [currentUser.id, user.id])
    );

    try {
      const existingChatroomsSnapshot = await getDocs(existingChatroomsQuery);

      if (existingChatroomsSnapshot.docs.length > 0) {
        toast.error("Chatroom already exists for these users.");
        return;
      }

      const usersData = {
        [currentUser.id!]: currentUser,
        [user.id!]: user,
      };

      const chatroomData = {
        users: [currentUser.id!, user.id!],
        usersData,
        timestamp: serverTimestamp(),
        lastMessage: null,
      };

      const chatroomRef = await addDoc(
        collection(firestore, "chatrooms"),
        chatroomData
      );
      setActiveTab("chatrooms");
    } catch (error) {
      console.error("Error creating or checking chatroom:", error);
    }
  };

  const openChat = async (chatroom: IChatRoom) => {
    const otherUser = chatroom.users?.find(
      (id) => id !== currentUser.id
    ) as string;
    const data = {
      id: chatroom.id,
      myData: currentUser,
      otherData: chatroom.usersData[otherUser],
      ...chatroom,
    };
    setSelectedChatroom(data);
  };

  const logoutClick = () => {
    signOut(auth)
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div className="shadow-lg h-screen overflow-auto mt-4 mb-20">
      <div className="flex flex-col lg:flex-row justify-between p-4 space-y-4 lg:space-y-0">
        <button
          className={`btn btn-outline ${
            activeTab === "users" ? "btn-primary" : ""
          }`}
          onClick={() => handleTabClick("users")}
        >
          Users
        </button>
        <button
          className={`btn btn-outline ${
            activeTab === "chatrooms" ? "btn-primary" : ""
          }`}
          onClick={() => handleTabClick("chatrooms")}
        >
          Chatrooms
        </button>
        <button className={`btn btn-outline`} onClick={logoutClick}>
          Logout
        </button>
      </div>

      <div>
        {activeTab === "chatrooms" && (
          <>
            <h1 className="px-4 text-base font-semibold">Chatrooms</h1>
            {loading && (
              <div className="flex justify-center items-center h-full">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            )}
            {userChatrooms.map((chatroom) => (
              <div
                key={chatroom.id}
                onClick={() => {
                  openChat(chatroom);
                }}
              >
                <UserCard
                  name={
                    chatroom.usersData[
                      chatroom.users.find((id) => id !== currentUser?.id)
                    ].name
                  }
                  avatarUrl={
                    chatroom.usersData[
                      chatroom.users.find((id) => id !== currentUser?.id)
                    ].avatarUrl
                  }
                  latestMessage={chatroom.lastMessage}
                  type={"chat"}
                />
              </div>
            ))}
          </>
        )}

        {activeTab === "users" && (
          <>
            <h1 className="mt-4 px-4 text-base font-semibold">Users</h1>
            {loading2 && (
              <div className="flex justify-center items-center h-full">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            )}
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  createChat(user);
                }}
              >
                {user.id !== currentUser?.id && (
                  <UserCard
                    name={user.name}
                    avatarUrl={user.avatarUrl}
                    latestMessage={null}
                    type="users"
                  />
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
