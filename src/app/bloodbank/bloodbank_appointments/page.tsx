"use client";

import { useState, useEffect } from "react";
import BloodbankSidebar from "../components/bloodbank_sidebar";
import BloodbankHeader from "../components/bloodbankheader";
import { Calendar, dateFnsLocalizer, Event, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Localizer
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Event type
interface AppointmentEvent extends Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  donor: string;
  type: string;
  status: string;
}

// Generate mock data
const generateMockAppointments = (): AppointmentEvent[] => {
  const donors = [
    "Juan Dela Cruz","Maria Santos","Pedro Reyes","Ana Lim","Carlos Dizon",
    "Liza Moreno","Josefina Cruz","Mark Tan","Rafael Reyes","Clara Ong",
    "Victor dela Rosa","Angela Lim","Luis Santos","Monica Dizon","Edgar Cruz",
    "Ella Reyes","Brian Tan","Sophia Lim","Daniel Santos","Patricia Ong",
    "Kevin Dela Cruz","Laura Reyes","Henry Tan","Mia Lim","Tom Santos"
  ];
  const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  const statuses = ["Pending", "Approved"];

  return donors.map((donor, index) => {
    const day = 26 + Math.floor(index / 5);
    const hour = 9 + (index % 5);
    const start = new Date(2025, 7, day, hour, 0);
    const end = new Date(2025, 7, day, hour + 1, 0);

    return {
      id: index + 1,
      title: `${donor} (${bloodTypes[index % bloodTypes.length]})`,
      start,
      end,
      donor,
      type: bloodTypes[index % bloodTypes.length],
      status: statuses[index % statuses.length],
    };
  });
};

export default function BloodBankAppointments() {
  const [events, setEvents] = useState<AppointmentEvent[]>(generateMockAppointments());
  const [view, setView] = useState<View>("day");
  const [date, setDate] = useState<Date>(new Date());

  const [selectedEvent, setSelectedEvent] = useState<AppointmentEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [failMode, setFailMode] = useState(false);
  const [comment, setComment] = useState("");

  // 🔔 Notifications
  const [notifications] = useState([
    { id: 1, message: "New appointment added" },
    { id: 2, message: "Blood request approved" },
    { id: 3, message: "Reminder: Appointment tomorrow" },
  ]);
  const [notifOpen, setNotifOpen] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("appointments_calendar");
    if (saved) {
      const parsed: AppointmentEvent[] = JSON.parse(saved).map((ev: any) => ({
        ...ev,
        start: new Date(ev.start),
        end: new Date(ev.end),
      }));
      setEvents(parsed);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("appointments_calendar", JSON.stringify(events));
  }, [events]);

  // Handle click on event
  const handleEventClick = (event: AppointmentEvent) => {
    setSelectedEvent(event);
    setFailMode(false);
    setComment("");
    setShowModal(true);
  };

  // Remove event (Success or after Fail submit)
  const removeEvent = (id: number) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    setShowModal(false);
  };

  // Mark success
  const markSuccess = () => {
    if (selectedEvent) {
      removeEvent(selectedEvent.id);
    }
  };

  // Mark fail (show comment box first)
  const markFail = () => {
    setFailMode(true);
  };

  // Submit fail with comment
  const submitFail = () => {
    if (selectedEvent) {
      console.log("Fail reason:", comment); // can save to DB later
      removeEvent(selectedEvent.id);
    }
  };

  return (
    <div className="flex">
      <BloodbankSidebar />
      <div className="ml-64 w-full">
        <BloodbankHeader />
        {/* MAIN CONTENT */}
        <main className="pt-20 p-8 min-h-screen bg-gradient-to-br bg-gray-200 text-white">
          <h1 className="text-3xl font-bold text-red-600 mb-6">Manage Appointments</h1>

          {/* Calendar */}
          <div className="bg-white rounded-2xl shadow-lg p-4 text-black">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              date={date}
              view={view}
              onView={(v) => setView(v)}
              onNavigate={(d) => setDate(d)}
              style={{ height: 600 }}
              step={30}
              timeslots={2}
              onSelectEvent={(event) => handleEventClick(event as AppointmentEvent)}
            />
          </div>
        </main>
      </div>

      {/* MODAL */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">
              Appointment with {selectedEvent.donor}
            </h2>
            <p className="mb-2 text-gray-300">Blood Type: <span className="font-bold">{selectedEvent.type}</span></p>
            <p className="mb-2 text-gray-300">Status: <span className="font-bold">{selectedEvent.status}</span></p>

            {!failMode ? (
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold text-gray-300"
                >
                  Cancel 
                </button>
                <button
                  onClick={markSuccess}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold text-gray-300"
                >
                  ✅ Success
                </button>
                <button
                  onClick={markFail}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold text-gray-300"
                >
                  ❌ Fail
                </button>
              </div>
            ) : (
              <div className="mt-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter reason for failure..."
                  className="w-full p-2 rounded-lg text-black bg-gray-400"
                  rows={3}
                />
                <div className="flex justify-end gap-3 mt-3">
                  <button
                    onClick={() => setFailMode(false)}
                    className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold text-gray-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={submitFail}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold text-gray-300"
                  >
                    Submit Fail
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
