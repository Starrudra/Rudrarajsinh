import React, { useEffect, useState } from "react";
import { auth, db } from "../../Firebase/Firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ChatSidebar = () => {
  const [recentChats, setRecentChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        fetchChats(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchChats = async (uid) => {
    const chatQuery = query(collection(db, "chats"));
    const chatSnapshot = await getDocs(chatQuery);

    const usersSnap = await getDocs(collection(db, "users"));
    const userDocs = usersSnap.docs;

    const chats = chatSnapshot.docs
      .filter((docSnap) => docSnap.id.includes(uid))
      .map((docSnap) => {
        const chatId = docSnap.id;
        const otherUserId = chatId.split("_").find((id) => id !== uid);
        const otherUser = userDocs.find((doc) => doc.id === otherUserId)?.data();

        return otherUser
          ? {
              chatId,
              name: otherUser.name,
              photoURL: otherUser.photoURL || "",
              lastMessage: docSnap.data().lastMessage || "No messages yet", 
            }
          : null;
      })
      .filter(Boolean);

    setRecentChats(chats);
  };

  return (
    <div className="w-80 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl h-screen pt-8 pb-6 px-6 fixed left-0 top-0 z-20 overflow-y-auto">
      <h2 className="text-3xl font-bold mb-6 text-white text-center tracking-wide">
        Recent Chats
      </h2>

      <div className="space-y-6">
        {recentChats.length === 0 ? (
          <p className="text-gray-300 text-center text-sm italic">
            No recent chats found.
          </p>
        ) : (
          recentChats.map((chat) => (
            <div
              key={chat.chatId}
              onClick={() => navigate(`/chat/${chat.chatId}`)}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 hover:from-purple-700 hover:to-purple-800 transition rounded-xl cursor-pointer shadow-md hover:shadow-2xl transform hover:scale-105"
            >
              {chat.photoURL ? (
                <img
                  src={chat.photoURL}
                  alt={chat.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg"
                />
              ) : (
                <div className="w-14 h-14 bg-blue-500 text-white flex items-center justify-center rounded-full text-xl font-semibold shadow-lg">
                  {chat.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-white truncate">
                  {chat.name}
                </p>
                <p className="text-sm text-gray-300 truncate italic">
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;