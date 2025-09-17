"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface SignupModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function SignupModal({ onClose, onSwitchToLogin }: SignupModalProps) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    address: "",
    bloodType: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Sign up user (email verification required)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) {
        alert("Signup Error: " + authError.message);
        setLoading(false);
        return;
      }

      alert(
        "✅ Account created! Please check your email for verification. " +
        "Your profile will be created after you verify your email."
      );

      // Close signup and switch to login modal
      onClose();
      onSwitchToLogin();

      // 2️⃣ Optional: Insert profile AFTER email verification
      // This part can be handled in your login flow: 
      // once user logs in after verifying email, check if profile exists
      // and insert if missing (RLS-safe).

    } catch (err) {
      console.error("Unexpected Error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="relative bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name, Age, Gender, Contact, Address, Blood Type, Email, Password */}
          <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-800"/>
          <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-800"/>
          <select name="gender" value={form.gender} onChange={handleChange} required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-800">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input type="text" name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-800"/>
          <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-800"/>
          <select name="bloodType" value={form.bloodType} onChange={handleChange} required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-800">
            <option value="">Select Blood Type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-800"/>
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-800"/>
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-800"/>
          
          <button type="submit" disabled={loading} className={`w-full py-2 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} className="text-red-600 font-semibold hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
