"use client";
import { useState } from "react";
import Image from "next/image";

export default function UpcomingCampaigns() {
  const [search, setSearch] = useState("");

  const campaigns = [
    { id: 1, name: "Waarey 20 Drive", location: "Cebu City", date: "2025-09-09" },
    { id: 2, name: "Red Hope Drive", location: "Manila", date: "2025-09-15" },
    { id: 3, name: "Life Saver Event", location: "Davao", date: "2025-09-20" },
    { id: 4, name: "Blood Unity", location: "Iloilo", date: "2025-09-25" },
    { id: 5, name: "Heart for Life", location: "Bacolod", date: "2025-10-01" },
  ];

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.date.includes(search)
  );

  return (
    <div className="w-1/2 bg-white p-5 rounded-xl shadow-xl">
      {/* Title and Search Bar in Same Row */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Upcoming Campaigns</h3>
        <input
          type="text"
          placeholder="Search by date or place..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-1/2"
        />
      </div>

      <div className="relative h-[230px] overflow-hidden">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide h-full">
          {filteredCampaigns.length > 0 ? (
            filteredCampaigns.map((campaign, idx) => (
              <div
                key={campaign.id}
                className="bg-gray-800 text-white rounded-xl p-4 flex-shrink-0 w-[250px] sm:w-[220px] md:w-[200px] lg:w-[180px]"
              >
                <Image
                  src={`/images/campaign${idx + 1}.png`}
                  width={180}
                  height={100}
                  alt="Campaign"
                  className="rounded-lg mb-2"
                />
                <p className="font-semibold">{campaign.name}</p>
                <p className="text-sm text-gray-400">
                  {campaign.location} • {campaign.date}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No campaigns found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
