"use client";
import { useState } from "react";

export default function DonationHistory({ isOpen, setIsOpen }: any) {
  const history = [
    { date: "October 26, 2023", location: "City Blood Bank - Downtown", status: "Success" },
    { date: "October 26, 2023", location: "Red Cross Drive - Downtown", status: "Fail", comment: "Low hemoglobin level" },
    { date: "October 20, 2023", location: "Community Center Drive", status: "Success" },
    { date: "October 15, 2023", location: "University Blood Bank", status: "Success" },
  ];

  const fullHistory = [
    ...history,
    { date: "October 10, 2023", location: "Barangay Health Center", status: "Fail", comment: "Recent medication" },
    { date: "October 05, 2023", location: "Hospital Drive", status: "Success" },
    { date: "October 05, 2023", location: "Hospital Drive", status: "Fail", comment: "Low blood pressure" },
    { date: "October 05, 2023", location: "Hospital Drive", status: "Success" },
    { date: "October 05, 2023", location: "Hospital Drive", status: "Fail", comment: "Cold/flu symptoms" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "Success" | "Fail">("");
  const [failComment, setFailComment] = useState<string | null>(null);

  const filteredHistory = fullHistory.filter((item) => {
    const matchesQuery =
      item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="w-1/2 bg-white p-5 rounded-xl shadow-xl">
      {/* Header */}
      <div className="flex justify-between w-full items-center mb-4">
        <h3 className="text-lg font-semibold">Donation History</h3>
        <button
          onClick={() => setIsOpen(true)}
          className="text-red-500 underline underline-offset-2 decoration-red-500 hover:text-white hover:decoration-white text-sm font-medium"
        >
          View all
        </button>
      </div>

      {/* Preview list */}
      <div className="relative h-[230px] overflow-hidden">
        <div className="space-y-4">
          {history.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-800 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-white">{item.date}</p>
                <p className="text-sm text-gray-400">{item.location}</p>
              </div>
              <span
                className={`font-semibold ${
                  item.status === "Success" ? "text-green-500" : "text-red-500 cursor-pointer"
                }`}
                onClick={() => {
                  if (item.status === "Fail") setFailComment(item.comment || "No comment");
                }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[500px] max-h-[80vh] overflow-hidden shadow-lg flex flex-col relative">
            <div className="flex justify-between items-center p-6 border-b border-gray-700 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold">All Donation History</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:text-gray-500 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Search + Filter inside modal */}
            <div className="flex items-center space-x-2 p-4 border-b border-gray-200 sticky top-[72px] bg-white z-10">
              <input
                type="text"
                placeholder="Search by date or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-xl p-1 px-2 text-sm w-full"
              />
              <button
                onClick={() => setStatusFilter("Success")}
                className={`text-sm font-medium px-2 py-1 rounded-xl ${
                  statusFilter === "Success"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                Success
              </button>
              <button
                onClick={() => setStatusFilter("Fail")}
                className={`text-sm font-medium px-2 py-1 rounded-xl ${
                  statusFilter === "Fail"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                Fail
              </button>
              <button
                onClick={() => setStatusFilter("")}
                className="text-sm font-medium px-2 py-1 rounded-xl bg-gray-200"
              >
                All
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              {filteredHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-white">{item.date}</p>
                    <p className="text-sm text-gray-400">{item.location}</p>
                  </div>
                  <span
                    className={`font-semibold ${
                      item.status === "Success"
                        ? "text-green-500"
                        : "text-red-500 cursor-pointer"
                    }`}
                    onClick={() => {
                      if (item.status === "Fail") setFailComment(item.comment || "No comment");
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Fail comment popup */}
            {failComment && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl w-80 shadow-lg text-center relative">
                  <h3 className="text-lg font-semibold mb-2">Failure Reason</h3>
                  <p className="text-gray-700">{failComment}</p>
                  <button
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl"
                    onClick={() => setFailComment(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
