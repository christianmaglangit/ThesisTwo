"use client";
import { useRouter } from "next/navigation";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function HeroSection({
  currentUser,
  selectedAppointment,
}: {
  currentUser?: any;
  selectedAppointment?: { date: string; time: string } | null;
}) {
  const router = useRouter();
  const progressValue = 175;
  const daysLeft = 45;

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center bg-white bg-opacity-75 shadow-xl p-10 rounded-xl mt-20 text-black">
      <div>
        <h1 className="text-5xl font-bold mb-2">
          Hello, {currentUser?.name || "Donor"}.
        </h1>
        <h2 className="text-5xl font-bold text-red-500 mb-4">You're a hero!</h2>
        <p className="text-lg mb-8">You've saved 4 lives</p>

        {/* Show Selected Appointment if available */}
        {selectedAppointment && (
          <div className="mt-4 text-black">
            <p className="font-semibold">Your Selected Appointment:</p>
            <p>Date: <span className="font-medium">{selectedAppointment.date}</span></p>
            <p>Time: <span className="font-medium">{selectedAppointment.time}</span></p>
          </div>
        )}
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
            <p className="text-sm text-black text-center">
              Next Donation <br /> in {daysLeft} days
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/donor/donor_components/appointments")}
          className="mt-6 px-6 py-3 rounded-xl text-white bg-red-600 hover:bg-red-700 transition font-medium"
        >
          Donation Appointment
        </button>
      </div>
    </div>
  );
}
