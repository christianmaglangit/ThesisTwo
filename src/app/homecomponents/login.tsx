"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ import router

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: any) => void;
  onSwitchToSignup: () => void;
}

export default function LoginModal({ onClose, onLogin, onSwitchToSignup }: LoginModalProps) {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter(); // ✅ initialize router

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (!users.some((u: any) => u.email === "redcross@example.com")) {
      users.push({
        name: "Red Cross Manila",
        email: "redcross@example.com",
        password: "password123",
        role: "bloodbank",
      });
    }

    if (!users.some((u: any) => u.email === "hospital@example.com")) {
      users.push({
        name: "St. Peter Hospital",
        email: "hospital@example.com",
        password: "password123",
        role: "hospital",
      });
    }

    localStorage.setItem("users", JSON.stringify(users));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u: any) => u.email === form.email && u.password === form.password
    );

    if (!user) {
      alert("Invalid email or password");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    onLogin(user);
    onClose();

    // ✅ Navigate with Next.js router instead of window.location.href
    if (user.role === "donor") router.push("/donor/donor_dashboard");
    if (user.role === "bloodbank") router.push("/bloodbank/bloodbank_dashboard");
    if (user.role === "hospital") router.push("/hospital/hospital_dashboard");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="relative bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          >
            Login
          </button>
        </form>

        {/* Switch to Sign Up */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <button
            onClick={onSwitchToSignup}
            className="text-red-600 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
