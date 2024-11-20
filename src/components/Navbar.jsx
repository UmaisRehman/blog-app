import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { signOutUser } from '../config/firebase/firebasemethods';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
  }, []);

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        console.log("Logged out successfully");
        navigate("/login");
      })
      .catch((err) => {
        console.log("Sign-out failed:", err);
      });
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-teal-500 sticky top-0 z-50 shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-3xl font-extrabold text-white hover:text-gray-200 transition duration-300">
            Blogging App
          </Link>

          {/* Navbar Items */}
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="text-white hover:text-gray-200">Home</Link>
            <Link to="/dashboard" className="text-white hover:text-gray-200">Dashboard</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-white hover:text-gray-200">Profile</Link>
                <button onClick={handleSignOut} className="text-white hover:text-gray-200">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-gray-200">Login</Link>
                <Link to="/register" className="text-white hover:text-gray-200">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <button onClick={toggleMenu} className="md:hidden text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-gradient-to-r from-blue-500 to-teal-500 p-4`}>
        <Link to="/" className="block text-white py-2">Home</Link>
        <Link to="/dashboard" className="block text-white py-2">Dashboard</Link>
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="block text-white py-2">Profile</Link>
            <button onClick={handleSignOut} className="block text-white py-2">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="block text-white py-2">Login</Link>
            <Link to="/register" className="block text-white py-2">Register</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
