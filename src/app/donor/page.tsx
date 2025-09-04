"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./donor_components/navbar";
import HeroSection from "./donor_components/herosection";
import BloodJourney from "./donor_components/bloodjourney";
import DonationHistory from "./donor_components/donationhistory";
import UpcomingCampaigns from "./donor_components/upcomingcampaigns";
import BloodAvailable from "./donor_components/bloodavailable"; // <-- import the new component
import Chatbot from "./donor_components/chatbot";
import RequestModal from "./donor_components/requestblood"; // modal component

export default function DashdonorPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Default appointment sample
  const [selectedAppointment, setSelectedAppointment] = useState<{
    date: string;
    time: string;
  } | null>({
    date: "September 9, 2025",
    time: "10:00 AM",
  });

  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-200 text-black p-10 relative">
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        onLogout={handleLogout}
        onOpenRequest={() => setIsRequestModalOpen(true)}
      />

      {/* Hero / Appointments */}
      <HeroSection
        currentUser={currentUser}
        onAppointmentSelect={setSelectedAppointment}
        selectedAppointment={selectedAppointment}
      />

      {/* Blood Journey */}
      <BloodJourney />

      {/* Donation History & Upcoming Campaigns */}
      <div className="mt-12 flex justify-between gap-8 w-full">
        <DonationHistory isOpen={isHistoryOpen} setIsOpen={setIsHistoryOpen} />
        <UpcomingCampaigns />
      </div>

      <div className="mt-8"></div>

      {/* Blood Available Section */}
      <BloodAvailable />

      {/* Chat Toggle */}
      <button
        onClick={() => setIsChatOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full shadow-lg"
      >
        💬 Ask Haîma
      </button>

      {/* Chatbot */}
      {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}

      {/* Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
            <button
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              ✕
            </button>
            <RequestModal />
          </div>
        </div>
      )}
    </div>
  );
}
