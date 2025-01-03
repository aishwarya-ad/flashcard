import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CustomFlashcard.css";

const CustomFlashcard = () => {
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const navigate = useNavigate();

  const handleSave = async () => {
    if (!question || !answer) {
      alert("Please fill out both the question and answer!");
      return;
    }

    try {
        const response = await axios.post(
          "http://127.0.0.1:5000/flashcard/create", 
          {
            category: category || "Uncategorized",
            question,
            answer
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`
            }
          }
        );

      if (response.status === 200) {
        setIsSaved(true);
        alert("Flashcard saved successfully!");
        navigate("/getflashcards");
      }
    } catch (error) {
      console.error("Error saving flashcard:", error);
      alert("Failed to save the flashcard. Please try again.");
    }
  };

  const handleEdit = () => {
    setIsDone(false); // Allow editing again
  };

  const handleDone=()=>{
    setIsDone(true);
  }

  return (
    <div className="custom-flashcard-page">
      <h1>Create a Flashcard</h1>
      <div className="flashcard-container">
        {isDone? (
          <div className="flashcard-display">
            <p><strong>Category:</strong> {category || "Uncategorized"}</p>
            <p><strong>Question:</strong> {question}</p>
            <p><strong>Answer:</strong> {answer}</p>
            <div className="button-group">
              <button className="edit-button" onClick={handleEdit}>
                Edit Flashcard
              </button>
              <button className="save-button" onClick={handleSave}>
                Save Flashcard
              </button>
            </div>
          </div>
        ) : (
          <div className="flashcard-editor">
            <input
              type="text"
              placeholder="Enter Category (Optional)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="category-input"
            />
            <div className="qa-container">
              <textarea
                placeholder="Enter Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="qa-input question-input"
              ></textarea>
              <textarea
                placeholder="Enter Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="qa-input answer-input"
              ></textarea>
            </div>
            <button className="done-button" onClick={handleDone}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomFlashcard;
