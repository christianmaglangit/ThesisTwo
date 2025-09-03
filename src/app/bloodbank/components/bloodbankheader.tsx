"use client";

import { useState } from "react";
import BloodbankSidebar from "../components/bloodbank_sidebar";
import BloodbankHeader from "../components/bloodbankheader";

export default function Page() {
  const [open, setOpen] = useState(false);
  const notifications = [
    { id: 1, message: "New blood request pending" },
    { id: 2, message: "Request approved" },
  ];

  const handleLogout = () => {
    // Optional: clear user session/localStorage here
    // localStorage.removeItem("userToken");
    window.location.href = "/";
  };

  return (
    <div className="flex">
      <BloodbankSidebar />
      <div className="ml-64 w-full">
        <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow-md flex items-center justify-end px-6 z-50">
          <div className="flex items-center gap-6">
            {/* Only ONE notification bell here */}
            <div className="relative">
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="text-2xl hover:text-red-500 relative"
              >
                🔔
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg z-50">
                  <ul className="divide-y divide-gray-700">
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className="p-3 hover:bg-gray-700 cursor-pointer text-white"
                      >
                        {n.message}
                      </li>
                    ))}
                    {notifications.length === 0 && (
                      <li className="p-3 text-gray-400 text-center">
                        No new notifications
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </header>
        {/* ...rest of your page... */}
      </div>
    </div>
  );
}