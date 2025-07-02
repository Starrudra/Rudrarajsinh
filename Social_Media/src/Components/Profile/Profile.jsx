import React, { useState, useEffect } from "react";
import Loader from "../Others/Loader";
import { Upload, Pencil } from "lucide-react";
import { RxCross2 } from "react-icons/rx";
import { db } from "../../Firebase/Firebase";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useUser } from "../../Context/UserProfileContext";

const Profile = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const viewOnly = queryParams.get("viewOnly") === "true";

  const { currentUser, userProfile, loading } = useUser();

  const [profilePic, setProfilePic] = useState(null);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [postCount, setPostCount] = useState(0);
  const [userPosts, setUserPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      if (userId && currentUser?.uid !== userId) {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfilePic(data.profilePic || null);
          setBio(data.bio || "");
          setName(data.name || "");
        }
      } else if (userProfile) {
        // Your own profile
        setProfilePic(userProfile.profilePic || null);
        setBio(userProfile.bio || "");
        setName(userProfile.name || "");
      }
    };

    loadProfile();
  }, [userProfile, userId, currentUser]);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      const uid = userId || currentUser?.uid;
      if (!uid) return;

      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const saved = userData?.savedPosts || [];
        setSavedCount(saved.length);
      }
    };

    if (currentUser) {
      fetchSavedPosts();
    }
  }, [currentUser, userId]);
  useEffect(()=>{
    const fetchTotalUsers = async () => {
      const users_collection=await getDocs(collection(db,"users"));
      setTotalUsers(users_collection.size)
    }
    fetchTotalUsers();
  },[totalUsers])

  useEffect(() => {
    const loadPosts = async () => {
      const uid = userId || currentUser?.uid;
      if (!uid) return;

      const q = query(collection(db, "posts"), where("userId", "==", uid));
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostCount(posts.length);
      setUserPosts(posts);
    };

    if (currentUser) {
      loadPosts();
    }
  }, [currentUser, userId]);

  if (loading) return <Loader />;

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file && currentUser?.uid) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        setProfilePic(base64String);
        await setDoc(
          doc(db, "users", currentUser.uid),
          { profilePic: base64String },
          { merge: true }
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setEditing(false);
    if (currentUser?.uid) {
      await setDoc(
        doc(db, "users", currentUser.uid),
        { name, bio },
        { merge: true }
      );
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-white px-4 py-10 mt-20">
      <div className="max-w-3xl mx-auto bg-gray-100 p-8 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <img
              src={profilePic || "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="}
              alt="Profile"
              className="w-38 h-30 rounded-full object-cover border-4 border-blue-600 cursor-pointer"
              onClick={openModal}
            />
            {!viewOnly && (
              <label className="absolute bottom-0 right-0 bg-blue-600 p-1 rounded-full cursor-pointer">
                <Upload className="w-4 h-4 text-white" />
                <input
                  type="file"
                  onChange={handleProfilePicChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="text-center sm:text-left w-full">
            {editing && currentUser?.uid === userId ? (
              <input
                className="text-3xl font-bold w-full text-gray-800 border-b-2 border-blue-500 bg-transparent focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
            )}
            <p className="text-gray-500 mt-1">{postCount} Posts</p>

            {viewOnly && currentUser?.uid !== userId && (
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition"
                onClick={() =>
                  navigate(
                    `/chat/${[currentUser.uid, userId].sort().join("_")}`
                  )
                }
              >
                Message
              </button>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Bio</h2>
          {editing && currentUser?.uid === userId ? (
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          ) : (
            <p className="text-gray-700 text-base leading-relaxed">{bio}</p>
          )}
        </div>

        {(!viewOnly || (viewOnly && currentUser?.uid === userId)) && (
          <div className="flex justify-end mt-4">
            {editing ? (
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition"
                onClick={handleSave}
              >
                Save
              </button>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition flex items-center gap-1"
                onClick={() => setEditing(true)}
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-600">{postCount}</p>
            <p className="text-gray-600 text-sm">Posts</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
            <p className="text-gray-600 text-sm">Connections</p>
          </div>
          <div
            onClick={() => navigate("/saved")}
            className="bg-white rounded-xl p-4 text-center shadow-sm cursor-pointer hover:shadow-md transition"
          >
            <p className="text-2xl font-bold text-blue-600">{savedCount}</p>
            <p className="text-gray-600 text-sm">Saved</p>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Recent Posts
          </h3>

          <div className="grid grid-cols-3 gap-3 min-h-[300px]">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/home?postId=${post.id}`)}
                  className="aspect-square bg-gray-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                >
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                  <div className="p-3">
                    <p className="font-bold text-gray-700 truncate">
                      {post.title}
                    </p>
                    <p className="text-gray-500 text-sm">{post.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 col-span-3 text-center">
                No Posts Yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for larger profile picture */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="relative">
            <img
              src={profilePic}
              alt="Profile"
              className="w-96 h-96 object-contain rounded-xl"
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-black hover:bg-gray-800 rounded-full p-2 transition-all"
            >
              <RxCross2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
