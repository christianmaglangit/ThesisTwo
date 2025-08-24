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
    { id: 1, message: "New receipt confirmed" },
    { id: 2, message: "Pending blood delivery" },
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

// Type for receipt confirmation
interface BloodReceipt {
  id: number;
  hospital: string;
  bloodType: string;
  units: number;
  receivedDate: string;
  receivedTime: string;
  status: string;
  comments: string;
}

// Mock data
const initialReceipts: BloodReceipt[] = [
  {
    id: 1,
    hospital: "City Hospital",
    bloodType: "O+",
    units: 2,
    receivedDate: "2025-08-26",
    receivedTime: "09:30",
    status: "Confirmed",
    comments: "All units received correctly.",
  },
  {
    id: 2,
    hospital: "St. Peter's Clinic",
    bloodType: "A-",
    units: 1,
    receivedDate: "2025-08-26",
    receivedTime: "14:15",
    status: "Mistaken Delivery",
    comments: "Wrong blood type delivered. Please replace.",
  },
  {
    id: 3,
    hospital: "General Hospital",
    bloodType: "B+",
    units: 3,
    receivedDate: "2025-08-25",
    receivedTime: "",
    status: "Pending",
    comments: "",
  },
];

export default function ViewReceiptConfirmation() {
  const [receipts] = useState<BloodReceipt[]>(initialReceipts);

  return (
    <div className="flex">
      <BloodbankSidebar />
      <div className="ml-64 w-full">
        <NotificationHeader />

        <main className="pt-20 p-8 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
          <h1 className="text-3xl font-bold text-red-500 mb-6">View Receipt Confirmation</h1>

          <Card>
            <h2 className="text-2xl font-semibold mb-4 text-gray-300">Blood Unit Receipts</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="border px-4 py-2">Hospital</th>
                    <th className="border px-4 py-2">Blood Type</th>
                    <th className="border px-4 py-2">Units</th>
                    <th className="border px-4 py-2">Received Date</th>
                    <th className="border px-4 py-2">Received Time</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((r) => (
                    <tr key={r.id} className="text-center border-b border-gray-600">
                      <td className="px-4 py-2">{r.hospital}</td>
                      <td className="px-4 py-2">{r.bloodType}</td>
                      <td className="px-4 py-2">{r.units}</td>
                      <td className="px-4 py-2">{r.receivedDate}</td>
                      <td className="px-4 py-2">{r.receivedTime || "-"}</td>
                      <td
                        className={`px-4 py-2 font-semibold ${
                          r.status === "Mistaken Delivery"
                            ? "text-red-400"
                            : r.status === "Pending"
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      >
                        {r.status}
                      </td>
                      <td className="px-4 py-2">{r.comments || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
