"use client";

import { useState } from "react";
import AuthModal from "./singuplogin";

interface NavbarProps {
  onLogin: (user: any) => void;
  onLogout: () => void;
  currentUser: any;
}

export default function Navbar({ onLogin, onLogout, currentUser }: NavbarProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  return (
    <>
      <nav className="fixed top-0 left-0 w-full shadow-md z-50 bg-white text-red-600">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <span className="text-3xl font-bold">DUGO</span>
            <span className="text-sm ml-2">Donor Utility for Giving and Organizing</span>
          </div>

          <ul className="flex space-x-4">
            {!currentUser && (
              <>
                <li>
                  <button
                    onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setAuthMode("signup"); setShowAuthModal(true); }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                  >
                    Sign Up
                  </button>
                </li>
              </>
            )}

            {currentUser && (
              <li>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onLogin={(user) => {
            onLogin(user);
            setShowAuthModal(false);
          }}
        />
      )}
    </>
  );
}
