"use client";

import { useState } from "react";
import Login from "./singuplogin";   // ✅ imong login file (shared login/signup)
import Signup from "./singuplogin";  // ✅ kung usa ra ang file, re-use nimo
// kung lahi imong signup.tsx, i-change ang import path

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full shadow-md z-50">
        <div className="flex items-center justify-between p-4 bg-white text-red-600">
          <div className="flex items-center">
            <div className="ml-2">
              <span className="text-3xl font-bold block">DUGO</span>
              <span className="text-sm block">
                Donor Utility for Giving and Organizing
              </span>
            </div>
          </div>
          <ul className="flex space-x-4">
            <li>
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Login
              </button>
            </li>
            <li>
              <button
                onClick={() => setShowSignup(true)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Sign Up
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* ✅ Login Modal */}
      {showLogin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowLogin(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative"
          >
            <Login /> {/* imong login component */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setShowLogin(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ✅ Signup Modal */}
      {showSignup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowSignup(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative"
          >
            <Signup /> {/* imong signup component */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setShowSignup(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
