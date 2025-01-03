import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FlashcardsPage from './pages/FlashcardsPage.jsx';
import FlashcardView from './pages/FlashcardView.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Navbar from "./components/Navbar.jsx"
import FlashcardCategories from './pages/FlashcardsCategory.jsx';
import CustomFlashcard from './pages/CustomFlashcard.jsx';

const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/view-flashcards" element={<FlashcardView />} />
        <Route path="/getflashcards" element={<FlashcardCategories />} />
        <Route path="/customflashcard" element={<CustomFlashcard />} />
      </Routes>
    </Router>
  );
};

export default App;

