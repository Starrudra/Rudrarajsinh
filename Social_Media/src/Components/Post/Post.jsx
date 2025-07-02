import React, { useState, useEffect, useContext } from "react";
import { db, auth } from "../../Firebase/Firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Post_data } from "../../Context/PostContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Post = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [user, setUser] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showMoreComments, setShowMoreComments] = useState({});

  const { posts } = useContext(Post_data);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubAuth()
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size > 1 * 1024 * 1024) {
      toast.error("Image size should be less than 1 MB");
      return;
    }

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handlePost = async () => {
    if (!caption) return;

    const post = {
      caption,
      userId: user?.uid,
      userName: user?.displayName || "User",
      image: preview,
      timestamp: Date.now(),
      likes: [],
      comments: [],
    };

    try {
      await addDoc(collection(db, "posts"), post);
      toast.success("Post created successfully");
      setCaption("");
      setImage(null);
      setPreview("");
      setShowPostForm(false);
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "posts", id));
  };

  const handleEdit = (post) => {
    setCaption(post.caption);
    setPreview(post.image);
    setEditingPostId(post.id);
    setShowPostForm(true);
  };

  const handleUpdate = async () => {
    if (editingPostId) {
      const postRef = doc(db, "posts", editingPostId);
      await updateDoc(postRef, {
        caption,
        image: preview,
      });
      setEditingPostId(null);
      setCaption("");
      setPreview("");
      setShowPostForm(false);
    }
  };

  const toggleLike = async (post) => {
    const postRef = doc(db, "posts", post.id);
    const alreadyLiked = (post.likes || []).includes(user?.uid);

    if (alreadyLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(user.uid),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user.uid),
      });
    }
  };

  const handleAddComment = async (postId, commentText) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comments: arrayUnion({
        userName: user?.displayName || "User",
        text: commentText,
      }),
    });
  };

  const userPosts = user
    ? posts.filter((post) => post.userId === user.uid)
    : [];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10 mt-20">
      {!showPostForm && (
        <div className="text-center">
          <button
            onClick={() => setShowPostForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Create New Post
          </button>
        </div>
      )}

      {showPostForm && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="bg-white p-6 rounded-2xl shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            {editingPostId ? "Edit Post" : "New Post"}
          </h2>

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-4 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
            placeholder="What's on your mind?"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="upload-img"
          />
          <label
            htmlFor="upload-img"
            className="cursor-pointer text-blue-500 block text-center mb-4"
          >
            {image ? "Change Image" : "Upload Image"}
          </label>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="rounded-lg mb-4 max-h-[400px] object-contain mx-auto"
            />
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setShowPostForm(false)}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={editingPostId ? handleUpdate : handlePost}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingPostId ? "Update" : "Post"}
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-8">
        {userPosts.length === 0 ? (
          <p className="text-center text-gray-500">
            No posts yet! Create your first one
          </p>
        ) : (
          userPosts
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((post) => (
              <div key={post.id} className="bg-white rounded-2xl p-5 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">{post.userName}</h3>
                  <div className="space-x-4 text-sm">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {post.image && (
                  <div className="rounded-lg overflow-hidden mb-4">
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full h-auto max-h-[500px] object-contain mx-auto"
                    />
                  </div>
                )}

                <p className="mb-4">{post.caption}</p>

                <motion.button
                  whileTap={{ scale: 1.5 }}
                  onClick={() => toggleLike(post)}
                  className="flex items-center space-x-2 mb-4"
                >
                  <span
                    className={`text-2xl ${
                      post.likes?.includes(user?.uid)
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {post.likes?.includes(user?.uid) ? <FaHeart /> : <FaRegHeart />}
                  </span>
                  <span>{(post.likes || []).length} likes</span>
                </motion.button>

                <div className="space-y-2">
                  {(post.comments || [])
                    .slice(0, showMoreComments[post.id] ? undefined : 1)
                    .map((comment, idx) => (
                      <div key={idx} className="bg-gray-100 p-2 rounded-lg">
                        <span className="font-semibold">
                          {comment.userName}:
                        </span>{" "}
                        {comment.text}
                      </div>
                    ))}

                  {(post.comments || []).length > 1 && (
                    <button
                      onClick={() =>
                        setShowMoreComments((prev) => ({
                          ...prev,
                          [post.id]: !prev[post.id],
                        }))
                      }
                      className="text-blue-500 text-sm mt-2"
                    >
                      {showMoreComments[post.id]
                        ? "Show less comments"
                        : "Show more comments"}
                    </button>
                  )}
                </div>

                <AddCommentForm
                  onSubmit={(text) => handleAddComment(post.id, text)}
                />
              </div>
            ))
        )}
      </div>
    </div>
  );
};

const AddCommentForm = ({ onSubmit }) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onSubmit(commentText);
    setCommentText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex mt-4 space-x-2">
      <input
        type="text"
        placeholder="Add a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Post
      </button>
    </form>
  );
};

export default Post;
