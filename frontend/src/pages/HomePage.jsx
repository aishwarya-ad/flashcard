import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/HomePage.css"; 

const HomePage = () => {
  const isLoggedIn = !!localStorage.getItem("jwt_token");

  return (
    <div className="home-container">
      <h1>Welcome to the Flashcard Generator App</h1>
      <div className="home-links">
        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/getflashcards">Dashboard</Link>
            <Link
              to="/logout"
              onClick={() => {
                localStorage.removeItem("jwt_token"); 
                window.location.reload();
              }}
            >
              Logout
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
