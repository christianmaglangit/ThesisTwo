"use client";

import { useState } from "react";
import LoginModal from "./login";   // ✅ fixed import
import SignupModal from "./signup"; // ✅ fixed import
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onLogin: (user: any) => void;
  onLogout: () => void;
  currentUser: any;
}

export default function Navbar({ onLogin, onLogout, currentUser }: NavbarProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderAuthButtons = () => {
    if (!currentUser) {
      return (
        <>
          <li>
            <button
              onClick={() => {
                setShowLogin(true);
                setIsMenuOpen(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Login
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setShowSignup(true);
                setIsMenuOpen(false);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Sign Up
            </button>
          </li>
        </>
      );
    }
    return (
      <li>
        <button
          onClick={() => {
            onLogout();
            setIsMenuOpen(false);
          }}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Logout
        </button>
      </li>
    );
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full shadow-md z-50 bg-white text-red-600">
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div>
              <div>
                <span className="text-3xl font-bold">DUGO</span>
              </div>
              <div>
                <span className="text-sm hidden sm:inline">Donor Utility for Giving and Organizing</span>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-4">{renderAuthButtons()}</ul>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <ul className="md:hidden flex flex-col space-y-2 px-4 pb-4 bg-white shadow-lg">
            {renderAuthButtons()}
          </ul>
        )}
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={onLogin}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}

      {/* Signup Modal */}
      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
}
