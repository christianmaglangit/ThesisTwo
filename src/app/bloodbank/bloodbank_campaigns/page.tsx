"use client";

import { useState } from "react";
import BloodbankSidebar from "../components/bloodbank_sidebar";
import BloodbankHeader from "../components/bloodbankheader";

// Type for campaign
interface BloodCampaign {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
}

// Mock campaigns
const initialCampaigns: BloodCampaign[] = [
  { id: 1, title: "Red Cross Donation Drive", date: "2025-09-05", startTime: "09:00", endTime: "15:00", location: "St. Peter's College Gym" },
  { id: 2, title: "Community Blood Drive", date: "2025-09-12", startTime: "10:00", endTime: "14:00", location: "City Health Center" },
  { id: 3, title: "University Blood Donation Week", date: "2025-09-20", startTime: "08:30", endTime: "17:00", location: "University Campus Hall" },
];

// ✅ Helper function to convert 24h → 12h format
const formatTime12Hour = (time: string) => {
  if (!time) return "";
  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${suffix}`;
};

// ✅ Notification Header Component with dropdown (same as appointment page)
function NotificationHeader() {
  const [notifications] = useState([
    { id: 1, message: "New campaign added" },
    { id: 2, message: "Blood request approved" },
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

export default function BloodlettingCampaigns() {
  const [campaigns, setCampaigns] = useState<BloodCampaign[]>(initialCampaigns);

  // States for modal add campaign
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");

  // Edit modal
  const [editingCampaign, setEditingCampaign] = useState<BloodCampaign | null>(null);

  // Add new campaign
  const handleAddCampaign = () => {
    if (!title || !date || !startTime || !endTime || !location) return;
    const newCampaign: BloodCampaign = {
      id: Date.now(),
      title,
      date,
      startTime,
      endTime,
      location,
    };
    setCampaigns((prev) => [...prev, newCampaign]);
    setTitle(""); setDate(""); setStartTime(""); setEndTime(""); setLocation("");
    setShowAddModal(false);
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
        <BloodbankHeader />
        <NotificationHeader />
        <main className="pt-20 p-8 min-h-screen bg-gray-200 text-white">
          <h1 className="text-3xl font-bold text-red-600 mb-6">Bloodletting Campaigns</h1>

          {/* Campaign list */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-black">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Campaigns</h2>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Start Time</th>
                  <th className="border px-4 py-2">End Time</th>
                  <th className="border px-4 py-2">Location</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((camp) => (
                  <tr key={camp.id} className="text-center">
                    <td className="border px-4 py-2">{camp.title}</td>
                    <td className="border px-4 py-2">{camp.date}</td>
                    {/* ✅ Convert times here */}
                    <td className="border px-4 py-2">{formatTime12Hour(camp.startTime)}</td>
                    <td className="border px-4 py-2">{formatTime12Hour(camp.endTime)}</td>
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

            {/* Add Campaign Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold text-white"
              >
                + Add New Campaign
              </button>
            </div>
          </div>

          {/* Add campaign modal */}
          {showAddModal && (
            <div className="fixed inset-0 backdrop-blur-smackdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-black max-w-lg w-full">
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
                  <label className="block mb-1 font-semibold">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-semibold">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
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
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCampaign}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit campaign modal */}
          {editingCampaign && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
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
                  <label className="block mb-1 font-semibold">Start Time</label>
                  <input
                    type="time"
                    value={editingCampaign.startTime}
                    onChange={(e) =>
                      setEditingCampaign({ ...editingCampaign, startTime: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-semibold">End Time</label>
                  <input
                    type="time"
                    value={editingCampaign.endTime}
                    onChange={(e) =>
                      setEditingCampaign({ ...editingCampaign, endTime: e.target.value })
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
