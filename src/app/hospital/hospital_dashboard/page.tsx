"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HospitalHeader from "../components/hospitalheader";

type BloodSupply = {
  id: number;
  bloodType: string;
  units: number;
  lastUpdated: string;
};

export default function DashHospital() {
  const router = useRouter();

  const [supplies, setSupplies] = useState<BloodSupply[]>([
    { id: 1, bloodType: "A+", units: 10, lastUpdated: "2025-08-25" },
    { id: 2, bloodType: "O-", units: 7, lastUpdated: "2025-08-24" },
  ]);

  const [editSupplyId, setEditSupplyId] = useState<number | null>(null);
  const [editSupplyType, setEditSupplyType] = useState<string>("");
  const [editSupplyUnits, setEditSupplyUnits] = useState<number>(0);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBloodType, setNewBloodType] = useState("");
  const [newUnits, setNewUnits] = useState<number>(0);

  const getToday = () => new Date().toISOString().split("T")[0];

  // Load from localStorage
  useEffect(() => {
    const savedSupplies = localStorage.getItem("hospitalSupplies");
    if (savedSupplies) setSupplies(JSON.parse(savedSupplies));
  }, []);

  useEffect(() => {
    localStorage.setItem("hospitalSupplies", JSON.stringify(supplies));
  }, [supplies]);

  // ---- Add Supply (with modal form) ----
  const saveNewSupply = () => {
    if (!newBloodType || newUnits <= 0) return;

    const newSupply: BloodSupply = {
      id: supplies.length ? Math.max(...supplies.map((s) => s.id)) + 1 : 1,
      bloodType: newBloodType,
      units: newUnits,
      lastUpdated: getToday(),
    };

    setSupplies((prev) => [...prev, newSupply]);

    setShowAddModal(false);
    setNewBloodType("");
    setNewUnits(0);
  };

  // ---- Edit Supply ----
  const editSupply = (supply: BloodSupply) => {
    setEditSupplyId(supply.id);
    setEditSupplyType(supply.bloodType);
    setEditSupplyUnits(supply.units);
  };

  const saveEditSupply = () => {
    if (editSupplyId == null) return;
    setSupplies((prev) =>
      prev.map((s) =>
        s.id === editSupplyId
          ? {
              ...s,
              bloodType: editSupplyType,
              units: editSupplyUnits,
              lastUpdated: getToday(),
            }
          : s
      )
    );
    setEditSupplyId(null);
  };

  const deleteSupply = (id: number) => {
    setSupplies((prev) => prev.filter((s) => s.id !== id));
  };

  // Add notification state and logout handler
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New blood request received" },
    { id: 2, message: "Stock updated" },
  ]);
  const handleLogout = () => {
    router.push("/"); // Redirects to homepage (page.tsx)
  };

  return (
    <>
      <HospitalHeader
        open={open}
        setOpen={setOpen}
        notifications={notifications}
        handleLogout={handleLogout}
      />
      <div className="min-h-screen p-8 pt-20 bg-gray-200 text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
              Dashboard
            </h1>
            <p className="text-black">
              Scan blood journey and Blood Stock Display.
            </p>
          </div>
          {/* Right section left empty to preserve layout spacing */}
          <div className="flex items-center gap-4"></div>
        </div>

        {/* Available Blood Storage */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-red-500">
              🩸 Available Blood Storage
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-medium transition"
            >
              ➕ Add Supply
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Blood Type</th>
                  <th className="px-4 py-2">Units</th>
                  <th className="px-4 py-2">Last Updated</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {supplies.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t border-gray-700 hover:bg-gray-700/40"
                  >
                    <td className="px-4 py-2 text-black">{s.id}</td>
                    <td className="px-4 py-2 text-black">
                      {editSupplyId === s.id ? (
                        <input
                          value={editSupplyType}
                          onChange={(e) => setEditSupplyType(e.target.value)}
                          className="bg-gray-700 rounded px-2 py-1 w-20"
                        />
                      ) : (
                        s.bloodType
                      )}
                    </td>
                    <td className="px-4 py-2 text-black">
                      {editSupplyId === s.id ? (
                        <input
                          type="number"
                          value={editSupplyUnits}
                          onChange={(e) =>
                            setEditSupplyUnits(Number(e.target.value))
                          }
                          className="bg-gray-700 rounded px-2 py-1 w-20"
                        />
                      ) : (
                        s.units
                      )}
                    </td>
                    <td className="px-4 py-2 text-black">{s.lastUpdated}</td>
                    <td className="px-4 py-2 flex gap-2 ">
                      {editSupplyId === s.id ? (
                        <button
                          onClick={saveEditSupply}
                          className="px-2 py-1 bg-green-600 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => editSupply(s)}
                          className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => deleteSupply(s.id)}
                        className="px-2 py-1 bg-red-600 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {supplies.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      No blood in storage. Click "Add Supply" to add.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* QR Scanner Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-red-500 mb-2">
            📷 QR Code Scanner
          </h2>
          <p className="text-black text-sm">
            [QR Scanner Component will go here]
          </p>
        </div>

        {/* Add Supply Modal */}
        {showAddModal && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4 text-red-600">
                Add New Blood Supply
              </h3>
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">
                  Blood Type
                </label>
                <select
                  value={newBloodType}
                  onChange={(e) => setNewBloodType(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-gray-300 text-black"
                >
                  <option value="">-- Select Blood Type --</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">Units</label>
                <input
                  type="number"
                  value={newUnits}
                  onChange={(e) => setNewUnits(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-gray-300 text-black"
                  placeholder="e.g. 5"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={saveNewSupply}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
