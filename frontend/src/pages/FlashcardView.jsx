import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/FlashcardView.css";

const FlashcardView = () => {
  const { state } = useLocation();
  const flashcards = state?.flashcards || [];
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const navigate = useNavigate();

  const currentFlashcard = flashcards[currentCardIndex];

  const handleSaveDeck = async () => {
    if (!flashcards.length) {
      setSaveMessage("No flashcards to save.");
      return;
    }

    const category = flashcards[0]?.category || "Uncategorized";

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/flashcard/save_deck",
        { flashcards, category },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSaveMessage(response.data.message || "Flashcards saved successfully!");
      navigate("/getflashcards")
    } catch (err) {
      setSaveMessage(err.response?.data?.message || "Failed to save flashcards.");
    }
  };

  if (!flashcards.length) {
    return <p>No flashcards available.</p>;
  }

  return (
    <div className="flashcard-view-page">
      <div className="flashcard" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`flashcard-inner ${isFlipped ? "flipped" : ""}`}>
          <div className="flashcard-front">
            <h3>Question</h3>
            <p>{currentFlashcard?.question}</p>
            {/* <p className="category">Category: {currentFlashcard?.category}</p> */}
          </div>
          <div className="flashcard-back">
            <h3>Answer</h3>
            <p>{currentFlashcard?.answer}</p>
            {/* <p className="category">Category: {currentFlashcard?.category}</p> */}
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button
          onClick={() => {
            setIsFlipped(false);
            setCurrentCardIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
          }}
        >
          Previous
        </button>
        <button
          onClick={() => {
            setIsFlipped(false);
            setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
          }}
        >
          Next
        </button>
        <button  onClick={handleSaveDeck}>
        SaveDeck
      </button>
      </div>

      {/* Save Button */}
      {/* <button className="save-button" onClick={handleSaveDeck}>
        Save Deck
      </button> */}
      {/* {saveMessage && <p className="save-message">{saveMessage}</p>} */}
    </div>
  );
};

export default FlashcardView;
