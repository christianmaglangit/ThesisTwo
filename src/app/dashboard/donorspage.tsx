"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DonorDashboard() {
  const router = useRouter();

  // Example donor data (later i-fetch nimo from API)
  const [donor] = useState({
    name: "Juan Dela Cruz",
    bloodType: "O+",
    totalDonations: 5,
    nextSchedule: "2025-09-15",
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-red-600">Donor Dashboard</h1>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
        >
          Logout
        </button>
      </div>

      {/* Welcome */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome, {donor.name}! 👋
        </h2>
        <p className="text-gray-600 mt-1">
          Thank you for being a lifesaver! ❤️
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center">
          <h3 className="text-lg font-bold text-red-700">
            {donor.totalDonations}
          </h3>
          <p className="text-gray-600">Total Donations</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center">
          <h3 className="text-lg font-bold text-blue-700">{donor.bloodType}</h3>
          <p className="text-gray-600">Blood Type</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-center">
          <h3 className="text-lg font-bold text-green-700">
            {donor.nextSchedule}
          </h3>
          <p className="text-gray-600">Next Schedule</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition">
          Schedule Donation
        </button>
        <button className="bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition">
          View History
        </button>
        <button className="bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
