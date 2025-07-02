import React, { useEffect, useState } from "react";
import { db, auth } from "../../Firebase/Firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Track the authenticated user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch chatList documents where the user is a participant
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "chatList"),
      where("participants", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatItems = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const chatData = docSnap.data();
          const chatId = docSnap.id;

          const otherUserId = chatData.participants.find(
            (id) => id !== currentUser.uid
          );

          let name = "Unknown User";
          if (otherUserId) {
            const userDoc = await getDoc(doc(db, "users", otherUserId));
            if (userDoc.exists()) {
              name = userDoc.data().name || "Unnamed User";
            }
          }

          return {
            id: chatId,
            name,
            lastMessage: chatData.lastMessage || "Start chatting...",
            timestamp: chatData.timestamp,
          };
        })
      );

      // Sort by most recent message
      setChats(
        chatItems.sort(
          (a, b) =>
            (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
        )
      );
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-20 mt-22">
      <h2 className="text-2xl font-bold mb-6">Your Chats</h2>
      <div className="space-y-4">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md cursor-pointer transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{chat.name}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {chat.timestamp
                    ? new Date(
                        chat.timestamp.seconds * 1000
                      ).toLocaleTimeString()
                    : ""}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No chats found</p>
        )}
      </div>
    </div>
  );
};

export default ChatList;
