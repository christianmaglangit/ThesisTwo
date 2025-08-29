"use client";

import { useState, useEffect } from "react";
import BloodbankSidebar from "../components/bloodbank_sidebar";

// Simple Card Component
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl shadow-lg p-6 bg-gray-800 text-white ${className || ""}`}>
      {children}
    </div>
  );
}

// Inventory Item type
type BloodInventoryItem = {
  id: number;
  type: string;
  units: number;
  collectedAt: string;
  expiresAt: string;
};

// Predefined blood types
const allBloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

// Format datetime → MM-DD-YYYY hh:mm AM/PM
function formatDateTime(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${month}-${day}-${year} ${hours}:${minutes} ${ampm}`;
}

// Format date only → MM-DD-YYYY
function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
}

function getExpiryColor(expiry: string) {
  if (!expiry) return "text-gray-400";
  const today = new Date();
  const expDate = new Date(expiry);
  const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "text-red-400 font-bold";
  if (diffDays <= 7) return "text-orange-400 font-bold";
  return "text-green-400 font-bold";
}

export default function BloodBankInventory() {
  const [inventory, setInventory] = useState<BloodInventoryItem[]>([]);
  const [activeSheet, setActiveSheet] = useState("O+");
  const [amount, setAmount] = useState<number>(0);
  const [collectedAt, setCollectedAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Notifications
  const [notifications] = useState([
    { id: 1, message: "New blood request pending" },
    { id: 2, message: "Low stock: O-" },
    { id: 3, message: "Inventory updated successfully" },
  ]);
  const [notifOpen, setNotifOpen] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bloodInventory");
    if (saved) setInventory(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("bloodInventory", JSON.stringify(inventory));
  }, [inventory]);

  // Add / Update entry
  const handleAddUnits = () => {
    if (amount <= 0) return;

    const now = new Date();
    const defaultCollected = now.toISOString();
    const defaultExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    if (editId) {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                units: amount,
                collectedAt: collectedAt || defaultCollected,
                expiresAt: expiresAt || defaultExpiry,
              }
            : item
        )
      );
      setEditId(null);
    } else {
      const newEntry: BloodInventoryItem = {
        id: Date.now(),
        type: activeSheet,
        units: amount,
        collectedAt: collectedAt || defaultCollected,
        expiresAt: expiresAt || defaultExpiry,
      };
      setInventory((prev) => [...prev, newEntry]);
    }

    setAmount(0);
    setCollectedAt("");
    setExpiresAt("");
    setShowModal(false);
  };

  // Remove entry
  const handleRemoveUnits = (id: number) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  // Edit entry
  const handleEditUnits = (item: BloodInventoryItem) => {
    setAmount(item.units);
    setCollectedAt(item.collectedAt);
    setExpiresAt(item.expiresAt);
    setEditId(item.id);
    setShowModal(true);
  };

  return (
    <div className="flex">
      <BloodbankSidebar />
      <div className="ml-64 w-full relative">
        {/* 🔔 Notification Bell (same as Appointment Page) */}
        <div className="absolute top-4 right-8 z-50">
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="text-2xl hover:text-red-500 relative"
            >
              🔔
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg text-white z-50">
                <h3 className="font-semibold text-lg px-4 py-2 border-b border-gray-700">
                  Notifications
                </h3>
                <ul>
                  {notifications.map((note) => (
                    <li
                      key={note.id}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    >
                      {note.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <main className="pt-20 p-8 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
          <h1 className="text-3xl font-bold text-red-500 mb-8">Manage Blood Inventory</h1>

          {/* Tabs */}
          <div className="flex gap-3 mb-6">
            {allBloodTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveSheet(type)}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  activeSheet === type
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {type} Sheet
              </button>
            ))}
          </div>

          {/* Inventory Table */}
          <Card className="mb-8 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">
              {activeSheet} Inventory
            </h2>
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left p-3">Blood Type</th>
                  <th className="text-left p-3">Units</th>
                  <th className="text-left p-3">Collected At</th>
                  <th className="text-left p-3">Expiry Date</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory
                  .filter((item) => item.type === activeSheet)
                  .map((item) => (
                    <tr key={item.id} className="border-b border-gray-700">
                      <td className="p-3">{item.type}</td>
                      <td className="p-3">{item.units}</td>
                      <td className="p-3">{formatDateTime(item.collectedAt)}</td>
                      <td className="p-3">{formatDate(item.expiresAt)}</td>
                      <td className={`p-3 ${getExpiryColor(item.expiresAt)}`}>
                        {new Date(item.expiresAt) < new Date()
                          ? "Expired"
                          : new Date(item.expiresAt).getTime() - Date.now() <=
                            7 * 24 * 60 * 60 * 1000
                          ? "Expiring Soon"
                          : "OK"}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleEditUnits(item)}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveUnits(item.id)}
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Card>

          {/* Add Stock Button */}
          <div className="flex justify-start mb-8">
            <button
              onClick={() => {
                setEditId(null);
                setAmount(0);
                setCollectedAt("");
                setExpiresAt("");
                setShowModal(true);
              }}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              ➕ Add {activeSheet} Stock
            </button>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">
                  {editId ? "Edit" : "Add"} {activeSheet} Stock
                </h2>
                <div className="flex flex-col gap-4">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Enter units"
                    className="bg-gray-700 text-white p-2 rounded-lg w-full"
                  />
                  <input
                    type="datetime-local"
                    value={collectedAt}
                    onChange={(e) => setCollectedAt(e.target.value)}
                    className="bg-gray-700 text-white p-2 rounded-lg w-full"
                  />
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="bg-gray-700 text-white p-2 rounded-lg w-full"
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddUnits}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
                    >
                      {editId ? "💾 Save Changes" : "➕ Add Units"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
