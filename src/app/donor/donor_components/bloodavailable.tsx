"use client";

import { useState } from "react";

const hospitals = [
  {
    name: "Manila General Hospital",
    address: "123 Health St, Manila",
    city: "Manila",
    stocks: {
      "O+": { "Red Blood Cells": "Available", Plasma: "Low Stock", Platelets: "Available", "Whole Blood": "Critical" },
      "O-": { "Red Blood Cells": "Low Stock", Plasma: "Available", Platelets: "Critical", "Whole Blood": "Available" },
      "A+": { "Red Blood Cells": "Available", Plasma: "Critical", Platelets: "Available", "Whole Blood": "Low Stock" },
      "A-": { "Red Blood Cells": "Low Stock", Plasma: "Available", Platelets: "Low Stock", "Whole Blood": "Available" },
      "B+": { "Red Blood Cells": "Low Stock", Plasma: "Available", Platelets: "Available", "Whole Blood": "Critical" },
      "B-": { "Red Blood Cells": "Critical", Plasma: "Low Stock", Platelets: "Available", "Whole Blood": "Available" },
      "AB+": { "Red Blood Cells": "Critical", Plasma: "Low Stock", Platelets: "Available", "Whole Blood": "Available" },
      "AB-": { "Red Blood Cells": "Available", Plasma: "Available", Platelets: "Low Stock", "Whole Blood": "Critical" },
    },
  },
  {
    name: "St. Luke's Medical Center",
    address: "456 Wellness Ave, Manila",
    city: "Manila",
    stocks: {
      "O+": { "Red Blood Cells": "Low Stock", Plasma: "Available", Platelets: "Low Stock", "Whole Blood": "Available" },
      "O-": { "Red Blood Cells": "Available", Plasma: "Critical", Platelets: "Available", "Whole Blood": "Low Stock" },
      "A+": { "Red Blood Cells": "Available", Plasma: "Available", Platelets: "Critical", "Whole Blood": "Available" },
      "A-": { "Red Blood Cells": "Critical", Plasma: "Available", Platelets: "Available", "Whole Blood": "Low Stock" },
      "B+": { "Red Blood Cells": "Available", Plasma: "Low Stock", Platelets: "Available", "Whole Blood": "Critical" },
      "B-": { "Red Blood Cells": "Low Stock", Plasma: "Critical", Platelets: "Available", "Whole Blood": "Available" },
      "AB+": { "Red Blood Cells": "Low Stock", Plasma: "Available", Platelets: "Low Stock", "Whole Blood": "Available" },
      "AB-": { "Red Blood Cells": "Available", Plasma: "Low Stock", Platelets: "Critical", "Whole Blood": "Available" },
    },
  },
  {
    name: "Makati Medical Center",
    address: "789 Care Blvd, Makati",
    city: "Makati",
    stocks: {
      "O+": { "Red Blood Cells": "Critical", Plasma: "Available", Platelets: "Low Stock", "Whole Blood": "Available" },
      "O-": { "Red Blood Cells": "Available", Plasma: "Low Stock", Platelets: "Critical", "Whole Blood": "Available" },
      "A+": { "Red Blood Cells": "Low Stock", Plasma: "Available", Platelets: "Available", "Whole Blood": "Critical" },
      "A-": { "Red Blood Cells": "Available", Plasma: "Critical", Platelets: "Available", "Whole Blood": "Low Stock" },
      "B+": { "Red Blood Cells": "Available", Plasma: "Available", Platelets: "Low Stock", "Whole Blood": "Available" },
      "B-": { "Red Blood Cells": "Low Stock", Plasma: "Available", Platelets: "Available", "Whole Blood": "Critical" },
      "AB+": { "Red Blood Cells": "Available", Plasma: "Low Stock", Platelets: "Available", "Whole Blood": "Critical" },
      "AB-": { "Red Blood Cells": "Critical", Plasma: "Available", Platelets: "Low Stock", "Whole Blood": "Available" },
    },
  },
];

const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const components = ["Red Blood Cells", "Plasma", "Platelets", "Whole Blood"];

function getStatusColor(status: string) {
  if (status === "Available") return "bg-green-100 text-green-700";
  if (status === "Low Stock") return "bg-yellow-100 text-yellow-700";
  if (status === "Critical") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
}

export default function BloodAvailable() {
  const [city, setCity] = useState("");
  const [bloodType, setBloodType] = useState("A+");
  const [component, setComponent] = useState("Red Blood Cells");

  // Always filter hospitals dynamically
  const filteredHospitals = hospitals.filter(
    (h) =>
      (!city || h.city.toLowerCase().includes(city.toLowerCase())) &&
      h.stocks[bloodType] &&
      h.stocks[bloodType][component]
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
        <div className="flex flex-col min-w-[160px]">
          <label className="text-sm font-semibold mb-1">Component</label>
          <select
            value={component}
            onChange={(e) => setComponent(e.target.value)}
            className="border rounded-lg px-3 py-2 text-gray-700"
          >
            {components.map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="mb-3 text-base font-semibold text-gray-700">
          Showing results for <span className="text-red-600">{bloodType}</span> (
          <span className="text-red-600">{component}</span>)
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
                    h.stocks[bloodType][component]
                  )}`}
                >
                  {h.stocks[bloodType][component]}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
