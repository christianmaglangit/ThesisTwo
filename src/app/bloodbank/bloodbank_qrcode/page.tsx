"use client";

import { useState } from "react";
import BloodbankSidebar from "../components/bloodbank_sidebar";
import { QRCodeCanvas } from "qrcode.react";

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
    { id: 1, message: "New QR code generated" },
    { id: 2, message: "Donor data updated" },
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

export default function GenerateQRCode() {
  const [donorName, setDonorName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [donorId, setDonorId] = useState("");
  const [qrValue, setQrValue] = useState("");

  const handleGenerate = () => {
    if (!donorName || !bloodType || !donorId) return;
    const data = `DonorID: ${donorId}\nName: ${donorName}\nBloodType: ${bloodType}`;
    setQrValue(data);
  };

  return (
    <div className="flex">
      <BloodbankSidebar />
      <div className="ml-64 w-full">
        <NotificationHeader />

        <main className="pt-20 p-8 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
          <h1 className="text-3xl font-bold text-red-500 mb-6">Generate Donor QR Code</h1>

          <Card className="max-w-lg mx-auto">
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Donor ID</label>
              <input
                type="text"
                value={donorId}
                onChange={(e) => setDonorId(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold">Donor Name</label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold">Blood Type</label>
              <input
                type="text"
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold w-full"
            >
              Generate QR Code
            </button>

            {qrValue && (
              <div className="mt-6 text-center">
                <h2 className="font-semibold mb-2">Donor QR Code</h2>
                <QRCodeCanvas value={qrValue} size={200} bgColor="#ffffff" fgColor="#000000" />
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
}
