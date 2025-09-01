"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type BloodSupply = {
  id: number;
  bloodType: string;
  units: number;
  lastUpdated: string;
};

type Notification = {
  id: number;
  message: string;
  read: boolean;
};

export default function DashHospital() {
  const router = useRouter();

  const [supplies, setSupplies] = useState<BloodSupply[]>([
    { id: 1, bloodType: "A+", units: 10, lastUpdated: "2025-08-25" },
    { id: 2, bloodType: "O-", units: 7, lastUpdated: "2025-08-24" },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "Low stock alert for O- blood type.", read: false },
  ]);

  const [editSupplyId, setEditSupplyId] = useState<number | null>(null);
  const [editSupplyType, setEditSupplyType] = useState<string>("");
  const [editSupplyUnits, setEditSupplyUnits] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBloodType, setNewBloodType] = useState("");
  const [newUnits, setNewUnits] = useState<number>(0);

  const getToday = () => new Date().toISOString().split("T")[0];

  // Load from localStorage
  useEffect(() => {
    const savedSupplies = localStorage.getItem("hospitalSupplies");
    if (savedSupplies) setSupplies(JSON.parse(savedSupplies));

    const savedNotifications = localStorage.getItem("hospitalNotifications");
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  }, []);

  useEffect(() => {
    localStorage.setItem("hospitalSupplies", JSON.stringify(supplies));
  }, [supplies]);

  useEffect(() => {
    localStorage.setItem("hospitalNotifications", JSON.stringify(notifications));
  }, [notifications]);

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
    setNotifications((prev) => [
      ...prev,
      {
        id: Date.now(),
        message: `New supply added: ${newBloodType} (${newUnits} units)`,
        read: false,
      },
    ]);

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
    setNotifications((prev) => [
      ...prev,
      {
        id: Date.now(),
        message: `Supply updated: ${editSupplyType} (${editSupplyUnits} units)`,
        read: false,
      },
    ]);
  };

  const deleteSupply = (id: number) => {
    const deleted = supplies.find((s) => s.id === id);
    setSupplies((prev) => prev.filter((s) => s.id !== id));
    if (deleted)
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: `Supply deleted: ${deleted.bloodType}`,
          read: false,
        },
      ]);
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
            Hospital Dashboard
          </h1>
          <p className="text-gray-300">
            Scan blood journey and Blood Stock Display.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-2xl p-2 rounded-full hover:bg-gray-700"
            >
              🔔
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
                {notifications.length === 0 && (
                  <div className="p-2 text-gray-400 text-sm">
                    No notifications
                  </div>
                )}
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2 text-sm border-b border-gray-700 ${
                      n.read ? "text-gray-400" : "text-white"
                    }`}
                  >
                    {n.message}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Available Blood Storage */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
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
                  <td className="px-4 py-2">{s.id}</td>
                  <td className="px-4 py-2">
                    {editSupplyId === s.id ? (
                      <input
                        value={editSupplyType}
                        onChange={(e) => setEditSupplyType(e.target.value)}
                        className="bg-gray-700 rounded px-2 py-1 text-white w-20"
                      />
                    ) : (
                      s.bloodType
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editSupplyId === s.id ? (
                      <input
                        type="number"
                        value={editSupplyUnits}
                        onChange={(e) =>
                          setEditSupplyUnits(Number(e.target.value))
                        }
                        className="bg-gray-700 rounded px-2 py-1 text-white w-20"
                      />
                    ) : (
                      s.units
                    )}
                  </td>
                  <td className="px-4 py-2">{s.lastUpdated}</td>
                  <td className="px-4 py-2 flex gap-2">
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
                        className="px-2 py-1 bg-yellow-600 rounded hover:bg-yellow-700"
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
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-red-500 mb-2">
          📷 QR Code Scanner
        </h2>
        <p className="text-gray-300 text-sm">
          [QR Scanner Component will go here]
        </p>
      </div>

      {/* Add Supply Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-red-500">
              ➕ Add New Blood Supply
            </h3>
            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium">Blood Type</label>
              <input
                type="text"
                value={newBloodType}
                onChange={(e) => setNewBloodType(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                placeholder="e.g. A+, O-"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium">Units</label>
              <input
                type="number"
                value={newUnits}
                onChange={(e) => setNewUnits(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
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
  );
}
