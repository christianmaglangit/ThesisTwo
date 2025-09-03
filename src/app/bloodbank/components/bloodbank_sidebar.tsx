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
    { name: "Predictive Reports", href: "/bloodbank/bloodbank_predictivereports" },
    { name: "Blood Requests", href: "/bloodbank/bloodbank_requests" },
    { name: "Generate QR Code", href: "/bloodbank/bloodbank_qrcode" },
    { name: "Bloodletting Campaign", href: "/bloodbank/bloodbank_campaigns" },
    { name: "Hospital Blood Inventory", href: "/bloodbank/bloodbank_hospitalinventory" },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white shadow-lg p-6 flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-red-500 mb-8">Blood Bank</h2>
        <nav className="flex flex-col space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg transition ${
                pathname === link.href
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "text-black hover:bg-red-700 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
