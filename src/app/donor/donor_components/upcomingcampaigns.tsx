"use client";
import { useState } from "react";

export default function UpcomingCampaigns() {
  const campaigns = [
    { date: "September 10, 2025", location: "City Hall Plaza" },
    { date: "September 15, 2025", location: "University Campus" },
    { date: "September 20, 2025", location: "Community Center" },
    { date: "September 25, 2025", location: "Red Cross Branch" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredCampaigns = campaigns.filter(
    (item) =>
      item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-1/2 bg-white p-5 rounded-xl shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Upcoming Campaigns</h3>
        <button
          onClick={() => setIsOpen(true)}
          className="text-red-500 underline underline-offset-2 decoration-red-500 hover:text-white hover:decoration-white text-sm font-medium"
        >
          View All
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by date or place..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-xl p-2 w-full text-sm"
        />
      </div>

      {/* Preview list */}
      <div className="space-y-4 max-h-[230px] overflow-hidden">
        {filteredCampaigns.map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-800 rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-white">{item.date}</p>
              <p className="text-sm text-gray-400">{item.location}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[500px] max-h-[80vh] overflow-hidden shadow-lg flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-700 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold">All Upcoming Campaigns</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:text-gray-500 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Search Bar in Modal */}
            <div className="flex items-center p-4 border-b border-gray-200 sticky top-[72px] bg-white z-10">
              <input
                type="text"
                placeholder="Search by date or place..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-xl p-2 w-full text-sm"
              />
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              {filteredCampaigns.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-white">{item.date}</p>
                    <p className="text-sm text-gray-400">{item.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
