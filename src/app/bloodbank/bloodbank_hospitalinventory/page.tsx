"use client";

import { useState, useEffect } from "react";
import BloodbankSidebar from "../components/bloodbank_sidebar";
import BloodbankHeader from "../components/bloodbankheader";

// Blood item type
type BloodInventoryItem = {
  id: number;
  type: string;
  units: number;
  collectedAt: string;
  expiresAt: string;
};

// All blood types
const allBloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

// Format date (MM-DD-YYYY)
function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

// Expiry color + status
function getExpiryColor(expiry: string) {
  if (!expiry) return "text-gray-400";
  const today = new Date();
  const expDate = new Date(expiry);
  const diffDays = Math.ceil(
    (expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays < 0) return "text-red-500 font-bold";
  if (diffDays <= 7) return "text-orange-500 font-bold";
  return "text-green-500 font-bold";
}

export default function HospitalInventory() {
  const [inventory, setInventory] = useState<BloodInventoryItem[]>([]);
  const [activeSheet, setActiveSheet] = useState("O+");

  // Load from localStorage (or later backend)
  useEffect(() => {
    const saved = localStorage.getItem("bloodInventory");
    if (saved) setInventory(JSON.parse(saved));
  }, []);

  // Filter and sort items for active sheet
  const filteredItems = inventory
    .filter((item) => item.type === activeSheet)
    .sort(
      (a, b) =>
        new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
    );

  return (
    <div className="flex">
      <BloodbankSidebar />
      <div className="ml-64 w-full">
        <BloodbankHeader />
        <main className="pt-20 p-8 min-h-screen bg-gray-100 text-black">
          <h1 className="text-3xl font-bold text-red-600 mb-8">
            Hospital Blood Inventory
          </h1>

          {/* Card wrapper */}
          <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
            {/* Blood Type Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {allBloodTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveSheet(type)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    activeSheet === type
                      ? "bg-red-600 text-white"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  {type} Sheet
                </button>
              ))}
            </div>

            {/* Table Title */}
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {activeSheet} Inventory
            </h2>

            {/* Table or Message */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500 font-medium">
                🚨 No blood units available for{" "}
                <span className="font-bold">{activeSheet}</span>.
              </div>
            ) : (
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-300">
                    <th className="text-left p-3">Blood Type</th>
                    <th className="text-left p-3">Units</th>
                    <th className="text-left p-3">Collected At</th>
                    <th className="text-left p-3">Expiry Date</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="p-3">{item.type}</td>
                      <td className="p-3">{item.units}</td>
                      <td className="p-3">{formatDate(item.collectedAt)}</td>
                      <td className="p-3">{formatDate(item.expiresAt)}</td>
                      <td className={`p-3 ${getExpiryColor(item.expiresAt)}`}>
                        {new Date(item.expiresAt) < new Date()
                          ? "Expired"
                          : new Date(item.expiresAt).getTime() - Date.now() <=
                            7 * 24 * 60 * 60 * 1000
                          ? "Expiring Soon"
                          : "OK"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
