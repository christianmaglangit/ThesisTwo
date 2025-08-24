"use client";

import { useState, useEffect } from "react";
import BloodbankSidebar from "../components/bloodbank_sidebar";
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

// Generate 25 mock appointments
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

// Notification Header Component
function NotificationHeader() {
  const [notifications] = useState([
    { id: 1, message: "New appointment added" },
    { id: 2, message: "Blood request approved" },
  ]);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-gray-900 text-white flex items-center justify-end px-6 shadow z-50">
      <div className="relative">
        <button
          onClick={() => window.alert("Go to Notification Logs")}
          className="text-2xl hover:text-red-500"
        >
          🔔
        </button>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </div>
    </header>
  );
}

export default function BloodBankAppointments() {
  const [events, setEvents] = useState<AppointmentEvent[]>(generateMockAppointments());
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState<Date>(new Date());

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

  // Navigation
  const goToToday = () => setDate(new Date());
  const goToPrev = () => {
    const newDate = new Date(date);
    if (view === "month") newDate.setMonth(date.getMonth() - 1);
    else if (view === "week") newDate.setDate(date.getDate() - 7);
    else newDate.setDate(date.getDate() - 1);
    setDate(newDate);
  };
  const goToNext = () => {
    const newDate = new Date(date);
    if (view === "month") newDate.setMonth(date.getMonth() + 1);
    else if (view === "week") newDate.setDate(date.getDate() + 7);
    else newDate.setDate(date.getDate() + 1);
    setDate(newDate);
  };

  return (
    <div className="flex">
      <BloodbankSidebar />
      <div className="ml-64 w-full">
        <NotificationHeader />
        <main className="pt-20 p-8 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
          <h1 className="text-3xl font-bold text-red-500 mb-6">Manage Appointments</h1>

          {/* Navigation Buttons */}
          <div className="mb-4 flex gap-2 items-center">
            <button onClick={goToToday} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">Today</button>
            <button onClick={goToPrev} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg">Prev</button>
            <button onClick={goToNext} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg">Next</button>
            <span className="ml-4 font-semibold">
              {date.toDateString()}
            </span>
            <select
              value={view}
              onChange={(e) => setView(e.target.value as View)}
              className="bg-gray-600 text-white px-2 rounded-lg ml-auto"
            >
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
          </div>

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
            />
          </div>
        </main>
      </div>
    </div>
  );
}
