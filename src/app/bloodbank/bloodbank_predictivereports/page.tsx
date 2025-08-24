"use client";

import { useState } from "react";
import BloodbankSidebar from "../components/bloodbank_sidebar";

// Simple Card Component
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl shadow-lg p-6 bg-gray-800 text-white ${className || ""}`}>
      {children}
    </div>
  );
}

// Notification Header Component
function NotificationHeader() {
  const [notifications] = useState([
    { id: 1, message: "New user registered" },
    { id: 2, message: "User role updated" },
  ]);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-gray-900 text-white flex items-center justify-end px-6 shadow z-50">
      <div className="relative">
        <button
          onClick={() => window.alert("Go to Notification Logs")}
          className="text-2xl hover:text-red-500"
        >
          🔔
        </button>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </div>
    </header>
  );
}

// User type
interface UserAccount {
  id: number;
  name: string;
  email: string;
  role: string; // Admin, Staff, Donor
}

// Mock users
const initialUsers: UserAccount[] = [
  { id: 1, name: "Juan Dela Cruz", email: "juan@example.com", role: "Donor" },
  { id: 2, name: "Maria Santos", email: "maria@example.com", role: "Staff" },
  { id: 3, name: "Pedro Reyes", email: "pedro@example.com", role: "Admin" },
];

export default function ManageUsers() {
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  // Delete user
  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Save edited user
  const handleSaveEdit = () => {
    if (!editingUser) return;
    setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? editingUser : u)));
    setEditingUser(null);
  };

  return (
    <div className="flex">
      <BloodbankSidebar />
      <div className="ml-64 w-full">
        <NotificationHeader />

        <main className="pt-20 p-8 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
          <h1 className="text-3xl font-bold text-red-500 mb-6">Manage User Accounts</h1>

          {/* User list */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-black">
            <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Role</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="text-center">
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.role}</td>
                    <td className="border px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit user modal */}
          {editingUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-black max-w-lg w-full">
                <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
                <div className="mb-3">
                  <label className="block mb-1 font-semibold">Name</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, name: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-semibold">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-semibold">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                    <option value="Donor">Donor</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingUser(null)}
                    className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
