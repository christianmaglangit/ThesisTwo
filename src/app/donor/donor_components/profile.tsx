"use client";

import { useState, useEffect, useRef } from "react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Profile {
  name: string;
  age: string;
  gender: string;
  cellphone: string;
  address: string;
  bloodType: string;
  email: string;
  password: string;
  image: string | null;
}

const bloodTypes = ["", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const genders = ["", "Male", "Female", "Other"];

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    name: "",
    age: "",
    gender: "",
    cellphone: "",
    address: "",
    bloodType: "",
    email: "",
    password: "",
    image: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved profile from localStorage
  useEffect(() => {
    setProfile({
      name: localStorage.getItem("profile_name") || "",
      age: localStorage.getItem("profile_age") || "",
      gender: localStorage.getItem("profile_gender") || "",
      cellphone: localStorage.getItem("profile_cellphone") || "",
      address: localStorage.getItem("profile_address") || "",
      bloodType: localStorage.getItem("profile_bloodtype") || "",
      email: localStorage.getItem("profile_email") || "",
      password: localStorage.getItem("profile_password") || "",
      image: localStorage.getItem("profile_image") || null,
    });
  }, []);

  // Handle input changes
  const handleChange = (field: keyof Profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // Save profile to localStorage
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(profile).forEach(([key, value]) => {
      if (value) localStorage.setItem(`profile_${key}`, value.toString());
    });
    setIsEditing(false); // Exit edit mode
    alert("✅ Profile saved successfully!");
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, image: reader.result as string }));
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex min-h-screen items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-red-600 text-center mb-4">
          Profile
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-2">
            {profile.image ? (
              <img
                src={profile.image}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-2 border"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                <span className="text-gray-500 text-sm">No Photo</span>
              </div>
            )}
            {isEditing && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-sm text-gray-600"
              />
            )}
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              placeholder="Full Name"
              value={profile.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
              disabled={!isEditing}
            />

            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Age"
                value={profile.age}
                onChange={(e) => handleChange("age", e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg p-2"
                min={1}
                required
                disabled={!isEditing}
              />
              <select
                value={profile.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg p-2"
                required
                disabled={!isEditing}
              >
                <option value="">Gender</option>
                {genders.slice(1).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="tel"
              placeholder="Cellphone Number"
              value={profile.cellphone}
              onChange={(e) => handleChange("cellphone", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              disabled={!isEditing}
            />

            <input
              type="text"
              placeholder="Address"
              value={profile.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
              disabled={!isEditing}
            />
          </div>

          {/* Medical Info */}
          <select
            value={profile.bloodType}
            onChange={(e) => handleChange("bloodType", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            disabled={!isEditing}
          >
            <option value="">Select Blood Type (Optional)</option>
            {bloodTypes.slice(1).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Account Info */}
          <div className="grid grid-cols-1 gap-3">
            <input
              type="email"
              placeholder="Email Address"
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
              disabled={!isEditing}
            />
            <input
              type="password"
              placeholder="Password"
              value={profile.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
              disabled={!isEditing}
            />
          </div>

          {/* Buttons */}
          {isEditing ? (
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg"
              >
                Save Profile
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            >
              Edit Profile
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
