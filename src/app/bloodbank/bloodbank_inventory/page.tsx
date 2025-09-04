"use client";

import { useState, useEffect } from "react";
import BloodbankSidebar from "../components/bloodbank_sidebar";
import BloodbankHeader from "../components/bloodbankheader";

// Simple Card Component
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl shadow-lg p-6 bg-white text-gray-700 ${className || ""}`}>
      {children}
    </div>
  );
}

type BloodInventoryItem = {
  id: number;
  type: string;
  component: string;
  units: number;
  collectedAt: string;
  expiresAt: string;
};

const allBloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];
const bloodComponents = ["Whole Blood", "Plasma", "Platelets", "Red Blood Cells"];

// Helpers
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

// ✅ Sorting helper
function sortByExpiry(a: BloodInventoryItem, b: BloodInventoryItem) {
  const today = new Date();
  const expA = new Date(a.expiresAt).getTime();
  const expB = new Date(b.expiresAt).getTime();
  const diffA = expA - today.getTime();
  const diffB = expB - today.getTime();
  if (diffA < 0 && diffB >= 0) return -1;
  if (diffB < 0 && diffA >= 0) return 1;
  if (diffA < 0 && diffB < 0) return expA - expB;
  if (diffA <= 7 * 24 * 60 * 60 * 1000 && diffB > 7 * 24 * 60 * 60 * 1000) return -1;
  if (diffB <= 7 * 24 * 60 * 60 * 1000 && diffA > 7 * 24 * 60 * 60 * 1000) return 1;
  return expA - expB;
}

// 🔹 Generate Example Data (5 items each type)
function generateMockInventory(): BloodInventoryItem[] {
  const items: BloodInventoryItem[] = [];
  const now = new Date();

  allBloodTypes.forEach((type, tIndex) => {
    for (let i = 0; i < 5; i++) {
      const collectedAt = new Date(now.getTime() - i * 24 * 60 * 60 * 1000); // collected past i days
      const expiresAt = new Date(collectedAt.getTime() + (20 + i * 2) * 24 * 60 * 60 * 1000); // expires in ~20+ days
      items.push({
        id: Date.now() + tIndex * 10 + i,
        type,
        component: bloodComponents[i % bloodComponents.length],
        units: 1 + (i % 5),
        collectedAt: collectedAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
      });
    }
  });

  return items;
}

export default function BloodBankInventory() {
  const [inventory, setInventory] = useState<BloodInventoryItem[]>([]);
  const [activeSheet, setActiveSheet] = useState("O+");
  const [component, setComponent] = useState("Whole Blood");
  const [amount, setAmount] = useState<number>(0);
  const [collectedAt, setCollectedAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Load initial data
  useEffect(() => {
    const saved = localStorage.getItem("bloodInventory");
    if (saved) {
      setInventory(JSON.parse(saved));
    } else {
      const mock = generateMockInventory();
      setInventory(mock);
      localStorage.setItem("bloodInventory", JSON.stringify(mock));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bloodInventory", JSON.stringify(inventory));
  }, [inventory]);

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
                component,
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
        component,
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

  const handleRemoveUnits = (id: number) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEditUnits = (item: BloodInventoryItem) => {
    setAmount(item.units);
    setComponent(item.component);
    setCollectedAt(item.collectedAt);
    setExpiresAt(item.expiresAt);
    setEditId(item.id);
    setShowModal(true);
  };

  return (
    <div className="flex">
      <BloodbankSidebar />
      <div className="ml-64 w-full">
        <BloodbankHeader />

        <main className="pt-20 p-8 min-h-screen bg-gray-200 text-black">
          <h1 className="text-3xl font-bold text-red-500 mb-8">Manage Blood Inventory</h1>

          {/* Inventory Table */}
          <Card className="mb-8 overflow-x-auto">
            <div className="flex flex-wrap gap-3 mb-6 text-white">
              {allBloodTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveSheet(type)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    activeSheet === type ? "bg-red-600 text-white" : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {type} Sheet
                </button>
              ))}
            </div>

            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {activeSheet} Inventory
            </h2>

            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left p-3 text-gray-700">Blood Type</th>
                  <th className="text-left p-3 text-gray-700">Component</th>
                  <th className="text-left p-3 text-gray-700">Units</th>
                  <th className="text-left p-3 text-gray-700">Collected At</th>
                  <th className="text-left p-3 text-gray-700">Expiry Date</th>
                  <th className="text-left p-3 text-gray-700">Status</th>
                  <th className="text-left p-3 text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory
                  .filter((item) => item.type === activeSheet)
                  .sort(sortByExpiry)
                  .map((item) => (
                    <tr key={item.id} className="border-b border-gray-700">
                      <td className="p-3">{item.type}</td>
                      <td className="p-3">{item.component}</td>
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
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveUnits(item.id)}
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-white"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setEditId(null);
                  setAmount(0);
                  setCollectedAt("");
                  setExpiresAt("");
                  setComponent("Whole Blood");
                  setShowModal(true);
                }}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-white"
              >
                ➕ Add {activeSheet} Stock
              </button>
            </div>
          </Card>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-60 z-50">
              <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4 text-black">
                  {editId ? "Edit" : "Add"} {activeSheet} Stock
                </h2>
                <div className="flex flex-col gap-4">
                  <select
                    value={component}
                    onChange={(e) => setComponent(e.target.value)}
                    className="bg-gray-200 text-black p-2 rounded-lg w-full"
                  >
                    {bloodComponents.map((comp) => (
                      <option key={comp} value={comp}>
                        {comp}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Enter units"
                    className="bg-gray-200 text-black p-2 rounded-lg w-full"
                  />
                  <input
                    type="datetime-local"
                    value={collectedAt}
                    onChange={(e) => setCollectedAt(e.target.value)}
                    className="bg-gray-200 text-black p-2 rounded-lg w-full"
                  />
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="bg-gray-200 text-black p-2 rounded-lg w-full"
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddUnits}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
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
