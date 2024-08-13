import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { IUser } from "@/types";

export const createMessage = async (
  chatRoomId: string,
  me: IUser,
  messageContent: string | number | readonly string[] | undefined,
  image: string
) => {
  const messagesCollection = collection(firestore, "messages");
  try {
    const newMessage = {
      chatRoomId: chatRoomId,
      sender: me?.id,
      content: messageContent,
      time: serverTimestamp(),
      image,
    };

    await addDoc(messagesCollection, newMessage);

    const chatroomRef = doc(firestore, "chatrooms", chatRoomId!);
    await updateDoc(chatroomRef, {
      lastMessage: messageContent ? messageContent : "Image",
    });
  } catch (error) {
    throw new Error("Error sending message:", error.message);
  }
};
