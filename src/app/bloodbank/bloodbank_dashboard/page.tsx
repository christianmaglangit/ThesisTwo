"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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

// Notification Header Component
function NotificationHeader() {
  const [notifications] = useState([
    { id: 1, message: "New blood request pending" },
    { id: 2, message: "Appointment approved" },
  ]);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow-lg flex items-center justify-end px-6 ">
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

// Mock Data
const bloodData = [
  { type: "O-", stock: 200 },
  { type: "O+", stock: 800 },
  { type: "A-", stock: 150 },
  { type: "A+", stock: 950 },
  { type: "B-", stock: 400 },
  { type: "B+", stock: 700 },
  { type: "AB-", stock: 300 },
  { type: "AB+", stock: 1000 },
];

const recentRequests = [
  { id: "REQ101", patient: "Carlos", type: "O+", status: "Pending", date: "2025-08-20" },
  { id: "REQ102", patient: "Samantha", type: "A-", status: "Approved", date: "2025-08-22" },
  { id: "REQ103", patient: "David", type: "B+", status: "Urgent", date: "2025-08-23" },
  { id: "REQ104", patient: "Elena", type: "AB+", status: "Pending", date: "2025-08-25" },
];

export default function BloodBankDashboard() {
  return (
    <div className="flex">
      <BloodbankSidebar />
      <div className="ml-64 w-full">
        <BloodbankHeader />
        <NotificationHeader />

        <main className="pt-20 p-8 min-h-screen bg-gray-200 text-white">
          <h1 className="text-3xl font-bold text-red-600 mb-8">Dashboard</h1>

          {/* Analytics Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            <Card>
              <h2 className="text-lg font-semibold text-black mb-4">Blood Units by Type</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={bloodData}>
                  <XAxis dataKey="type" stroke="#000" />
                  <YAxis stroke="#000" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }} />
                  <Bar dataKey="stock" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-black mb-4">Recent Blood Requests</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-red-500 border-b border-gray-700">
                    <th className="text-left p-2">Request ID</th>
                    <th className="text-left p-2">Patient</th>
                    <th className="text-left p-2">Blood Type</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((req) => (
                    <tr key={req.id} className="border-b border-gray-700">
                      <td className="p-2">{req.id}</td>
                      <td className="p-2">{req.patient}</td>
                      <td className="p-2">{req.type}</td>
                      <td
                        className={`p-2 ${
                          req.status === "Urgent"
                            ? "text-red-500"
                            : req.status === "Approved"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {req.status}
                      </td>
                      <td className="p-2 text-black">{req.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Card>
              <h2 className="text-lg font-semibold text-black">Blood Inventory</h2>
              <p className="text-3xl font-bold text-red-500 mt-2">4,500 Units</p>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold text-black">Pending Blood Requests</h2>
              <p className="text-3xl font-bold text-yellow-400 mt-2">12 Urgent</p>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold text-black">Appointments</h2>
              <p className="text-3xl font-bold text-blue-400 mt-2">58 Scheduled</p>
            </Card>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Card>
              <div className="text-4xl mb-4">🩸</div>
              <h2 className="text-xl font-semibold mb-2">Manage Blood Inventory</h2>
              <p className="text-gray-600 text-sm">Track and manage the current blood inventory.</p>
            </Card>

            <Card>
              <div className="text-4xl mb-4">📅</div>
              <h2 className="text-xl font-semibold mb-2">Manage Donor Appointments</h2>
              <p className="text-gray-600 text-sm">View and schedule donor appointments.</p>
            </Card>

            <Card>
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-xl font-semibold mb-2">Predictive Reports Log</h2>
              <p className="text-gray-600 text-sm">Generate and review predictive reports.</p>
            </Card>

            <Card>
              <div className="text-4xl mb-4">🔑</div>
              <h2 className="text-xl font-semibold mb-2">Generate QR Code</h2>
              <p className="text-gray-600 text-sm">Generate unique QR codes for blood donations and tracking.</p>
            </Card>

            <Card>
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-xl font-semibold mb-2">Manage Bloodletting Campaign</h2>
              <p className="text-gray-600 text-sm">Plan and organize upcoming bloodletting campaigns.</p>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
