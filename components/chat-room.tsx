import React, { useState, useEffect, useRef, FC } from "react";
import { IChatRoom, IMessage, IUser } from "@/types";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import MessageCard from "./message-card";
import MessageInput from "./message-input";
import { createMessage } from "@/lib/message";

interface IProps {
  currentUser: IUser;
  selectedChatroom: IChatRoom;
}

const ChatRoom: FC<IProps> = ({ currentUser, selectedChatroom }) => {
  const me = selectedChatroom?.myData as IUser;
  const other = selectedChatroom?.otherData;
  const chatRoomId = selectedChatroom.id as string;

  const [messageContent, setMessageContent] = useState<
    string | number | readonly string[] | undefined
  >(undefined);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const messagesContainerRef = useRef(null);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

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

  const sendMessage = async () => {
    if (messageContent == "" && image == "") {
      return;
    }
    await createMessage(chatRoomId, me, messageContent, image!);
    setMessageContent("");
    setImage("");

    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className="flex flex-col h-screen">
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
