import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  FiChevronDown,
  FiChevronRight,
  FiPlusCircle,
  FiTrash2,
  FiSearch,
  FiEdit2,
  FiSave,
  FiX,
  FiTag,
  FiMove,
} from "react-icons/fi";
import CategoryTabs from "../CategoryTabs/CategoryTabs";
import { toast } from "react-toastify";

const TagPage = () => {
  const { categoryName } = useParams();
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState({
    name: "",
    description: "",
    parent: null,
  });
  const [showForm, setShowForm] = useState(false);
  const [expandedTags, setExpandedTags] = useState({});
  const [selectedTag, setSelectedTag] = useState(null);
  const [childForms, setChildForms] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTagId, setEditingTagId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", description: "" });
  const [selectedForMerge, setSelectedForMerge] = useState([]);
  const [tagToMove, setTagToMove] = useState(null);

  // Load tags from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`tags_${categoryName}`);
    if (stored) setTags(JSON.parse(stored));
  }, [categoryName]);

  // Update tags in state and localStorage
  const updateTags = (newTags) => {
    setTags(newTags);
    localStorage.setItem(`tags_${categoryName}`, JSON.stringify(newTags));
  };

  // Toggle the form for creating a new tag
  const toggleForm = () => {
    setShowForm(!showForm);
    setNewTag({ name: "", description: "", parent: null });
  };

  // Add a new tag
  const addTag = () => {
    if (!newTag.name.trim()) {
      toast.error("Tag name is required!");
      return;
    }

    const isNameUnique = (tagList, name) => {
      for (const tag of tagList) {
        if (tag.name.toLowerCase() === name.toLowerCase()) {
          return false;
        }
        if (tag.children && !isNameUnique(tag.children, name)) {
          return false;
        }
      }
      return true;
    };

    if (!isNameUnique(tags, newTag.name)) {
      toast.error("Tag name must be unique!");
      return;
    }

    const updated = [...tags, { ...newTag, id: Date.now(), children: [] }];
    updateTags(updated);
    setNewTag({ name: "", description: "", parent: null });
    setShowForm(false);
  };

  // Add a child tag
  const addChildTag = (parentId, childData) => {
    if (!childData.name || !childData.name.trim()) {
      toast.error("Child tag name cannot be empty!");
      return;
    }

    const insertChild = (tagList) =>
      tagList.map((tag) =>
        tag.id === parentId
          ? {
              ...tag,
              children: [
                ...(tag.children || []),
                { ...childData, id: Date.now(), children: [] },
              ],
            }
          : { ...tag, children: tag.children ? insertChild(tag.children) : [] }
      );
    updateTags(insertChild(tags));

    setChildForms((prev) => ({ ...prev, [parentId]: false }));
  };

  // Delete a tag
  const deleteTag = (id) => {
    const removeTag = (tagList) =>
      tagList
        .filter((tag) => tag.id !== id)
        .map((tag) => ({
          ...tag,
          children: tag.children ? removeTag(tag.children) : [],
        }));
    updateTags(removeTag(tags));
  };

  // Toggle the child form for a tag
  const toggleChildForm = (id) => {
    setChildForms((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Get matching tags and their expanded parents for search
  const getMatchingTags = (tagList, term, parents = []) => {
    let result = [];
    let expanded = new Set();

    for (const tag of tagList) {
      const isMatch = tag.name.toLowerCase().includes(term.toLowerCase());
      const [filteredChildren, childExpanded] = getMatchingTags(
        tag.children || [],
        term,
        [...parents, tag.id]
      );

      if (isMatch || filteredChildren.length > 0) {
        result.push({ ...tag, children: filteredChildren });
        expanded.add(tag.id);
        parents.forEach((pid) => expanded.add(pid));
        childExpanded.forEach((id) => expanded.add(id));
      }
    }

    return [result, expanded];
  };

  // Merge two tags
  const mergeTags = () => {
    if (selectedForMerge.length < 2) {
      toast.error("Select at least two tags to merge!");
      return;
    }

    const mergedTags = structuredClone(tags);

    // Find the parent-most tag from the selected tags
    const findParentMostTag = (tagList, selectedIds) => {
      let parentMostTag = null;

      const traverse = (list, parent = null) => {
        for (const tag of list) {
          if (selectedIds.includes(tag.id)) {
            if (!parentMostTag || parentMostTag.level > (parent?.level || 0)) {
              parentMostTag = { ...tag, parent };
            }
          }
          if (tag.children) {
            traverse(tag.children, { ...tag, level: (parent?.level || 0) + 1 });
          }
        }
      };

      traverse(tagList);
      return parentMostTag;
    };

    const parentMostTag = findParentMostTag(mergedTags, selectedForMerge);
    if (!parentMostTag) {
      toast.error("Could not determine the parent tag for merging!");
      return;
    }

    const keepId = parentMostTag.id; // The parent-most tag will be the one to keep
    const mergeIds = selectedForMerge.filter((id) => id !== keepId); // All other selected tags will be merged into the parent-most tag

    const findAndMerge = (tagList) =>
      tagList.map((tag) => {
        if (tag.id === keepId) {
          const mergedChildren = [];

          const traverse = (list) => {
            for (let t of list) {
              if (mergeIds.includes(t.id)) {
                tag.name += ` + ${t.name}`;
                tag.description = `${tag.description || ""}\n\nMerged:\n${t.description || ""}`;
                mergedChildren.push(...(t.children || []));
              } else if (t.children) {
                traverse(t.children);
              }
            }
          };

          traverse(mergedTags);
          tag.children = [...(tag.children || []), ...mergedChildren];
        }

        return {
          ...tag,
          children: tag.children ? findAndMerge(tag.children) : [],
        };
      });

    const removeMergedTags = (tagList) =>
      tagList
        .filter((t) => !mergeIds.includes(t.id))
        .map((t) => ({
          ...t,
          children: t.children ? removeMergedTags(t.children) : [],
        }));

    const merged = findAndMerge(mergedTags);
    const cleaned = removeMergedTags(merged);
    updateTags(cleaned);
    setSelectedForMerge([]);
    toast.success("Tags merged successfully!");
  };

  const toggleMergeSelection = (tagId) => {
    setSelectedForMerge((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      }
      return [...prev, tagId];
    });
  };

  // Edit a tag
  const startEditing = (tag) => {
    setEditingTagId(tag.id);
    setEditValues({ name: tag.name, description: tag.description || "" });
  };

  const cancelEdit = () => {
    setEditingTagId(null);
    setEditValues({ name: "", description: "" });
  };

  const saveEdit = (id) => {
    const updateTag = (tagList) =>
      tagList.map((tag) =>
        tag.id === id
          ? {
              ...tag,
              name: editValues.name,
              description: editValues.description,
              children: tag.children || [],
            }
          : { ...tag, children: tag.children ? updateTag(tag.children) : [] }
      );
    updateTags(updateTag(tags));
    cancelEdit();
  };

  // Check if a tag is a descendant of another
  const isDescendant = (parentTag, targetTag) => {
    if (!parentTag.children) return false;
    for (let child of parentTag.children) {
      if (child.id === targetTag.id || isDescendant(child, targetTag))
        return true;
    }
    return false;
  };

  // Move a tag under another
  const handleMoveTag = (movingId, newParentId) => {
    let movingTag = null;

    const clonedTags = structuredClone(tags);

    const removeTag = (tagList) =>
      tagList.reduce((acc, tag) => {
        if (tag.id === movingId) {
          movingTag = tag;
          return acc;
        }
        const updatedChildren = removeTag(tag.children || []);
        acc.push({ ...tag, children: updatedChildren });
        return acc;
      }, []);

    const insertTag = (tagList) =>
      tagList.map((tag) =>
        tag.id === newParentId
          ? { ...tag, children: [...(tag.children || []), movingTag] }
          : { ...tag, children: insertTag(tag.children || []) }
      );

    const tagsWithoutMoving = removeTag(clonedTags);
    const updatedTags = insertTag(tagsWithoutMoving);
    updateTags(updatedTags);
    setTagToMove(null);
  };

  // Memoize visible tags and auto-expanded tags
  const [visibleTags, autoExpanded] = useMemo(() => {
    if (searchTerm) {
      return getMatchingTags(tags, searchTerm);
    }
    return [tags, new Set()];
  }, [tags, searchTerm]);

  // Toggle expanded state for a tag
  const toggleExpand = (id) => {
    setExpandedTags((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Update expanded tags when search term changes
  useEffect(() => {
    if (searchTerm) {
      const newExpanded = { ...expandedTags };
      autoExpanded.forEach((id) => {
        newExpanded[id] = true;
      });

      if (JSON.stringify(newExpanded) !== JSON.stringify(expandedTags)) {
        setExpandedTags(newExpanded);
      }
    } else if (Object.keys(expandedTags).length > 0) {
      setExpandedTags({});
    }
  }, [searchTerm, autoExpanded]);

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const renderTags = (tagList, level = 0) =>
    tagList.map((tag) => (
      <div
        key={tag.id}
        className={`ml-${level * 4} bg-[#2d3748] p-3 rounded mb-2 transition-all duration-300 shadow hover:shadow-lg`}
      >
        <div className="flex justify-between items-center group">
          <div
            className="flex items-center gap-2 cursor-pointer w-full"
            onClick={() => setSelectedTag(tag)}
          >
            {tagToMove &&
              tag.id !== tagToMove.id &&
              !isDescendant(tagToMove, tag) && (
                <button
                  onClick={() => handleMoveTag(tagToMove.id, tag.id)}
                  className="text-sm text-white bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded ml-2"
                >
                  Move Here
                </button>
              )}

            <input
              type="checkbox"
              checked={selectedForMerge.includes(tag.id)}
              onChange={() => toggleMergeSelection(tag.id)}
              className="mr-2 accent-green-500"
            />
            {tag.children?.length > 0 ? (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(tag.id);
                }}
              >
                {expandedTags[tag.id] ? (
                  <FiChevronDown className="text-3xl" />
                ) : (
                  <FiChevronRight className="text-3xl" />
                )}
              </span>
            ) : (
              <span className="w-4" />
            )}

            {editingTagId === tag.id ? (
              <input
                className="bg-[#1f2937] rounded px-2 py-1 w-full"
                value={editValues.name}
                onChange={(e) =>
                  setEditValues((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            ) : (
              <strong className="w-full truncate flex items-center gap-1">
                <FiTag className="text-gray-300" />
                {tag.name}
              </strong>
            )}
          </div>

          {editingTagId === tag.id && (
            <div className="flex gap-2">
              <button
                onClick={() => saveEdit(tag.id)}
                className="text-green-400 hover:text-green-300 text-2xl"
              >
                <FiSave />
              </button>
              <button
                onClick={cancelEdit}
                className="text-yellow-400 hover:text-yellow-300 text-2xl"
              >
                <FiX />
              </button>
            </div>
          )}

          {editingTagId !== tag.id && (
            <div className="flex gap-5 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => toggleChildForm(tag.id)}
                className="text-green-400 hover:text-green-300 text-2xl"
              >
                <FiPlusCircle />
              </button>
              <button
                onClick={() => startEditing(tag)}
                className="text-yellow-400 hover:text-yellow-300 text-2xl"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={() => deleteTag(tag.id)}
                className="text-red-400 hover:text-red-300 text-2xl"
              >
                <FiTrash2 />
              </button>
              <button
                onClick={() => setTagToMove(tag)}
                className="text-blue-400 hover:text-blue-300 text-2xl"
                title="Move this tag under another"
              >
                <FiMove />
              </button>
            </div>
          )}
        </div>

        {editingTagId === tag.id && (
          <textarea
            className="w-full mt-2 p-2 rounded bg-[#1f2937] text-white"
            value={editValues.description}
            onChange={(e) =>
              setEditValues((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        )}

        {childForms[tag.id] && (
          <div className="mt-2 p-2 bg-[#1f2937] rounded space-y-2 animate-fade-in">
            <input
              type="text"
              placeholder="Subtag Name"
              className="w-full p-2 rounded bg-[#374151] outline-none"
              onChange={(e) =>
                setChildForms((prev) => ({
                  ...prev,
                  [tag.id]: { ...(prev[tag.id] || {}), name: e.target.value },
                }))
              }
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 rounded bg-[#374151] outline-none"
              onChange={(e) =>
                setChildForms((prev) => ({
                  ...prev,
                  [tag.id]: {
                    ...(prev[tag.id] || {}),
                    description: e.target.value,
                  },
                }))
              }
            />
            <div className="flex gap-5">
              <button
                className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-sm"
                onClick={() => addChildTag(tag.id, childForms[tag.id])}
              >
                Add Subtag
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm"
                onClick={() => toggleChildForm(tag.id)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {expandedTags[tag.id] && tag.children?.length > 0 && (
          <div className="pl-4 transition-all duration-300">
            {renderTags(tag.children, level + 1)}
          </div>
        )}
      </div>
    ));

  return (
    <div className="flex flex-col p-6 text-white w-full">
      <div className="flex items-center justify-between pb-2">
        <h1 className="text-2xl font-semibold">Welcome, {user.name}</h1>
      </div>
      <CategoryTabs />
      <div className="flex gap-6 w-full text-white p-6">
        <div className="w-2/3">
          <h2 className="text-2xl font-semibold mb-6">
            Manage Tags for: {categoryName}
          </h2>
          {selectedForMerge.length >= 2 && (
            <div className="mb-4 flex justify-end">
              <button
                onClick={mergeTags}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white shadow"
              >
                Merge Selected Tags
              </button>
            </div>
          )}

          {tagToMove && (
            <div className="mb-4 text-white flex gap-4 items-center">
              <button
                onClick={() => setTagToMove(null)}
                className="text-red-400 hover:text-red-300"
              >
                Cancel Move
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={toggleForm}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full transition w-1/4"
            >
              <FiPlusCircle />
              {showForm ? "Cancel" : "Create Tag"}
            </button>

            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search Tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-1/2 pl-10 pr-4 py-2 rounded-full bg-[#1a2029] outline-none text-white"
              />
            </div>
          </div>

          {showForm && (
            <div className="bg-[#1f2937] p-4 rounded mb-4 space-y-2 animate-fade-in">
              <input
                type="text"
                placeholder="Tag Name"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                className="w-full p-2 rounded bg-[#374151] outline-none"
              />
              <textarea
                placeholder="Description"
                value={newTag.description}
                onChange={(e) =>
                  setNewTag({ ...newTag, description: e.target.value })
                }
                className="w-full p-2 rounded bg-[#374151] outline-none"
              />
              <button
                onClick={addTag}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
              >
                Add Tag
              </button>
            </div>
          )}

          {visibleTags.length > 0 ? (
            renderTags(visibleTags)
          ) : (
            <p className="text-gray-400">No tags found.</p>
          )}
        </div>

        <div className="w-1/2 bg-[#1f2937] p-4 pt-24 rounded h-fit sticky top-6">
          {selectedTag && (
            <div className="mt-6 p-4 bg-[#2d3748] rounded">
              <h4 className="text-lg font-semibold">{selectedTag.name}</h4>
              <p className="text-gray-300">
                <strong className=" text-lg font-semibold ">
                  Description:
                </strong>
                <div className="line-clamp-5">
                  {selectedTag.description || "No description"}
                </div>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagPage;
