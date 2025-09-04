"use client";

import { useState } from "react";

export default function RequestBlood() {
  const [formData, setFormData] = useState({
    name: "",
    bloodType: "",
    bloodComponent: "",
    bloodBagNeeded: "",
    hospital: "",
    neededDate: "",
    bloodRequestForm: null as File | null,
    barangayIndigency: null as File | null,
    seniorId: null as File | null,
    mayorReferral: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, [name]: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Blood request submitted!");
  };

  return (
    <div className="max-w-xl mx-auto mt-5 p-6 bg-gray-100 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Request Blood</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Patient Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <div className="flex gap-3">
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            className="border p-2 rounded flex-1"
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
            type="number"
            name="bloodBagNeeded"
            min={1}
            value={formData.bloodBagNeeded}
            onChange={handleChange}
            className="border p-2 rounded flex-1"
            placeholder="Blood Bag Needed"
            required
          />
        </div>

        {/* New Blood Component Dropdown */}
        <select
          name="bloodComponent"
          value={formData.bloodComponent}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Blood Component</option>
          <option value="Red Blood Cells">Red Blood Cells</option>
          <option value="Plasma">Plasma</option>
          <option value="Platelets">Platelets</option>
          <option value="Whole Blood">Whole Blood</option>
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

        {/* File Inputs Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Blood Request Form
            </label>
            <input
              type="file"
              name="bloodRequestForm"
              onChange={handleFileChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Barangay Indigency
            </label>
            <input
              type="file"
              name="barangayIndigency"
              onChange={handleFileChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Senior ID (Optional)
            </label>
            <input
              type="file"
              name="seniorId"
              onChange={handleFileChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Mayor&apos;s Referral Note
            </label>
            <input
              type="file"
              name="mayorReferral"
              onChange={handleFileChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition mt-2"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}
