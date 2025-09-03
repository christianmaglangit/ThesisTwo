"use client";

export default function Chatbot({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed bottom-20 right-6 w-80 bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col h-96 z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
          Chat with Haîma
        </h3>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white text-lg"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 text-sm">
        <div className="bg-white px-3 py-2 rounded-lg self-start w-fit">
          👋 Hello! I'm Hima. How can I help you today?
        </div>
      </div>

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
  );
}

// Example usage in a parent component
export function DonorPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div>
      {/* ...other content... */}
      <Chatbot isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
    </div>
  );
}
