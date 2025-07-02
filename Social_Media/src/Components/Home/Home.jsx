import React, { useContext, useState, useEffect } from "react";
import { Post_data, UserContext } from "../../Context/PostContext";
import { db, auth } from "../../Firebase/Firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../Others/Loader";
import { FaHeart, FaRegHeart, FaCommentAlt } from "react-icons/fa";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

const Home = () => {
  const { posts } = useContext(Post_data);
  const { users } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [visiblePosts, setVisiblePosts] = useState(7);
  const [showMoreComments, setShowMoreComments] = useState({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [heartAnimations, setHeartAnimations] = useState({});
  const [replyBoxes, setReplyBoxes] = useState({});

  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMorePosts();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [posts.length]);


  useEffect(() => {
    const params = new URLSearchParams(location.search); // Get URL search params
    const postIdFromUrl = params.get("postId"); // Get postId from URL
  
    if (postIdFromUrl) {
      const scrollToPost = () => {
        const postElement = document.getElementById(postIdFromUrl);
        if (postElement) {
          postElement.scrollIntoView({ behavior: "smooth" });
          return true; // Post found and scrolled
        }
        return false; // Post not found
      };
  
      const interval = setInterval(() => {
        if (scrollToPost()) {
          clearInterval(interval); // Stop checking once the post is found
        } else {
          // If the post is not found, trigger loading more posts
          if (visiblePosts < posts.length) {
            setVisiblePosts((prev) => prev + 5); // Load more posts
          }
        }
      }, 100); // Check every 100ms
  
      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [location.search, posts, visiblePosts]); // Run when URL, posts, or visiblePosts change

  const toggleSavePost = async (postId) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const currentUserData = users.find((u) => u.id === user.uid);
    const alreadySaved = (currentUserData?.savedPosts || []).includes(postId);

    await updateDoc(userRef, {
      savedPosts: alreadySaved ? arrayRemove(postId) : arrayUnion(postId),
    });
  };

  const loadMorePosts = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisiblePosts((prev) => prev + 5);
      setLoadingMore(false);
    }, 500);
  };

  const toggleLike = async (post) => {
    if (!user) return;
    const postRef = doc(db, "posts", post.id);
    const alreadyLiked = (post.likes || []).includes(user.uid);
    await updateDoc(postRef, {
      likes: alreadyLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });
  };

  const handleAddComment = async (postId, commentText) => {
    if (!user) return;
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comments: arrayUnion({
        userName: user.displayName || "User",
        text: commentText,
        replies: [],
      }),
    });
  };

  const handleAddReply = async (postId, parentCommentIndex, replyText) => {
    if (!user) return;

    const post = posts.find((p) => p.id === postId);
    const updatedComments = [...(post.comments || [])];

    const parentComment = updatedComments[parentCommentIndex];
    if (!parentComment.replies) parentComment.replies = [];

    parentComment.replies.push({
      userName: user.displayName || "User",
      text: replyText,
    });

    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comments: updatedComments,
    });
  };

  const handlePostClick = (userId) => {
    navigate(`/profile/${userId}?viewOnly=true`);
  };

  const handleDoubleClick = (postId, isLiked, post) => {
    if (!isLiked) toggleLike(post);
    setHeartAnimations((prev) => ({ ...prev, [postId]: true }));
    setTimeout(() => {
      setHeartAnimations((prev) => ({ ...prev, [postId]: false }));
    }, 1000);
  };

  const displayedPosts = [];
  for (let i = 0; i < visiblePosts; i++) {
    displayedPosts.push(posts[i % posts.length]);
  }

  if (!posts.length) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 py-20 px-4">
      <div className="max-w-2xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Explore Community Posts
        </h1>

        {displayedPosts.map((post) => {
          const postAuthor = users.find((u) => u.id === post.userId);
          const isLiked = post.likes?.includes(user?.uid);
          const showHeart = heartAnimations[post.id];

          return (
            <motion.div
              key={post.id}
              id={post.id} 
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="p-4 flex items-center gap-3">
                <img
                  src={postAuthor?.profilePic || "/default-avatar.png"}
                  className="w-12 h-12 rounded-full  cursor-pointer"
                  onClick={() => handlePostClick(post.userId)}
                />
                <div>
                  <h2
                    className="font-semibold text-lg cursor-pointer hover:underline text-blue-600"
                    onClick={() => handlePostClick(post.userId)}
                  >
                    {postAuthor?.name || post.userName || "Unknown User"}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {new Date(post.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              {post.image && (
                <div className="relative">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full max-h-[500px] object-cover select-none"
                    onDoubleClick={() =>
                      handleDoubleClick(post.id, isLiked, post)
                    }
                  />
                  {showHeart && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <FaHeart className="text-red-400 drop-shadow-2xl text-7xl" />
                    </motion.div>
                  )}
                </div>
              )}

              <div className="px-4 pt-3 pb-1 space-y-2">
                <p className="text-gray-800 text-base">{post.caption}</p>

                <div className="flex items-center gap-6 mt-2">
                  <motion.button
                    whileTap={{ scale: 1.2 }}
                    onClick={() => toggleLike(post)}
                    className="flex items-center gap-1 text-sm"
                  >
                    {isLiked ? (
                      <FaHeart className="text-red-500 text-2xl" />
                    ) : (
                      <FaRegHeart className="text-gray-500 text-2xl" />
                    )}
                    <span className="text-gray-700">
                      {post.likes?.length || 0} likes
                    </span>
                  </motion.button>

                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <FaCommentAlt className="text-blue-500 text-2xl" />
                    <span>{post.comments?.length || 0} comments</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 1.2 }}
                    onClick={() => toggleSavePost(post.id)}
                    className="flex items-center gap-1 text-sm"
                  >
                    {(
                      users.find((u) => u.id === user?.uid)?.savedPosts || []
                    ).includes(post.id) ? (
                      <BsBookmarkFill className="text-blue-600 text-xl" />
                    ) : (
                      <BsBookmark className="text-gray-500 text-xl" />
                    )}
                  </motion.button>
                </div>

                <div className="space-y-2">
                  {(post.comments || [])
                    .slice(0, showMoreComments[post.id] ? undefined : 1)
                    .map((comment, i) => (
                      <div
                        key={i}
                        className="text-sm bg-gray-100 rounded-lg p-3 space-y-1"
                      >
                        <div className="text-gray-800">
                          <span className="font-semibold">
                            {comment.userName}:
                          </span>{" "}
                          {comment.text}
                        </div>

                        {/* Reply Button */}
                        <button
                          onClick={() =>
                            setReplyBoxes((prev) => ({
                              ...prev,
                              [`${post.id}-${i}`]: !prev[`${post.id}-${i}`],
                            }))
                          }
                          className="text-xs text-blue-500 hover:underline"
                        >
                          Reply
                        </button>

                        {/* Show Replies if Exist */}
                        {comment.replies?.map((reply, ri) => (
                          <div
                            key={ri}
                            className="ml-4 mt-1 text-gray-700 text-sm bg-white rounded px-2 py-1"
                          >
                            <span className="font-medium">
                              {reply.userName}:
                            </span>{" "}
                            {reply.text}
                          </div>
                        ))}

                        {/* Reply Input */}
                        {replyBoxes[`${post.id}-${i}`] && (
                          <ReplyInput
                            onSubmit={(replyText) =>
                              handleAddReply(post.id, i, replyText)
                            }
                          />
                        )}
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
                      className="text-sm text-blue-500 hover:underline"
                    >
                      {showMoreComments[post.id]
                        ? "Show less"
                        : "View more comments"}
                    </button>
                  )}
                </div>

                <AddCommentForm
                  onSubmit={(text) => handleAddComment(post.id, text)}
                />
              </div>
            </motion.div>
          );
        })}

        {loadingMore && (
          <div className="text-center mt-6">
            <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading more posts...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

// Simple AddCommentForm component inside same file or import it externally
const AddCommentForm = ({ onSubmit }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit(comment.trim());
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4 mb-4">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none"
        placeholder="Add a comment..."
      />
      <button
        type="submit"
        className="px-3 py-2 text-white bg-blue-500 rounded-lg text-sm hover:bg-blue-600"
      >
        Post
      </button>
    </form>
  );
};

const ReplyInput = ({ onSubmit }) => {
  const [reply, setReply] = useState("");

  const handleReply = (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    onSubmit(reply.trim());
    setReply("");
  };

  return (
    <form onSubmit={handleReply} className="flex gap-2 mt-2 ml-4">
      <input
        type="text"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
        placeholder="Write a reply..."
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
      >
        Reply
      </button>
    </form>
  );
};
