"use client";

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Event, View, SlotInfo } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useRouter } from "next/navigation";

// Localizer
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Appointment Event type
interface AppointmentEvent extends Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  donor: string;
  type: string;
  status: string;
}

// Sample pre-existing appointments
const sampleAppointments: AppointmentEvent[] = [
  {
    id: 1,
    title: "Juan Dela Cruz",
    start: new Date(2025, 8, 9, 10, 0),
    end: new Date(2025, 8, 9, 11, 0),
    donor: "Juan Dela Cruz",
    type: "O+",
    status: "Pending",
  },
  {
    id: 2,
    title: "Maria Santos",
    start: new Date(2025, 8, 10, 14, 0),
    end: new Date(2025, 8, 10, 15, 0),
    donor: "Maria Santos",
    type: "A+",
    status: "Pending",
  },
];

export default function DonorAppointmentsPage({ currentUser }: { currentUser: string }) {
  const router = useRouter();

  const [events, setEvents] = useState<AppointmentEvent[]>([]);
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const saved = localStorage.getItem("donor_appointments");
    if (saved) {
      const parsed: AppointmentEvent[] = JSON.parse(saved).map((ev: any) => ({
        ...ev,
        start: new Date(ev.start),
        end: new Date(ev.end),
      }));
      setEvents(parsed);
    } else {
      setEvents(sampleAppointments);
      localStorage.setItem("donor_appointments", JSON.stringify(sampleAppointments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("donor_appointments", JSON.stringify(events));
  }, [events]);

  // Check if slot is available
  const isSlotAvailable = (slotStart: Date, slotEnd: Date) => {
    return !events.some(
      (ev) => slotStart.getTime() < ev.end.getTime() && slotEnd.getTime() > ev.start.getTime()
    );
  };

  // Book slot instantly (no prompts)
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (!isSlotAvailable(slotInfo.start, slotInfo.end)) {
      alert("This slot is already booked.");
      return;
    }

    const newEvent: AppointmentEvent = {
      id: events.length + 1,
      title: currentUser,
      start: slotInfo.start,
      end: slotInfo.end,
      donor: currentUser,
      type: "O+", // You can default the blood type if you want
      status: "Pending",
    };

    setEvents([...events, newEvent]);
    alert(`Appointment booked on ${slotInfo.start.toLocaleString()}`);
  };

  const eventStyleGetter = (event: AppointmentEvent) => {
    let backgroundColor = event.status === "Pending" ? "#F59E0B" : "#10B981"; // orange vs green
    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "5px",
        border: "none",
      },
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      <button
        onClick={() => router.back()}
        className="mb-4 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg w-fit"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">
        Blood Appointment Calendar
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-4 text-black flex-1">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={date}
          view={view}
          onView={(v) => setView(v)}
          onNavigate={(d) => setDate(d)}
          style={{ height: "80vh" }}
          selectable
          step={30}
          timeslots={2}
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
}
