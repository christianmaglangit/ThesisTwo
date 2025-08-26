"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // for redirect on logout

type Receipt = {
  id: number;
  bloodType: string;
  quantity: number;
  status: "Pending" | "Confirmed - Correct" | "Issue Reported";
  rating?: number;
  notes?: string;
  method?: "Delivery" | "Pickup";
};

type BloodSupply = {
  id: number;
  bloodType: string;
  units: number;
};

type Notification = {
  id: number;
  message: string;
  read: boolean;
};

export default function DashHospital() {
  const router = useRouter(); // <-- router for redirect
  const [receipts, setReceipts] = useState<Receipt[]>([
    { id: 1, bloodType: "A+", quantity: 5, status: "Pending", method: "Delivery" },
    { id: 2, bloodType: "O-", quantity: 3, status: "Confirmed - Correct", rating: 5, method: "Pickup" },
  ]);

  const [supplies, setSupplies] = useState<BloodSupply[]>([
    { id: 1, bloodType: "A+", units: 10 },
    { id: 2, bloodType: "O-", units: 7 },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "Low stock alert for O- blood type.", read: false },
  ]);

  const [editSupplyId, setEditSupplyId] = useState<number | null>(null);
  const [editSupplyType, setEditSupplyType] = useState<string>("");
  const [editSupplyUnits, setEditSupplyUnits] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const [reportOpenFor, setReportOpenFor] = useState<number | null>(null);
  const [reportMessage, setReportMessage] = useState("");
  const [reportRating, setReportRating] = useState<number>(3);

  // ---- Load/save localStorage ----
  useEffect(() => {
    const savedReceipts = localStorage.getItem("hospitalReceipts");
    if (savedReceipts) setReceipts(JSON.parse(savedReceipts));

    const savedSupplies = localStorage.getItem("hospitalSupplies");
    if (savedSupplies) setSupplies(JSON.parse(savedSupplies));

    const savedNotifications = localStorage.getItem("hospitalNotifications");
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  }, []);

  useEffect(() => { localStorage.setItem("hospitalReceipts", JSON.stringify(receipts)); }, [receipts]);
  useEffect(() => { localStorage.setItem("hospitalSupplies", JSON.stringify(supplies)); }, [supplies]);
  useEffect(() => { localStorage.setItem("hospitalNotifications", JSON.stringify(notifications)); }, [notifications]);

  // ---- Blood Supply CRUD ----
  const addSupply = () => {
    const bloodType = prompt("Enter blood type (e.g., A+, O-)")?.trim();
    const units = Number(prompt("Enter number of units") || 0);
    if (!bloodType || units <= 0) return;
    const newSupply: BloodSupply = {
      id: supplies.length ? Math.max(...supplies.map(s => s.id)) + 1 : 1,
      bloodType,
      units,
    };
    setSupplies(prev => [...prev, newSupply]);
    setNotifications(prev => [...prev, { id: Date.now(), message: `New supply added: ${bloodType} (${units} units)`, read: false }]);
  };

  const editSupply = (supply: BloodSupply) => {
    setEditSupplyId(supply.id);
    setEditSupplyType(supply.bloodType);
    setEditSupplyUnits(supply.units);
  };

  const saveEditSupply = () => {
    if (editSupplyId == null) return;
    setSupplies(prev => prev.map(s => s.id === editSupplyId ? { ...s, bloodType: editSupplyType, units: editSupplyUnits } : s));
    setEditSupplyId(null);
    setNotifications(prev => [...prev, { id: Date.now(), message: `Supply updated: ${editSupplyType} (${editSupplyUnits} units)`, read: false }]);
  };

  const deleteSupply = (id: number) => {
    const deleted = supplies.find(s => s.id === id);
    setSupplies(prev => prev.filter(s => s.id !== id));
    if (deleted) setNotifications(prev => [...prev, { id: Date.now(), message: `Supply deleted: ${deleted.bloodType}`, read: false }]);
  };

  // ---- Receipts CRUD ----
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

  const confirmCorrect = (id: number) => setReceipts(prev => prev.map(r => r.id === id ? { ...r, status: "Confirmed - Correct", rating: 5 } : r));

  const openIssueModal = (id: number) => { setReportOpenFor(id); setReportMessage(""); setReportRating(3); };

  const submitIssue = () => { 
    if (reportOpenFor == null) return; 
    setReceipts(prev => prev.map(r => r.id === reportOpenFor ? { ...r, status: "Issue Reported", notes: reportMessage.trim(), rating: reportRating } : r)); 
    setReportOpenFor(null); 
  };

  const deleteReceipt = (id: number) => setReceipts(prev => prev.filter(r => r.id !== id));

  // ---- UI Helpers ----
  const badge = (status: Receipt["status"]) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    if (status === "Pending") return `${base} bg-yellow-500/20 text-yellow-300`;
    if (status === "Confirmed - Correct") return `${base} bg-green-500/20 text-green-300`;
    return `${base} bg-red-500/20 text-red-300`;
  };

  const Star = ({ filled, onClick }: { filled: boolean; onClick: () => void }) => (
    <button type="button" onClick={onClick} className={`text-2xl ${filled ? "text-yellow-400" : "text-gray-500"} hover:scale-110 transition`} aria-label={filled ? "Filled star" : "Empty star"}>{filled ? "★" : "☆"}</button>
  );

  const handleLogout = () => {
    // Optional: clear hospital-related storage
    // localStorage.removeItem("hospitalReceipts");
    // localStorage.removeItem("hospitalSupplies");
    // localStorage.removeItem("hospitalNotifications");
    router.push("/"); // redirect to homepage
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* Header with Notification and Logout */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-2">Hospital Dashboard</h1>
          <p className="text-gray-300">Track blood supply, confirm deliveries/pickups, and report issues.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="text-2xl p-2 rounded-full hover:bg-gray-700">
              🔔
              {notifications.some(n => !n.read) && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
                {notifications.length === 0 && <div className="p-2 text-gray-400 text-sm">No notifications</div>}
                {notifications.map(n => (
                  <div key={n.id} className={`p-2 text-sm border-b border-gray-700 ${n.read ? "text-gray-400" : "text-white"}`}>
                    {n.message}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600">Logout</button>
        </div>
      </div>

      {/* Available Blood Storage */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-500">🩸 Available Blood Storage</h2>
          <button onClick={addSupply} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-medium transition">➕ Add Supply</button>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Blood Type</th>
                <th className="px-4 py-2">Units</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {supplies.map(s => (
                <tr key={s.id} className="border-t border-gray-700 hover:bg-gray-700/40">
                  <td className="px-4 py-2">{s.id}</td>
                  <td className="px-4 py-2">
                    {editSupplyId === s.id ? (
                      <input value={editSupplyType} onChange={e => setEditSupplyType(e.target.value)} className="bg-gray-700 rounded px-2 py-1 text-white w-20"/>
                    ) : s.bloodType}
                  </td>
                  <td className="px-4 py-2">
                    {editSupplyId === s.id ? (
                      <input type="number" value={editSupplyUnits} onChange={e => setEditSupplyUnits(Number(e.target.value))} className="bg-gray-700 rounded px-2 py-1 text-white w-20"/>
                    ) : s.units}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    {editSupplyId === s.id ? (
                      <button onClick={saveEditSupply} className="px-2 py-1 bg-green-600 rounded hover:bg-green-700">Save</button>
                    ) : (
                      <button onClick={() => editSupply(s)} className="px-2 py-1 bg-yellow-600 rounded hover:bg-yellow-700">Edit</button>
                    )}
                    <button onClick={() => deleteSupply(s.id)} className="px-2 py-1 bg-red-600 rounded hover:bg-red-700">Delete</button>
                  </td>
                </tr>
              ))}
              {supplies.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">No blood in storage. Click "Add Supply" to add.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Scanner Card */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-red-500 mb-2">📷 QR Code Scanner</h2>
        <p className="text-gray-300 text-sm">[QR Scanner Component will go here]</p>
      </div>

      {/* Manage Blood Receipts */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
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
