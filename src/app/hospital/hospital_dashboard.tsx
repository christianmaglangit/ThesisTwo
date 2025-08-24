"use client";

import { useEffect, useState } from "react";

type Receipt = {
  id: number;
  bloodType: string;
  quantity: number;
  status: "Pending" | "Confirmed - Correct" | "Issue Reported";
  rating?: number;      // 1..5 if reported or optionally after confirm
  notes?: string;       // message to blood bank (for issue)
  method?: "Delivery" | "Pickup";
};

export default function DashHospital() {
  const [receipts, setReceipts] = useState<Receipt[]>([
    { id: 1, bloodType: "A+", quantity: 5, status: "Pending", method: "Delivery" },
    { id: 2, bloodType: "O-", quantity: 3, status: "Confirmed - Correct", rating: 5, method: "Pickup" },
  ]);

  // ---- Issue modal state ----
  const [reportOpenFor, setReportOpenFor] = useState<number | null>(null);
  const [reportMessage, setReportMessage] = useState("");
  const [reportRating, setReportRating] = useState<number>(3);

  // ---- Load/Save to localStorage for persistence ----
  useEffect(() => {
    const saved = localStorage.getItem("hospitalReceipts");
    if (saved) setReceipts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("hospitalReceipts", JSON.stringify(receipts));
  }, [receipts]);

  // ---- CRUD helpers ----
  const addReceipt = () => {
    const newReceipt: Receipt = {
      id: receipts.length ? Math.max(...receipts.map(r => r.id)) + 1 : 1,
      bloodType: "B+",
      quantity: 2,
      status: "Pending",
      method: "Delivery",
    };
    setReceipts(prev => [newReceipt, ...prev]);
  };

  const confirmCorrect = (id: number) => {
    setReceipts(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: "Confirmed - Correct", rating: 5 } : r
      )
    );
  };

  const openIssueModal = (id: number) => {
    setReportOpenFor(id);
    setReportMessage("");
    setReportRating(3);
  };

  const submitIssue = () => {
    if (reportOpenFor == null) return;
    setReceipts(prev =>
      prev.map(r =>
        r.id === reportOpenFor
          ? { ...r, status: "Issue Reported", notes: reportMessage.trim(), rating: reportRating }
          : r
      )
    );
    setReportOpenFor(null);
  };

  const deleteReceipt = (id: number) => {
    setReceipts(prev => prev.filter(r => r.id !== id));
  };

  // ---- Small UI helpers ----
  const badge = (status: Receipt["status"]) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    if (status === "Pending") return `${base} bg-yellow-500/20 text-yellow-300`;
    if (status === "Confirmed - Correct") return `${base} bg-green-500/20 text-green-300`;
    return `${base} bg-red-500/20 text-red-300`;
  };

  const Star = ({ filled, onClick }: { filled: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`text-2xl ${filled ? "text-yellow-400" : "text-gray-500"} hover:scale-110 transition`}
      aria-label={filled ? "Filled star" : "Empty star"}
    >
      {filled ? "★" : "☆"}
    </button>
  );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-2">🏥 Hospital Dashboard</h1>
        <p className="text-gray-300">Confirm deliveries/pickups, report issues to the blood bank, and track receipts.</p>
      </div>

      {/* QR Scanner Card */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-red-500 mb-2">📷 QR Code Scanner</h2>
        <p className="text-gray-300 text-sm">[QR Scanner Component will go here]</p>
      </div>

      {/* Manage Blood Receipts */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold text-red-500">📦 Manage Blood Receipts</h2>
          <button
            onClick={addReceipt}
            className="self-start md:self-auto px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-medium transition"
          >
            ➕ Add Receipt (Demo)
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Blood Type</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Method</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Rating</th>
                <th className="px-4 py-2">Notes</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((r) => (
                <tr key={r.id} className="border-t border-gray-700 hover:bg-gray-700/40">
                  <td className="px-4 py-2">{r.id}</td>
                  <td className="px-4 py-2">{r.bloodType}</td>
                  <td className="px-4 py-2">{r.quantity}</td>
                  <td className="px-4 py-2">{r.method || "-"}</td>
                  <td className="px-4 py-2">
                    <span className={badge(r.status)}>{r.status}</span>
                  </td>
                  <td className="px-4 py-2">
                    {r.rating ? (
                      <span className="text-yellow-400">{Array.from({ length: r.rating }).map((_, i) => "★").join("")}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 max-w-[260px] truncate" title={r.notes || ""}>
                    {r.notes ? <span className="text-gray-300">{r.notes}</span> : <span className="text-gray-500">—</span>}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-2">
                      {r.status === "Pending" && (
                        <>
                          <button
                            onClick={() => confirmCorrect(r.id)}
                            className="px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
                          >
                            Confirm Correct
                          </button>
                          <button
                            onClick={() => openIssueModal(r.id)}
                            className="px-2 py-1 rounded bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            Report Issue
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteReceipt(r.id)}
                        className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {receipts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                    No receipts yet. Click “Add Receipt (Demo)” to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- Issue Report Modal ---- */}
      {reportOpenFor !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setReportOpenFor(null)}
        >
          <div
            className="w-full max-w-lg bg-gray-900 text-white rounded-2xl shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-red-500">Report Issue to Blood Bank</h3>
              <button
                className="text-gray-400 hover:text-white text-2xl leading-none"
                onClick={() => setReportOpenFor(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-300 mb-4">
              Describe what was wrong with the delivery/pickup (e.g., wrong blood type, missing units, damaged bag).
            </p>

            <textarea
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
              placeholder="Type your message to the blood bank…"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 p-3 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 mb-4"
              rows={4}
            />

            <div className="mb-6">
              <span className="block text-sm text-gray-300 mb-2">Rate this transaction:</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} filled={n <= reportRating} onClick={() => setReportRating(n)} />
                ))}
                <span className="ml-2 text-gray-400 text-sm">{reportRating}/5</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setReportOpenFor(null)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={submitIssue}
                className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 font-medium"
              >
                Send Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
