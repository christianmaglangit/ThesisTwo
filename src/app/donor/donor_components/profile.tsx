"use client";
import { useState, useEffect, useRef } from "react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const bloodTypes = [
  "", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"
];

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [address, setAddress] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved profile from localStorage
  useEffect(() => {
    setName(localStorage.getItem("profile_name") || "");
    setAge(localStorage.getItem("profile_age") || "");
    setCellphone(localStorage.getItem("profile_cellphone") || "");
    setAddress(localStorage.getItem("profile_address") || "");
    setBloodType(localStorage.getItem("profile_bloodtype") || "");
    setImage(localStorage.getItem("profile_image") || null);
  }, []);

  // Save profile
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("profile_name", name);
    localStorage.setItem("profile_age", age);
    localStorage.setItem("profile_cellphone", cellphone);
    localStorage.setItem("profile_address", address);
    localStorage.setItem("profile_bloodtype", bloodType);
    if (image) localStorage.setItem("profile_image", image);
    onClose();
  };

  // Handle image upload + convert to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        // Reset file input so same file can be uploaded again if needed
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex min-h-screen items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-red-600 mb-4 text-center">
          Edit Profile
        </h2>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-2">
            {image ? (
              <img
                src={image}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-2 border"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                <span className="text-gray-500 text-sm">No Photo</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm text-gray-600"
            />
          </div>

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />

          {/* Age */}
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
            min={1}
          />

          {/* Cellphone Number */}
          <input
            type="tel"
            placeholder="Cellphone Number"
            value={cellphone}
            onChange={(e) => setCellphone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
            pattern="^(09|\+639)\d{9}$"
            title="Enter a valid Philippine cellphone number"
          />

          {/* Address */}
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />

          {/* Blood Type (Optional) */}
          <select
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="">Select Blood Type (Optional)</option>
            {bloodTypes.slice(1).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
