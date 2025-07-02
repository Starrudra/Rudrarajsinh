import React, { useContext, useEffect, useState } from "react";
import { Post_data, UserContext } from "../../Context/PostContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Firebase/Firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../Others/Loader";

const SavedPosts = () => {
  const { posts } = useContext(Post_data); // Fetch all posts from context
  const { users } = useContext(UserContext); // Fetch all users from context
  const [user, setUser] = useState(null); // State to store the current logged-in user
  const navigate = useNavigate();

  // Listen for authentication state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser); // Set the current user when authenticated
    });
    return () => unsub(); // Cleanup the listener on component unmount
  }, []);

  // Show loader if user, posts, or users data is not yet available
  if (!user || !posts.length || !users.length) return <Loader />;

  // Find the current user's data from the users context
  const currentUser = users.find((u) => u.id === user.uid);
  const savedPostIds = currentUser?.savedPosts || []; // Get saved post IDs from the user's data
  const savedPosts = posts.filter((post) => savedPostIds.includes(post.id)); // Filter posts that match saved post IDs

  return (
    <div className="min-h-screen bg-gray-100 py-20 px-4">
      <div className="max-w-2xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Saved Posts
        </h1>

        {savedPosts.length === 0 ? (
          <p className="text-center text-gray-500">No saved posts yet.</p>
        ) : (
          savedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              {/* Reuse UI similar to Home page */}
              <img
                src={post.image}
                alt="Saved"
                className="w-full object-cover max-h-[400px] cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={()=> navigate(`/home?postId=${post.id}`)} // Navigate to post details on click

              />
              <div className="p-4">
                <p className="text-lg font-semibold">{post.caption}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedPosts;