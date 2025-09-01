"use client";

import { useState } from "react";

export default function RequestBlood() {
  const [formData, setFormData] = useState({
    name: "",
    bloodType: "",
    hospital: "",
    neededDate: "",
    file: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Blood request submitted!");
    // Here you can later send it to your API
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-red-600">Request Blood</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <select
          name="bloodType"
          value={formData.bloodType}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <input
          type="text"
          name="hospital"
          placeholder="Hospital Name"
          value={formData.hospital}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="date"
          name="neededDate"
          value={formData.neededDate}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}
