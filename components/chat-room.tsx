import React, { useState, useEffect, useRef, FC } from "react";
import { IChatRoom, IMessage, IUser } from "@/types";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import MessageCard from "./message-card";
import MessageInput from "./message-input";

interface IProps {
  currentUser: IUser;
  selectedChatroom: IChatRoom;
}

const ChatRoom: FC<IProps> = ({ currentUser, selectedChatroom }) => {
  const me = selectedChatroom?.myData;
  const other = selectedChatroom?.otherData;
  const chatRoomId = selectedChatroom?.id;

  const [messageContent, setMessageContent] = useState<
    string | number | readonly string[] | undefined
  >(undefined);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const messagesContainerRef = useRef(null);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  //get messages
  useEffect(() => {
    if (!chatRoomId) return;
    const unsubscribe = onSnapshot(
      query(
        collection(firestore, "messages"),
        where("chatRoomId", "==", chatRoomId),
        orderBy("time", "asc")
      ),
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => {
          const data = doc.data() as IMessage;
          return { id: doc.id, ...data };
        });
        setMessages(messages);
      }
    );

    return unsubscribe;
  }, [chatRoomId]);

  //put messages in db
  const sendMessage = async () => {
    const messagesCollection = collection(firestore, "messages");
    // Check if the message is not empty
    if (messageContent == "" && image == "") {
      return;
    }

    try {
      // Add a new message to the Firestore collection
      const newMessage = {
        chatRoomId: chatRoomId,
        sender: me?.id,
        content: messageContent,
        time: serverTimestamp(),
        image,
      };

      await addDoc(messagesCollection, newMessage);
      setMessageContent("");
      setImage("");
      //send to chatroom by chatroom id and update last message
      const chatroomRef = doc(firestore, "chatrooms", chatRoomId!);
      await updateDoc(chatroomRef, {
        lastMessage: messageContent ? messageContent : "Image",
      });

      // Clear the input field after sending the message
    } catch (error) {
      console.error("Error sending message:", error.message);
    }

    // Scroll to the bottom after sending a message
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Messages container with overflow and scroll */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-10">
        {messages?.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            me={me!}
            other={other!}
          />
        ))}
      </div>

      {/* Input box at the bottom */}
      <MessageInput
        sendMessage={sendMessage}
        messageContent={messageContent}
        setMessageContent={setMessageContent}
        image={image}
        setImage={setImage}
      />
    </div>
  );
};

export default ChatRoom;
