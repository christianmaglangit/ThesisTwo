"use client";

import { useState, useRef } from "react";
import BloodbankSidebar from "../components/bloodbank_sidebar";
import BloodbankHeader from "../components/bloodbankheader";
import { QRCodeCanvas } from "qrcode.react";

// Simple Card Component
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl shadow-lg p-6 bg-white text-black ${className || ""}`}>
      {children}
    </div>
  );
}

// ✅ Notification Header with dropdown (like Appointment page)
function NotificationHeader() {
  const [open, setOpen] = useState(false);

  const notifications = [
    { id: 1, message: "New QR code generated" },
    { id: 2, message: "Donor data updated" },
    { id: 3, message: "Stock levels checked" },
  ];

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow-md text-white flex items-center justify-end px-6">
      <div className="relative">
        {/* Bell */}
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
    </header>
  );
}

export default function GenerateQRCode() {
  const [donorName, setDonorName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [donorId, setDonorId] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [showModal, setShowModal] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!donorName || !bloodType || !donorId) return;
    const data = `DonorID: ${donorId}\nName: ${donorName}\nBloodType: ${bloodType}`;
    setQrValue(data);
    setShowModal(true);
  };

  const handlePrint = () => {
    if (qrRef.current) {
      const printContents = qrRef.current.innerHTML;
      const newWindow = window.open("", "", "width=600,height=600");
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Print QR Code</title>
            </head>
            <body style="text-align:center; font-family: Arial, sans-serif;">
              ${printContents}
              <script>
                window.onload = function() { window.print(); window.close(); }
              </script>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    }
  };

  return (
    <div className="flex">
      <BloodbankSidebar />
      <div className="ml-64 w-full">
        <BloodbankHeader />
        {/* ✅ Updated Notification Bell */}
        <NotificationHeader />

        <main className="pt-20 p-8 min-h-screen bg-gray-200">
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
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold w-full"
            >
              Generate QR Code
            </button>
          </Card>

          {/* ✅ Modal for QR Code */}
          {showModal && (
            <div className="fixed inset-0 backdrop-blur-sm bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-black max-w-md w-full relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-red-600"
                >
                  ✖
                </button>
                <h2 className="text-2xl font-semibold mb-4 text-center">Donor QR Code</h2>
                <div ref={qrRef} className="flex flex-col items-center">
                  <QRCodeCanvas value={qrValue} size={200} bgColor="#ffffff" fgColor="#000000" />
                  <p className="mt-2 font-semibold">{donorName} ({bloodType})</p>
                  <p className="text-sm text-gray-600">ID: {donorId}</p>
                </div>
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handlePrint}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold"
                  >
                    Print QR Code
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
