"use client";

export default function BloodJourney() {
  return (
    <div className="bg-white bg-opacity-75 shadow-xl rounded-xl p-4 mt-12">
      <h3 className="text-lg font-semibold mb-2">Track My Blood Journey</h3>

      <div className="flex justify-between text-sm">
        <span>Donated</span>
        <span>Processed</span>
        <span>Distributed</span>
        <span>Impacted</span>
      </div>
      <div className="relative mt-2 h-2 bg-gray-400 rounded-full">
        <div className="absolute left-1 top-[-6px] w-4 h-4 bg-red-600 rounded-full"></div>
        <div className="absolute left-1/3 top-[-6px] w-4 h-4 bg-red-600 rounded-full"></div>
        <div className="absolute right-1/3 top-[-6px] w-4 h-4 bg-red-600 rounded-full"></div>
        <div className="absolute right-1 top-[-6px] w-4 h-4 bg-red-600 rounded-full"></div>
      </div>
    </div>
  );
}
