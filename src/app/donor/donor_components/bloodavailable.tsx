"use client";

import { useState } from "react";

const hospitals = [
  {
    name: "Manila General Hospital",
    address: "123 Health St, Manila",
    city: "Manila",
    stocks: {
      "O+": "Available",
      "A+": "Available",
      "B+": "Low Stock",
      "AB+": "Critical",
    },
  },
  {
    name: "St. Luke's Medical Center",
    address: "456 Wellness Ave, Manila",
    city: "Manila",
    stocks: {
      "O+": "Low Stock",
      "A+": "Available",
      "B+": "Available",
      "AB+": "Low Stock",
    },
  },
  {
    name: "Makati Medical Center",
    address: "789 Care Blvd, Makati",
    city: "Makati",
    stocks: {
      "O+": "Critical",
      "A+": "Low Stock",
      "B+": "Available",
      "AB+": "Available",
    },
  },
];

const bloodTypes = ["O+", "A+", "B+", "AB+"];

function getStatusColor(status: string) {
  if (status === "Available") return "bg-green-100 text-green-700";
  if (status === "Low Stock") return "bg-yellow-100 text-yellow-700";
  if (status === "Critical") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
}

export default function BloodAvailable() {
  const [city, setCity] = useState("");
  const [bloodType, setBloodType] = useState("A+");

  // Always filter hospitals dynamically (no need for button anymore)
  const filteredHospitals = hospitals.filter(
    (h) =>
      (!city || h.city.toLowerCase().includes(city.toLowerCase())) &&
      h.stocks[bloodType]
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Check Blood Availability</h2>

      {/* Search Inputs */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex flex-col flex-1 min-w-[180px]">
          <label className="text-sm font-semibold mb-1">Location (City)</label>
          <input
            type="text"
            placeholder="e.g., Manila"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border rounded-lg px-3 py-2 text-gray-700"
          />
        </div>
        <div className="flex flex-col min-w-[120px]">
          <label className="text-sm font-semibold mb-1">Blood Type</label>
          <select
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            className="border rounded-lg px-3 py-2 text-gray-700"
          >
            {bloodTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="mb-3 text-base font-semibold text-gray-700">
          Showing results for <span className="text-red-600">{bloodType}</span>
          {city && (
            <>
              {" "}in <span className="text-red-600">{city}</span>
            </>
          )}
          :
        </div>

        <div className="flex flex-col gap-4">
          {filteredHospitals.length === 0 ? (
            <div className="text-gray-500">No hospitals found for this selection.</div>
          ) : (
            filteredHospitals.map((h, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow border px-5 py-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-lg">{h.name}</div>
                  <div className="text-gray-500 text-sm">{h.address}</div>
                </div>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    h.stocks[bloodType]
                  )}`}
                >
                  {h.stocks[bloodType]}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
