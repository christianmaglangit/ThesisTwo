"use client";
import Image from "next/image";

export default function Navbar({
  currentUser,
  isDropdownOpen,
  setIsDropdownOpen,
  onLogout,
  onOpenRequest, // open modal prop
}: any) {
  return (
    <nav className="w-full fixed top-0 left-0 bg-white text-red-600 backdrop-blur-md z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div>
          <div className="text-3xl font-bold">DUGO</div>
          <span className="text-sm hidden sm:inline">
            Donor Utility for Giving and Organizing
          </span>
        </div>

        {/* Actions */}
        <ul className="flex items-center gap-6">
          {/* Request Blood Button */}
          <li>
            <button
              onClick={onOpenRequest}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Request Blood
            </button>
          </li>

          {/* Notification */}
          <li>
            <button>
              <Image src="/images/bell.png" width={28} height={28} alt="Notification" />
            </button>
          </li>

          {/* Profile Dropdown */}
          <li className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <Image src="/images/user.png" width={30} height={30} alt="Profile" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-gray-800 rounded-lg shadow-xl overflow-hidden z-20">
                <div className="px-4 py-2 text-gray-200 font-semibold border-b border-gray-700">
                  {currentUser?.name || "Sample Name"}
                </div>
                <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700">
                  Settings
                </button>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
