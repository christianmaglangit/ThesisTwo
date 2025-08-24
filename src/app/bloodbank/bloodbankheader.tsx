"use client";
import { useState } from "react";

export default function BloodbankHeader() {
  const [open, setOpen] = useState(false);

  const notifications = [
    { id: 1, message: "New appointment added" },
    { id: 2, message: "Blood request approved" },
    { id: 3, message: "Low stock alert: O-" },
  ];

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-gray-900 text-white flex items-center justify-end px-6 shadow z-50">
      <div className="relative">
        {/* Notification Bell */}
        <button
          onClick={() => setOpen(!open)}
          className="text-2xl hover:text-red-500 relative"
        >
          🔔
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg text-white z-50">
            <h3 className="font-semibold text-lg px-4 py-2 border-b border-gray-700">
              Notifications
            </h3>
            <ul>
              {notifications.map((note) => (
                <li key={note.id} className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  {note.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
