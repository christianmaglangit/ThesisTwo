"use client";

import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Image from "next/image";

export default function Dashdonor() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const progressValue = 175;
  const daysLeft = 45;
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-10 relative">
      <div className="grid md:grid-cols-2 gap-8 items-center border-2 p-10 rounded-xl">
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
              <p className="text-sm text-gray-300 text-center">
                Next Donation <br /> in {daysLeft} days
              </p>
            </div>
          </div>

          <button className="mt-6 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition font-medium">
            Book Next Donation
          </button>
        </div>
      </div>

      {/* BLOOD JOURNEY TRACKER */}
      <div className="bg-gray-800 rounded-xl p-4 mt-12">
        <h3 className="text-lg font-semibold mb-2">Track My Blood Journey</h3>
        <p className="text-sm text-gray-400">{currentUser?.name || "Jane"}</p>
        <div className="flex justify-between text-sm text-gray-300">
          <span>Donated</span>
          <span>Processed</span>
          <span>Distributed</span>
          <span>Impacted</span>
        </div>
        <div className="relative mt-2 h-2 bg-gray-700 rounded-full">
          <div className="absolute left-1 top-[-6px] w-4 h-4 bg-red-600 rounded-full"></div>
          <div className="absolute left-1/3 top-[-6px] w-4 h-4 bg-red-600 rounded-full"></div>
          <div className="absolute right-1/3 top-[-6px] w-4 h-4 bg-red-600 rounded-full"></div>
          <div className="absolute right-1 top-[-6px] w-4 h-4 bg-red-600 rounded-full"></div>
        </div>
      </div>

      {/* UPCOMING CAMPAIGNS */}
      <div className="mt-12 flex justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-4">Upcoming Campaigns</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <div className="bg-gray-800 rounded-xl p-4 min-w-[200px]">
              <Image
                src="/images/campaign1.png"
                width={180}
                height={100}
                alt="Campaign"
                className="rounded-lg mb-2"
              />
              <p className="font-semibold">Waarey 20 Drive</p>
              <p className="text-sm text-gray-400">201 Location</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 min-w-[200px]">
              <Image
                src="/images/campaign2.png"
                width={180}
                height={100}
                alt="Campaign"
                className="rounded-lg mb-2"
              />
              <p className="font-semibold">Waarey 20 Drive</p>
              <p className="text-sm text-gray-400">202 Location</p>
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGE BUTTON (floating) */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full shadow-lg"
      >
        💬 Message
      </button>

      {/* CHATBOT (toggle) */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col h-96">
          <h3 className="bg-red-600 inline-block px-3 py-1 rounded-lg text-sm font-semibold mb-2">
            Chatbot Support
          </h3>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto space-y-2 text-sm">
            <div className="bg-gray-700 px-3 py-2 rounded-lg self-start w-fit">
              👋 Hello! How can I help you today?
            </div>
          </div>

          {/* Input */}
          <div className="flex mt-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 rounded-l-lg bg-gray-900 border border-gray-700 text-sm focus:outline-none"
            />
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-r-lg text-sm">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
