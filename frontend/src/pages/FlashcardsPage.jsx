import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/FlashcardPage.css";

const FlashcardsPage = () => {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCustomFlashcards=()=>{
    navigate("/customflashcard")
  }

  const handleGenerateFlashcards = async () => {
    if (!prompt && !file) {
      setError("Please provide a prompt or upload a PDF file.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      if (prompt.trim()) {
        formData.append("prompt", prompt.trim());
      }

      const response = await axios.post(
        "http://127.0.0.1:5000/flashcard/generate_combined", // Backend endpoint to handle both
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const flashcards = response.data.flashcards;
      console.log(flashcards)
      const validCards = flashcards.filter(
        (card) => card.question.trim() && card.answer.trim() && card.category
      );

      if (validCards.length === 0) {
        setError("No valid flashcards generated. Please refine your input.");
        return;
      }

      navigate("/view-flashcards", { state: { flashcards: validCards } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate flashcards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flashcards-page">
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div className="form-container">
        <h2>Create Flashcards</h2>
        <textarea
          placeholder="Enter a topic or prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>
        <h3>Upload a PDF</h3>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        {/* <p style={{ fontSize: "0.9em", color: "gray" }}>
          Combine a topic prompt with a PDF for more precise flashcards!
        </p> */}
        <div className="button-group">
  <button onClick={handleGenerateFlashcards} disabled={loading}>
    {loading ? "Processing..." : "Generate Flashcards"}
  </button>
  <button onClick={handleCustomFlashcards}>Create custom flashcard</button>
</div>
      </div>
    </div>
  );
};

export default FlashcardsPage;
