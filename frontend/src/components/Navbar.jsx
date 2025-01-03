import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'; // Add your custom styles if needed.

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    console.log(token)
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setIsLoggedIn(false);
    navigate('/');
  };

//   return (
//     <nav className="navbar navbar-expand-lg bg-dark navbar-dark fixed-top">
//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/">
//           Flashcard Generator
//         </Link>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNavDropdown"
//           aria-controls="navbarNavDropdown"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNavDropdown">
//           <ul className="navbar-nav me-auto">
//             <li className="nav-item">
//               <Link className="nav-link" to="/">
//                 Home
//               </Link>
//             </li>
//             {isLoggedIn && (
//               <>
//                 {/* <li className="nav-item">
//                   <Link className="nav-link" to="/generate/prompt">
//                     Generate from Prompt
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/generate/pdf">
//                     Generate from PDF
//                   </Link>
//                 </li> */}
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/flashcards/saved">
//                     View Saved Flashcards
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>
//           <ul className="navbar-nav">
//             {isLoggedIn ? (
//               <li className="nav-item dropdown">
//                 <a
//                   className="nav-link dropdown-toggle"
//                   href="#"
//                   role="button"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
//                 >
//                   Profile
//                 </a>
//                 <ul className="dropdown-menu dropdown-menu-end">
//                   <li>
//                     <Link className="dropdown-item" to="/profile">
//                       My Profile
//                     </Link>
//                   </li>
//                   <li>
//                     <button className="dropdown-item" onClick={handleLogout}>
//                       Logout
//                     </button>
//                   </li>
//                 </ul>
//               </li>
//             ) : (
//               <li className="nav-item">
//                 <Link className="nav-link" to="/login">
//                   Login
//                 </Link>
//               </li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };



return (
  <nav className="navbar navbar-expand-lg bg-body-tertiary navbar-dark fixed-top">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/">
        FlashCardGenerator
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link active" aria-current="page" to="/">
              Home
            </Link>
          </li>
          {isLoggedIn && (
            <>
              {/* <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  View flashcards
                </Link>
              </li> */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Flashcards
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/flashcards">
                      Generate flashcards
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/getflashcards">
                     View previous flashcards
                    </Link>
                  </li>
                </ul>
              </li>
            </>
          )}
        </ul>
        <ul className="navbar-nav">
          {console.log(isLoggedIn)}
          {isLoggedIn ? (
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Profile
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/user/me">
                    My Profile
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  </nav>
);
};

export default Navbar;