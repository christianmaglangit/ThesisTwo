"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BloodbankSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/bloodbank/bloodbank_dashboard" },
    { name: "Manage Inventory", href: "/bloodbank/bloodbank_inventory" },
    { name: "Manage Appointments", href: "/bloodbank/bloodbank_appointments" },
    { name: "Appointments History", href: "/bloodbank/bloodbank_appointhistory" },
    { name: "Manage User Account", href: "/bloodbank/bloodbank_manageuser" },
    { name: "Predictive Reports", href: "/bloodbank/bloodbank_predictivereports" },
    { name: "Blood Requests", href: "/bloodbank/bloodbank_requests" },
    { name: "Generate QR Code", href: "/bloodbank/bloodbank_qrcode" },
    { name: "Bloodletting Campaign", href: "/bloodbank/bloodbank_campaigns" },
  ];

  const handleLogout = () => {
    // Optional: clear user session/localStorage here
    // localStorage.removeItem("userToken");
    // Redirect to homepage
    window.location.href = "/";
  };

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-gray-900 text-white shadow-lg p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-red-500 mb-8">Blood Bank</h2>
        <nav className="flex flex-col space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg transition ${
                pathname === link.href
                  ? "bg-red-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-gray-700 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition"
      >
        Logout
      </button>
    </aside>
  );
}
