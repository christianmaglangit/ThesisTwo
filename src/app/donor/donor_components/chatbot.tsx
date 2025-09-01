"use client";

import { useState } from "react";

export default function Chatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4">
      {/* Toggle button */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-full shadow"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        {isChatOpen ? "Close Chat" : "Open Chat"}
      </button>

      {/* Chat window */}
      {isChatOpen && (
        <div className="mt-2 w-72 h-96 bg-white shadow-lg rounded-lg p-4">
          <h2 className="font-bold mb-2">Chatbot</h2>
          <div className="text-gray-700">How can I help you today?</div>
        </div>
      )}
    </div>
  );
}
