"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ProfileModal from "./profile";

interface NavbarProps {
  onLogout: () => void;
  onOpenRequest: () => void;
}

export default function Navbar({ onLogout, onOpenRequest }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name?: string; pic?: string }>({});
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New Blood Campaign" },
    { id: 2, message: "Request approved" },
  ]);

  const notifRef = useRef<HTMLDivElement>(null);

  // Load user from localStorage
  useEffect(() => {
    const name = localStorage.getItem("profile_name") || "Sample Name";
    const pic = localStorage.getItem("profile_image") || "/images/user.png";
    setCurrentUser({ name, pic });
  }, [isProfileOpen]); // reload after modal close

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <nav className="w-full fixed top-0 left-0 bg-white text-red-600 backdrop-blur-md z-50 shadow-md">
      <div className="max-w px-10 py-3 flex items-center justify-between">
        {/* Logo */}
        <div>
          <div className="text-3xl font-bold">DUGO</div>
          <span className="text-sm hidden sm:inline">
            Donor Utility for Giving and Organizing
          </span>
        </div>

        {/* Actions */}
        <ul className="flex items-center gap-6">
          <li>
            <button
              onClick={onOpenRequest}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Request Blood
            </button>
          </li>

          {/* Notification */}
          <li className="relative" ref={notifRef}>
            <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative">
              <Image src="/images/bell.png" width={28} height={28} alt="Notification" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center text-white">
                  {notifications.length}
                </span>
              )}
            </button>
            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-gray-800 rounded-lg shadow-xl z-20">
                <ul className="divide-y divide-gray-700">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <li
                        key={n.id}
                        onClick={() => handleNotificationClick(n.id)}
                        className="p-3 hover:bg-gray-700 cursor-pointer text-white"
                      >
                        {n.message}
                      </li>
                    ))
                  ) : (
                    <li className="p-3 text-gray-400 text-center">
                      No new notifications
                    </li>
                  )}
                </ul>
              </div>
            )}
          </li>

          {/* Profile Dropdown */}
          <li className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <Image
                src={currentUser.pic || "/images/user.png"}
                width={30}
                height={30}
                alt="Profile"
                className="rounded-full"
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-gray-800 rounded-lg shadow-xl overflow-hidden z-20">
                <div className="px-4 py-2 text-gray-200 font-semibold border-b border-gray-700">
                  {currentUser?.name}
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700"
                >
                  Profile
                </button>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* Profile Modal */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </nav>
  );
}
