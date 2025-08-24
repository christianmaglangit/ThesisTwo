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

// Notification Header Component
function NotificationHeader() {
  const [notifications] = useState([
    { id: 1, message: "New blood request pending" },
    { id: 2, message: "Appointment approved" },
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

// Initial Inventory Data
const initialInventory = [
  { type: "O-", units: 120 },
  { type: "O+", units: 560 },
  { type: "A-", units: 90 },
  { type: "A+", units: 640 },
  { type: "B-", units: 200 },
  { type: "B+", units: 410 },
  { type: "AB-", units: 75 },
  { type: "AB+", units: 320 },
];

export default function BloodBankInventory() {
  const [inventory, setInventory] = useState(initialInventory);
  const [selectedType, setSelectedType] = useState("O+");
  const [amount, setAmount] = useState<number>(0);

  // Load inventory from localStorage
  useEffect(() => {
    const savedInventory = localStorage.getItem("bloodInventory");
    if (savedInventory) setInventory(JSON.parse(savedInventory));
  }, []);

  // Save inventory to localStorage
  useEffect(() => {
    localStorage.setItem("bloodInventory", JSON.stringify(inventory));
  }, [inventory]);

  // Add blood units
  const handleAddUnits = () => {
    if (amount <= 0) return;
    setInventory((prev) =>
      prev.map((item) =>
        item.type === selectedType ? { ...item, units: item.units + amount } : item
      )
    );
    setAmount(0);
  };

  // Remove blood units
  const handleRemoveUnits = () => {
    if (amount <= 0) return;
    setInventory((prev) =>
      prev.map((item) =>
        item.type === selectedType
          ? { ...item, units: Math.max(0, item.units - amount) }
          : item
      )
    );
    setAmount(0);
  };

  return (
    <div className="flex">
      <BloodbankSidebar />
      <div className="ml-64 w-full">
        <NotificationHeader />

        <main className="pt-20 p-8 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
          <h1 className="text-3xl font-bold text-red-500 mb-8">Manage Blood Inventory</h1>

          {/* Inventory Table */}
          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">Current Blood Stock</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left p-3">Blood Type</th>
                  <th className="text-left p-3">Available Units</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.type} className="border-b border-gray-700">
                    <td className="p-3">{item.type}</td>
                    <td className="p-3">{item.units}</td>
                    <td
                      className={`p-3 ${
                        item.units < 100
                          ? "text-red-400"
                          : item.units < 300
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {item.units < 100
                        ? "Low"
                        : item.units < 300
                        ? "Moderate"
                        : "Healthy"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Manage Stock Controls */}
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-gray-300">Update Inventory</h2>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded-lg"
              >
                {inventory.map((item) => (
                  <option key={item.type} value={item.type}>
                    {item.type}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter units"
                className="bg-gray-700 text-white p-2 rounded-lg w-32"
              />
              <button
                onClick={handleAddUnits}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
              >
                ➕ Add Units
              </button>
              <button
                onClick={handleRemoveUnits}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
              >
                ➖ Remove Units
              </button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
