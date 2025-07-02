import React from "react";
import { NavLink, useParams } from "react-router-dom";

const CategoryTabs = () => {
  const { categoryName } = useParams();

  const baseClasses =
    "text-sm font-medium px-4 py-2 border-b-2 transition-colors duration-200";
  const activeClasses = "border-blue-500 text-blue-400";
  const inactiveClasses = "border-transparent text-gray-400 hover:text-white";

  return (
    <div className="flex border-b border-gray-700 mb-6">
      <NavLink
        to={`/overview/${categoryName}`}
        className={({ isActive }) =>
          `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
        }
      >
        OVERVIEW
      </NavLink>
      <NavLink
        to={`/tags/${categoryName}`}
        className={({ isActive }) =>
          `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
        }
      >
        TAGS
      </NavLink>
    </div>
  );
};

export default CategoryTabs;
