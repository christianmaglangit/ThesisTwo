"use client";

import { useState } from "react";
import BloodbankSidebar from "../components/bloodbank_sidebar";
import BloodbankHeader from "../components/bloodbankheader";

// Mock data with status + remarks
const sampleAppointments = [
  { id: "D001", name: "Juan Dela Cruz", day: "2025-09-04", donated: 1, status: "Success" },
  { id: "D002", name: "Maria Santos", day: "2025-09-01", donated: 0, status: "Failed", remarks: "Low hemoglobin level" },
  { id: "D003", name: "Pedro Lopez", day: "2025-09-06", donated: 1, status: "Success" },
  { id: "D004", name: "Ana Reyes", day: "2025-09-05", donated: 3, status: "Success" },
  { id: "D005", name: "Mark Tan", day: "2025-09-29", donated: 0, status: "Failed", remarks: "High blood pressure" },
  { id: "D005", name: "Mark Tan", day: "2025-04-06", donated: 3, status: "Success" },
  { id: "D005", name: "Mark Tan", day: "2025-01-05", donated: 1, status: "Success" },
];

export default function AppointmentHistory() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [selectedFailed, setSelectedFailed] = useState<any | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);

  // Notifications mock
  const [notifications] = useState([
    { id: 1, message: "New donor registered" },
    { id: 2, message: "A donor failed screening today" },
    { id: 3, message: "Upcoming appointment tomorrow" },
  ]);

  // Format YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const today = formatDate(currentDate);

  // 🔎 Filter logic
  const filteredAppointments = search
    ? sampleAppointments.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.id.toLowerCase().includes(search.toLowerCase()) ||
          a.day.includes(search)
      )
    : sampleAppointments.filter((a) => a.day === today);

  // Total donations (only count Success)
  const totalDonations = filteredAppointments.reduce(
    (sum, a) => (a.status === "Success" ? sum + a.donated : sum),
    0
  );

  // Next & Previous Day
  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 1);
    setCurrentDate(next);
  };
  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 1);
    setCurrentDate(prev);
  };
  const handleToday = () => {
    setCurrentDate(new Date());
    setSearch("");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <BloodbankSidebar />
      <div className="ml-64 w-full">
        <BloodbankHeader />
        {/* Main Content */}
        <main className="pt-20 p-8 min-h-screen bg-gray-200 text-white">
          {/* Notification Bell */}
          <div className="absolute top-4 right-8">
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

          <h1 className="text-3xl font-bold text-red-500 mb-6">
            Appointment History
          </h1>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-black">
            {/* Controls (Inside Card now) */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevDay}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white"
                >
                  ← Back
                </button>
                <button
                  onClick={handleToday}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white"
                >
                  Today
                </button>
                <button
                  onClick={handleNextDay}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white"
                >
                  Next →
                </button>
                {!search && (
                  <span className="ml-4 font-semibold text-lg">{today}</span>
                )}
              </div>

              <input
                type="text"
                placeholder="Search by Name, ID, or Day"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white border text-black w-full md:w-80"
              />
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              {search
                ? `Search Results for "${search}"`
                : `Donors for ${today}`}
            </h2>

            {filteredAppointments.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="p-3 text-left">Donor ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Day</th>
                    <th className="p-3 text-left">Donated (Units)</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((a) => (
                    <tr key={a.id + a.day} className="border-b hover:bg-gray-100">
                      <td className="p-3">{a.id}</td>
                      <td className="p-3">{a.name}</td>
                      <td className="p-3">{a.day}</td>
                      <td className="p-3">
                        {a.status === "Failed" ? "" : a.donated}
                      </td>
                      <td className="p-3">
                        {a.status === "Success" ? (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-200 text-green-800">
                            Success
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedFailed(a)}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-red-200 text-red-800 hover:bg-red-300"
                          >
                            Failed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No appointments found.</p>
            )}

            {/* Total Donations */}
            <div className="mt-4 text-right font-bold text-gray-800">
              Total Donations: {totalDonations}
            </div>
          </div>
        </main>
      </div>

      {/* Modal for Failed Donation */}
      {selectedFailed && (
        <div className="fixed inset-0 backdrop-blur-sm text-black flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Failed Donation
            </h2>
            <p className="mb-2">
              <span className="font-semibold text-black">Donor:</span>{" "}
              {selectedFailed.name} ({selectedFailed.id})
            </p>
            <p className="mb-2">
              <span className="font-semibold text-black">Date:</span>{" "}
              {selectedFailed.day}
            </p>
            <p className="mb-2">
              <span className="font-semibold text-black">Units:</span>{" "}
              {selectedFailed.donated}
            </p>
            <textarea
              readOnly
              value={selectedFailed.remarks || "No remarks provided"}
              className="w-full p-2 border rounded-lg bg-gray-100 text-black resize-none h-24"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedFailed(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
