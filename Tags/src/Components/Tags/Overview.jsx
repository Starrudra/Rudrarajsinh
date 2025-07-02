import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CategoryTabs from "../CategoryTabs/CategoryTabs";

const OverviewPage = () => {
  const { categoryName } = useParams();
  const [categoryTagCount, setCategoryTagCount] = useState(0);
  const [totalTagCount, setTotalTagCount] = useState(0);

  useEffect(() => {
    const getAllTags = () => {
      const tags = localStorage.getItem(`tags_${categoryName}`);
      if (!tags) return { total: 0, flat: [] };

      const parsed = JSON.parse(tags);

      // Flatten recursively
      const flattenTags = (arr) => {
        return arr.reduce((acc, tag) => {
          acc.push(tag);
          if (tag.children && tag.children.length > 0) {
            acc.push(...flattenTags(tag.children));
          }
          return acc;
        }, []);
      };

      const flat = flattenTags(parsed);
      return { total: flat.length, flat };
    };

    // Category-specific count
    const { total } = getAllTags();
    setCategoryTagCount(total);

    // All categories total tag count
    let allTagsCount = 0;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("tags_")) {
        const tags = JSON.parse(localStorage.getItem(key));
        const flatten = (arr) =>
          arr.reduce((acc, tag) => {
            acc.push(tag);
            if (tag.children) acc.push(...flatten(tag.children));
            return acc;
          }, []);
        allTagsCount += flatten(tags).length;
      }
    });
    setTotalTagCount(allTagsCount);
  }, [categoryName]);

  return (
    <div className="flex flex-col p-6 text-white w-full">
    <div className="flex items-center justify-between pb-2">
      <h1 className="text-2xl font-semibold">{categoryName}</h1>
    </div>

    <CategoryTabs />
    <div className="flex flex-col p-6 text-white w-full">
      <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-4">
        <h1 className="text-2xl font-semibold">{categoryName} Overview</h1>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="bg-[#1A1C23] rounded-lg p-6 w-[200px] text-center shadow-md border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">{categoryName} Tags Count</p>
          <p className="text-2xl font-bold text-blue-400">{categoryTagCount}</p>
        </div>

        <div className="bg-[#1A1C23] rounded-lg p-6 w-[200px] text-center shadow-md border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">All Tags Count</p>
          <p className="text-2xl font-bold text-green-400">{totalTagCount}</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default OverviewPage;
