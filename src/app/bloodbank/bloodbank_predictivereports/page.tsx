"use client";

import { useState, useEffect } from "react";
import BloodbankSidebar from "../components/bloodbank_sidebar";
import BloodbankHeader from "../components/bloodbankheader";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const mockPredictionData = [
  { month: "Jan", predictedBloodUnits: 120 },
  { month: "Feb", predictedBloodUnits: 150 },
  { month: "Mar", predictedBloodUnits: 130 },
  { month: "Apr", predictedBloodUnits: 160 },
  { month: "May", predictedBloodUnits: 180 },
  { month: "Jun", predictedBloodUnits: 140 },
  { month: "Jul", predictedBloodUnits: 170 },
  { month: "Aug", predictedBloodUnits: 190 },
];

export default function PredictiveReports() {
  const [data, setData] = useState(mockPredictionData);
  const [notifications] = useState([
    { id: 1, message: "New blood request received" },
    { id: 2, message: "O+ stock is running low" },
    { id: 3, message: "Appointment scheduled for tomorrow" },
  ]);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    // fetch('/api/predictions').then(res => res.json()).then(setData)
  }, []);

  return (
    <div className="flex">
      <BloodbankSidebar />
      <div className="ml-64 w-full">
        <BloodbankHeader />

        <main className="p-8 min-h-screen bg-gray-200 w-full relative">
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
                      <li key={note.id} className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        {note.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-red-500 mb-6">Predictive Reports</h1>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-black">
            <h2 className="text-2xl font-semibold mb-4">Blood Units Prediction</h2>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="predictedBloodUnits" stroke="#FF0000" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 text-black">
            <h2 className="text-2xl font-semibold mb-4">Summary</h2>
            <ul className="list-disc pl-5">
              <li>Total predicted blood units for next 8 months: {data.reduce((sum, d) => sum + d.predictedBloodUnits, 0)}</li>
              <li>Highest predicted demand: {Math.max(...data.map(d => d.predictedBloodUnits))} units</li>
              <li>Lowest predicted demand: {Math.min(...data.map(d => d.predictedBloodUnits))} units</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
