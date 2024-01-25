// CategoryFilter.js
import React from "react";

const CategoryFilter = ({ selectedCategory, handleCategorySelect }) => (
  <select value={selectedCategory} onChange={handleCategorySelect}>
    <option value="All">All</option>
    <option value="sports">Sports</option>
    <option value="social">Social</option>
    <option value="technology">Technology</option>
  </select>
);

export default CategoryFilter;
