"use client";

// Simple Card Component
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl shadow-lg p-6 bg-gray-800 text-white ${className || ""}`}>
      {children}
    </div>
  );
}

// Simple Button Component
function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg mt-4"
    >
      {children}
    </button>
  );
}

export default function DashBBank() {
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <h1 className="text-3xl font-bold text-red-500 mb-8">Blood Bank Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Manage Blood Inventory */}
        <Card>
          <div className="text-4xl mb-4">🩸</div>
          <h2 className="text-xl font-semibold mb-2">Manage Blood Inventory</h2>
          <p className="text-gray-300 text-sm">
            Track and manage the current blood inventory.
          </p>
          <Button>Open</Button>
        </Card>

        {/* Manage Donor Appointments */}
        <Card>
          <div className="text-4xl mb-4">📅</div>
          <h2 className="text-xl font-semibold mb-2">Manage Donor Appointments</h2>
          <p className="text-gray-300 text-sm">
            View and schedule donor appointments.
          </p>
          <Button>Open</Button>
        </Card>

        {/* Predictive Reports Log */}
        <Card>
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-xl font-semibold mb-2">Predictive Reports Log</h2>
          <p className="text-gray-300 text-sm">
            Generate and review predictive reports on blood usage.
          </p>
          <Button>Open</Button>
        </Card>
      </div>
    </div>
  );
}
