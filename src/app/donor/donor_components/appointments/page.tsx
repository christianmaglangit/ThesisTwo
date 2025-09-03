"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  Event,
  View,
  SlotInfo,
} from "react-big-calendar";
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

// Always show sample donors on first load
const sampleAppointments: AppointmentEvent[] = [
  {
    id: 1,
    title: "Juan Dela Cruz",
    start: new Date("2025-09-09T10:00:00"),
    end: new Date("2025-09-09T11:00:00"),
    donor: "Juan Dela Cruz",
    type: "O+",
    status: "Pending",
  },
  {
    id: 2,
    title: "Maria Santos",
    start: new Date("2025-09-09T14:00:00"),
    end: new Date("2025-09-09T15:00:00"),
    donor: "Maria Santos",
    type: "A+",
    status: "Confirmed",
  },
  {
    id: 3,
    title: "Pedro Reyes",
    start: new Date("2025-09-10T09:30:00"),
    end: new Date("2025-09-10T10:30:00"),
    donor: "Pedro Reyes",
    type: "B+",
    status: "Pending",
  },
];

export default function DonorAppointmentsPage({
  currentUser,
}: {
  currentUser: string;
}) {
  const router = useRouter();

  const [events, setEvents] = useState<AppointmentEvent[]>(sampleAppointments);
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState<Date>(new Date("2025-09-09"));

  useEffect(() => {
    const saved = localStorage.getItem("donor_appointments");
    if (saved) {
      try {
        const parsed: AppointmentEvent[] = JSON.parse(saved).map((ev: any) => ({
          ...ev,
          start: new Date(ev.start),
          end: new Date(ev.end),
        }));
        if (parsed.length > 0) setEvents(parsed);
      } catch {
        setEvents(sampleAppointments);
      }
    }
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("donor_appointments", JSON.stringify(events));
    }
  }, [events]);

  // Check if slot is available
  const isSlotAvailable = (slotStart: Date, slotEnd: Date) => {
    return !events.some(
      (ev) =>
        slotStart.getTime() < ev.end.getTime() &&
        slotEnd.getTime() > ev.start.getTime()
    );
  };

  // Book or reschedule slot
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const myAppointment = events.find((ev) => ev.donor === currentUser);

    if (myAppointment) {
      if (
        myAppointment.start.getTime() === slotInfo.start.getTime() &&
        myAppointment.end.getTime() === slotInfo.end.getTime()
      ) {
        alert("You already have an appointment in this slot.");
        return;
      }

      const confirmReschedule = confirm(
        `You already have an appointment on ${myAppointment.start.toLocaleString()}.\nDo you want to reschedule to ${slotInfo.start.toLocaleString()}?`
      );
      if (confirmReschedule) {
        const updatedEvents = events.filter(
          (ev) => ev.donor !== currentUser
        );
        const newEvent: AppointmentEvent = {
          id: events.length + 1,
          title: currentUser,
          start: slotInfo.start,
          end: slotInfo.end,
          donor: currentUser,
          type: "O+",
          status: "Pending",
        };
        setEvents([...updatedEvents, newEvent]);
        alert(`Your appointment has been rescheduled.`);
      }
    } else {
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
        type: "O+",
        status: "Pending",
      };

      setEvents([...events, newEvent]);
      alert(`Appointment booked on ${slotInfo.start.toLocaleString()}`);
    }
  };

  // Cancel appointment if user clicks their own event
  const handleSelectEvent = (event: AppointmentEvent) => {
    if (event.donor === currentUser) {
      const confirmRemove = confirm(
        `Do you want to cancel your appointment on ${event.start.toLocaleString()}?`
      );
      if (confirmRemove) {
        setEvents(events.filter((ev) => ev.id !== event.id));
        alert("Your appointment has been cancelled.");
      }
    } else {
      alert(`This appointment belongs to ${event.donor}.`);
    }
  };

  // Tailwind-based event style
  const eventStyleGetter = (event: AppointmentEvent) => {
    const baseClasses =
      "rounded-md px-2 py-1 text-white text-sm font-medium shadow";
    let backgroundColor =
      event.status === "Pending" ? "bg-white" : "bg-red-500";
    return {
      className: `${baseClasses} ${backgroundColor}`,
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
          selectable
          step={30}
          timeslots={2}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          className="h-[80vh]"
        />
      </div>
    </div>
  );
}
