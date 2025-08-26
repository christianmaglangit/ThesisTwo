"use client";
import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Dashdonor() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const progressValue = 175;
  const daysLeft = 45;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

   useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  const handleLogout = () => {
    // Optional: clear hospital-related storage
    // localStorage.removeItem("hospitalReceipts");
    // localStorage.removeItem("hospitalSupplies");
    // localStorage.removeItem("hospitalNotifications");
    router.push("/"); // redirect to homepage
  };

  return (
    <div className="min-h-screen  bg-gray-200 text-black p-10 relative">
      {/* NAVBAR */}
      <nav className="w-full fixed top-0 left-0  bg-white text-red-600 backdrop-blur-md z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div>
              <div>
                <span className="text-3xl font-bold">DUGO</span>
              </div>
              <div>
                <span className="text-sm hidden sm:inline">Donor Utility for Giving and Organizing</span>
              </div>
            </div>
          </div>

          {/* Links + Actions */}
          <ul className="flex items-center gap-6">
            <li>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
              Request Blood
            </button>
            </li>
            <li>
              <button>
                <img src="/images/bell.png" width={28} height={28} alt="Notification" />
              </button>
            </li>
            <li className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <img src="/images/user.png" width={30} height={30} alt="Profile" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-gray-800 rounded-lg shadow-xl overflow-hidden z-20">
                  <div className="px-4 py-2 text-gray-200 font-semibold border-b border-gray-700">
                    {currentUser?.name || "Sample Name"}
                  </div>
                  <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700">
                    Settings
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700">
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
      <div className="grid md:grid-cols-2 gap-8 items-center bg-white bg-opacity-75 shadow-xl p-10 rounded-xl mt-20 text-balck">
        <div>
          <h1 className="text-5xl font-bold mb-2">
            Hello, {currentUser?.name || "Donor"}.
          </h1>
          <h2 className="text-5xl font-bold text-red-500 mb-4">
            You're a hero!
          </h2>
          <p className="text-lg mb-8">You've saved 4 lives</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40">
            <CircularProgressbar
              value={progressValue}
              maxValue={200}
              strokeWidth={12}
              styles={buildStyles({
                pathColor: "#ef4444",
                trailColor: "#2d2d2d",
                strokeLinecap: "round",
              })}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">{progressValue}</p>
              <p className="text-sm text-black text-center ">
                Next Donation <br /> in {daysLeft} days
              </p>
            </div>
          </div>

          <button className="mt-6 px-6 py-3 rounded-xl text-white bg-red-600 hover:bg-red-700 transition font-medium">
            Book Next Donation
          </button>
        </div>
      </div>

      {/* BLOOD JOURNEY TRACKER */}
      <div className="bg-white bg-opacity-75 shadow-xl rounded-xl p-4 mt-12">
        <h3 className="text-lg font-semibold mb-2">Track My Blood Journey</h3>

        <div className="flex justify-between text-sm">
          <span>Donated</span>
          <span>Processed</span>
          <span>Distributed</span>
          <span>Impacted</span>
        </div>
        <div className="relative mt-2 h-2 bg-gray-400 rounded-full">
          <div className="absolute left-1 top-[-6px] w-4 h-4 bg-red-600 rounded-full"></div>
          <div className="absolute left-1/3 top-[-6px] w-4 h-4 bg-red-600 rounded-full"></div>
          <div className="absolute right-1/3 top-[-6px] w-4 h-4 bg-red-600 rounded-full"></div>
          <div className="absolute right-1 top-[-6px] w-4 h-4 bg-red-600 rounded-full"></div>
        </div>
      </div>

      <div className="mt-12 flex justify-between gap-8 w-full">
        {/* Donation History */}
        <div className="w-1/2 bg-white p-5 rounded-xl shadow-xl">
          {/* Header with View all button */}
          <div className="flex justify-between w-full items-center mb-4">
            <h3 className="text-lg font-semibold">Donation History</h3>
            <button
              onClick={() => setIsOpen(true)}
              className="text-red-500 underline underline-offset-2 decoration-red-500 hover:text-white hover:decoration-white text-sm font-medium"
            >
              View all
            </button>
          </div>

          {/* Container with blur bottom */}
          <div className="relative h-[230px] overflow-hidden">
            <div className="space-y-4">
              {[
                { date: "October 26, 2023", location: "City Blood Bank - Downtown" },
                { date: "October 26, 2023", location: "Red Cross Drive - Downtown" },
                { date: "October 20, 2023", location: "Community Center Drive" },
                { date: "October 15, 2023", location: "University Blood Bank" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-white">{item.date}</p>
                    <p className="text-sm text-gray-400">{item.location}</p>
                  </div>
                  <span className="text-red-500 font-semibold">Completed</span>
                </div>
              ))}
            </div>
          </div>

          {/* Modal */}
          {isOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl w-[500px] max-h-[80vh] overflow-hidden shadow-lg flex flex-col">
                
                {/* Sticky Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700 sticky top-0 bg-white z-10">
                  <h2 className="text-xl font-semibold">All Donation History</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="hover:text-gray-500 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Scrollable List */}
                <div className="p-6 space-y-4 overflow-y-auto">
                  {[
                    { date: "October 26, 2023", location: "City Blood Bank - Downtown" },
                    { date: "October 26, 2023", location: "Red Cross Drive - Downtown" },
                    { date: "October 20, 2023", location: "Community Center Drive" },
                    { date: "October 15, 2023", location: "University Blood Bank" },
                    { date: "October 10, 2023", location: "Barangay Health Center" },
                    { date: "October 05, 2023", location: "Hospital Drive" },
                    { date: "October 05, 2023", location: "Hospital Drive" },
                    { date: "October 05, 2023", location: "Hospital Drive" },
                    { date: "October 05, 2023", location: "Hospital Drive" },
                    { date: "October 05, 2023", location: "Hospital Drive" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800 rounded-xl p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-white">{item.date}</p>
                        <p className="text-sm text-gray-400">{item.location}</p>
                      </div>
                      <span className="text-red-500 font-semibold">Completed</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Upcoming Campaigns */}
        <div className="w-1/2  bg-white p-5 rounded-xl shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Upcoming Campaigns</h3>
          
          {/* Match height here */}
          <div className="relative h-[230px] overflow-hidden">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide h-full">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((campaign, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 text-white rounded-xl p-4 flex-shrink-0 w-[250px] sm:w-[220px] md:w-[200px] lg:w-[180px]"
                >
                  <Image
                    src={`/images/campaign${campaign}.png`}
                    width={180}
                    height={100}
                    alt="Campaign"
                    className="rounded-lg mb-2"
                  />
                  <p className="font-semibold">Waarey 20 Drive</p>
                  <p className="text-sm text-gray-400">{200 + idx} Location</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGE BUTTON (floating) */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full shadow-lg"
      >
        💬 Ask Haîma
      </button>

      {/* CHATBOT (toggle) */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col h-96">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
              Chat with Haîma
            </h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-gray-300 hover:text-white text-lg"
            >
              ✕
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto space-y-2 text-sm">
            <div className="bg-white px-3 py-2 rounded-lg self-start w-fit">
              👋 Hello! I'm Hima. How can I help you today?
            </div>
          </div>

          {/* Input */}
          <div className="flex mt-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 rounded-l-lg bg-white border border-gray-700 text-sm focus:outline-none"
            />
            <button className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-r-lg text-sm">
              Send
            </button>
          </div>
        </div>
      )}
      {isRequestModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center  bg-black/40 backdrop-blur-sm z-50">
          <div className="relative bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <button
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">Request Blood</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Blood Type
                </label>
                <select className="w-full border rounded-lg px-3 py-2 text-black">
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity (bags)
                </label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-3 py-2 text-black"
                  min="1"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}