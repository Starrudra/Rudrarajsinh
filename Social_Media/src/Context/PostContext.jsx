import { createContext, useState, useEffect } from "react";
import { db } from "../Firebase/Firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export const Post_data = createContext();
export const UserContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const userData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ users }}>
      <Post_data.Provider value={{ posts, setPosts }}>
        {children}
      </Post_data.Provider>
    </UserContext.Provider>
  );
};

export default PostProvider;
