import React, { useState, useEffect, useRef } from "react";
import { db } from "../../Firebase/Firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { auth } from "../../Firebase/Firebase";

const Chat = () => {
  const { chatId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);

  // Get current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch receiver and chat messages
  useEffect(() => {
    if (!chatId || !currentUser) return;

    const users = chatId.split("_");
    const receiverId = users.find((id) => id !== currentUser.uid);
    if (!receiverId) return;

    const fetchReceiver = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", receiverId));
        if (userDoc.exists()) {
          setReceiver({ id: receiverId, ...userDoc.data() });
        }
      } catch (error) {
        console.error("Error fetching receiver data:", error);
      }
    };
    fetchReceiver();

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [chatId, currentUser]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || "Anonymous",
      timestamp: serverTimestamp(),
    });

    await setDoc(doc(db, "chatList", chatId), {
      lastMessage: newMessage,
      timestamp: serverTimestamp(),
      participants: [currentUser.uid, receiver.id],
    });

    setNewMessage("");
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  if (!receiver) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl flex flex-col min-h-screen bg-gray-300 mx-auto">
      {/* Header */}
      <div className="w-5xl flex items-center justify-between bg-gray-400 px-4 py-3 shadow-md fixed top-0 l z-10 mt-16">
        <div>
          <h2 className="text-lg font-bold">{receiver.name || "User"}</h2>
          <p className="text-xs text-gray-500">Chatting now</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mt-40 mb-20 px-4 py-2 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[40%] break-words p-3 rounded-xl ${
              msg.senderId === currentUser?.uid
                ? "bg-blue-500 text-white ml-auto"
                : "bg-white text-gray-800"
            }`}
          >
            <p className="text-sm">{msg.text}</p>
            <p className="text-[10px] mt-1 text-right">{msg.senderName}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="w-5xl flex items-center gap-2 bg-gray-400 p-3 shadow-md fixed bottom-0 z-10">
        <input
          type="text"
          className="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-black text-white rounded-full hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
