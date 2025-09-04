"use client";

import { useState } from "react";
import BloodbankSidebar from "../components/bloodbank_sidebar";
import BloodbankHeader from "../components/bloodbankheader";

// Simple Card Component
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl shadow-lg p-6 bg-white text-black ${className || ""}`}>
      {children}
    </div>
  );
}

// Notification Header Component (DROPDOWN VERSION)
function NotificationHeader() {
  const [notifications] = useState([
    { id: 1, message: "New blood request pending" },
    { id: 2, message: "Request approved" },
  ]);
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow-md text-white flex items-center justify-end px-6">
      <div className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
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
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg z-50">
            <ul className="divide-y divide-gray-700">
              {notifications.map((n) => (
                <li key={n.id} className="p-3 hover:bg-gray-700 cursor-pointer">
                  {n.message}
                </li>
              ))}
              {notifications.length === 0 && (
                <li className="p-3 text-gray-400 text-center">No new notifications</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

// Type for blood request
interface BloodRequest {
  id: number;
  requester: string;
  bloodType: string;
  component: string;
  units: number;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
}

// Mock requests
const mockRequests: BloodRequest[] = [
  { id: 1, requester: "St. Peter Hospital", bloodType: "O+", component: "Red Blood Cells", units: 5, status: "Pending", date: "2025-08-26" },
  { id: 2, requester: "City Clinic", bloodType: "A-", component: "Plasma", units: 3, status: "Approved", date: "2025-08-27" },
  { id: 3, requester: "Health Center", bloodType: "B+", component: "Platelets", units: 2, status: "Pending", date: "2025-08-28" },
  { id: 4, requester: "Red Cross Branch", bloodType: "AB-", component: "Cryoprecipitate", units: 4, status: "Rejected", date: "2025-08-29" },
  { id: 5, requester: "Community Hospital", bloodType: "O-", component: "Plasma", units: 6, status: "Pending", date: "2025-08-30" },
];

export default function ManageBloodRequests() {
  const [requests, setRequests] = useState<BloodRequest[]>(mockRequests);

  // Approve request
  const handleApprove = (id: number) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    );
  };

  // Reject request
  const handleReject = (id: number) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r))
    );
  };

  return (
    <div className="flex">
      <BloodbankSidebar />
      <div className="ml-64 w-full">
        <BloodbankHeader />
        <NotificationHeader />

        <main className="pt-20 p-8 min-h-screen bg-gray-200 text-white">
          <h1 className="text-3xl font-bold text-red-500 mb-6">Manage Blood Requests</h1>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-auto border-collapse">
                <thead>
                  <tr className="bg-red-400 text-white">
                    <th className="border px-4 py-2">Requester</th>
                    <th className="border px-4 py-2">Blood Type</th>
                    <th className="border px-4 py-2">Component</th>
                    <th className="border px-4 py-2">Units</th>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} className="text-center border-b border-gray-600">
                      <td className="px-4 py-2">{req.requester}</td>
                      <td className="px-4 py-2">{req.bloodType}</td>
                      <td className="px-4 py-2">{req.component}</td>
                      <td className="px-4 py-2">{req.units}</td>
                      <td className="px-4 py-2">{req.date}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded ${
                            req.status === "Approved"
                              ? "bg-green-500 text-white"
                              : req.status === "Rejected"
                              ? "bg-red-500 text-white"
                              : "bg-yellow-400 text-black"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex justify-center gap-2">
                        {req.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
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
