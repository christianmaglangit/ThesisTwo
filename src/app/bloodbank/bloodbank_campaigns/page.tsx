"use client";

import { useState } from "react";
import BloodbankSidebar from "../components/bloodbank_sidebar";

// Type for campaign
interface BloodCampaign {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
}

// Mock campaigns
const initialCampaigns: BloodCampaign[] = [
  { id: 1, title: "Red Cross Donation Drive", date: "2025-09-05", time: "09:00", location: "St. Peter's College Gym" },
  { id: 2, title: "Community Blood Drive", date: "2025-09-12", time: "10:00", location: "City Health Center" },
  { id: 3, title: "University Blood Donation Week", date: "2025-09-20", time: "08:30", location: "University Campus Hall" },
];

// Notification Header Component
function NotificationHeader() {
  const [notifications] = useState([
    { id: 1, message: "New campaign added" },
    { id: 2, message: "Blood request approved" },
  ]);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-gray-900 text-white flex items-center justify-end px-6 shadow z-50">
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

export default function BloodlettingCampaigns() {
  const [campaigns, setCampaigns] = useState<BloodCampaign[]>(initialCampaigns);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [editingCampaign, setEditingCampaign] = useState<BloodCampaign | null>(null);

  // Add new campaign
  const handleAddCampaign = () => {
    if (!title || !date || !time || !location) return;
    const newCampaign: BloodCampaign = {
      id: Date.now(),
      title,
      date,
      time,
      location,
    };
    setCampaigns((prev) => [...prev, newCampaign]);
    setTitle(""); setDate(""); setTime(""); setLocation("");
  };

  // Delete campaign
  const handleDelete = (id: number) => {
    setCampaigns((prev) => prev.filter((camp) => camp.id !== id));
  };

  // Open edit form
  const handleEdit = (camp: BloodCampaign) => {
    setEditingCampaign(camp);
  };

  // Save edited campaign
  const handleSaveEdit = () => {
    if (!editingCampaign) return;
    setCampaigns((prev) =>
      prev.map((camp) => (camp.id === editingCampaign.id ? editingCampaign : camp))
    );
    setEditingCampaign(null);
  };

  return (
    <div className="flex">
      <BloodbankSidebar />
      <div className="ml-64 w-full">
        <NotificationHeader />
        <main className="pt-20 p-8 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
          <h1 className="text-3xl font-bold text-red-500 mb-6">Bloodletting Campaigns</h1>

          {/* Add new campaign */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-black max-w-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Add New Campaign</h2>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Campaign Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <button
              onClick={handleAddCampaign}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold w-full"
            >
              Add Campaign
            </button>
          </div>

          {/* Campaign list */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-black">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Campaigns</h2>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Time</th>
                  <th className="border px-4 py-2">Location</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((camp) => (
                  <tr key={camp.id} className="text-center">
                    <td className="border px-4 py-2">{camp.title}</td>
                    <td className="border px-4 py-2">{camp.date}</td>
                    <td className="border px-4 py-2">{camp.time}</td>
                    <td className="border px-4 py-2">{camp.location}</td>
                    <td className="border px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(camp)}
                        className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(camp.id)}
                        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit campaign modal */}
          {editingCampaign && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-black max-w-lg w-full">
                <h2 className="text-2xl font-semibold mb-4">Edit Campaign</h2>
                <div className="mb-3">
                  <label className="block mb-1 font-semibold">Campaign Title</label>
                  <input
                    type="text"
                    value={editingCampaign.title}
                    onChange={(e) =>
                      setEditingCampaign({ ...editingCampaign, title: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-semibold">Date</label>
                  <input
                    type="date"
                    value={editingCampaign.date}
                    onChange={(e) =>
                      setEditingCampaign({ ...editingCampaign, date: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-semibold">Time</label>
                  <input
                    type="time"
                    value={editingCampaign.time}
                    onChange={(e) =>
                      setEditingCampaign({ ...editingCampaign, time: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-semibold">Location</label>
                  <input
                    type="text"
                    value={editingCampaign.location}
                    onChange={(e) =>
                      setEditingCampaign({ ...editingCampaign, location: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingCampaign(null)}
                    className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                  >
                    Save
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
