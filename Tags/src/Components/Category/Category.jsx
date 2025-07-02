import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; 

  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      navigate("/signin");
      return;
    }

    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
      const key = `categories_${user.email}`;
      const storedCategories = JSON.parse(localStorage.getItem(key));
      if (storedCategories) {
        setCategories(storedCategories);
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (currentUser && currentUser.email) {
      const key = `categories_${currentUser.email}`;
      localStorage.setItem(key, JSON.stringify(categories));
    }
  }, [categories, currentUser]);

  const filterCat = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filterCat.length / itemsPerPage);

  const pageCategories = filterCat.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleForm = () => {
    setShowForm(!showForm);
    setFormData({ name: "", description: "" });
    setEditIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = () => {
    if (!formData.name.trim()) {
      return toast.error("Category name is required!");
    }
  
    for (const category of categories) {
      if (
        category.name &&
        category.name.toLowerCase() === formData.name.toLowerCase()
      ) {
        return toast.error("Category with the same name already exists!");
      }
    }

    if (editIndex !== null) {
      const updated = [...categories];
      updated[editIndex] = formData;
      setCategories(updated);
      setEditIndex(null);
    } else {
      setCategories([...categories, formData]);
      toast.success("Category added successfully!");
    }

    setFormData({ name: "", description: "" });
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setFormData(categories[index]);
    setShowForm(true);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
  };

  const goToTags = (categoryName) => {
    navigate(`/tags/${encodeURIComponent(categoryName)}`);
  };

  // Handle individual checkbox toggle
  const handleCheckboxChange = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((categoryId) => categoryId !== id)
        : [...prev, id] 
    );
  };

  // Handle main checkbox toggle
  const handleMainCheckboxChange = () => {
    if (selectedCategories.length === pageCategories.length) {
      setSelectedCategories([]);
    } else {
      
      setSelectedCategories(pageCategories.map((cat) => cat.name));
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 text-white w-full">
      <h1 className="text-3xl font-semibold mb-6">Category</h1>

      
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#333b46] text-white px-4 py-2 rounded-xl w-1/3 outline-none"
        />

        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
          onClick={toggleForm}
        >
          {showForm ? "Cancel" : "Create New Category"}
        </button>
      </div>

      
      {showForm && (
        <div className="bg-[#2d3748] p-4 rounded-xl mb-6 flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            className="px-3 py-2 rounded-md bg-[#4a5568] text-white outline-none"
            value={formData.name}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            className="px-3 py-2 rounded-md bg-[#4a5568] text-white outline-none resize-none"
            value={formData.description}
            onChange={handleChange}
          />
          <button
            onClick={handleSubmit}
            className="self-start bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            {editIndex !== null ? "Update" : "Add"} Category
          </button>
        </div>
      )}

    
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#1f2937] rounded-xl">
          <thead>
            <tr className="text-left text-gray-300 border-gray-600">
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={
                    selectedCategories.length === pageCategories.length &&
                    pageCategories.length > 0
                  }
                  onChange={handleMainCheckboxChange}
                />
              </th>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {pageCategories.length > 0 ? (
              pageCategories.map((cat, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-700 hover:bg-[#2c3a4b]"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => handleCheckboxChange(cat.name)}
                    />
                  </td>
                  <td
                    className="p-3 cursor-pointer text-blue-400 hover:underline"
                    onClick={() => goToTags(cat.name)}
                  >
                    {cat.name}
                  </td>
                  <td className="p-3">{cat.description || "-"}</td>
                  <td className="p-3 flex gap-5">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-400 hover:text-blue-600 text-xl"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-400 hover:text-red-600 text-xl"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-gray-500" colSpan={4}>
                  {searchQuery
                    ? "No matching categories found."
                    : "No categories found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Page Controls */}
      <div className="flex justify-center items-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-4 py-2 rounded-md ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-600 text-gray-300 hover:bg-gray-500"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Category;