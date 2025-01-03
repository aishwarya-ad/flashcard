import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/FlashcardCategories.css";

const FlashcardCategories = () => {
  const [categories, setCategories] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/flashcard/getflashcards", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
        });
        console.log(response.data)
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };

    fetchCategories();
  }, []);
  const handleCategoryClick = (category) => {
    navigate("/view-flashcards", { state: { flashcards: categories[category] } });
  };

  return (
    <div className="flashcard-categories-page">
      <h1>Created flashcards</h1>
      <div className="categories-list">
        {Object.keys(categories).map((category) => (
          <div
            key={category}
            className="category-card"
            // className="flashcard-box"
            onClick={() => handleCategoryClick(category)}
          >
            <h3 className="flashcard-title">{category}</h3>
            <p>{categories[category].length} Flashcards</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardCategories;
