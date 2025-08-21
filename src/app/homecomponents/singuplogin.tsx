"use client";

import { useState } from "react";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Donor", // ✅ default role
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: string) => {
    setForm({ ...form, role });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log(isLogin ? "Login form:" : "Signup form:", form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
          {isLogin ? "Login" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Signup lang makita */}
          {!isLogin && (
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-300"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-300"
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-300"
            />
          </div>

          {/* Confirm Password (Signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-300"
              />
            </div>
          )}

          {/* Role selection (Signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-gray-700 mb-1">Choose Account Type</label>
              <div className="flex justify-between border rounded-lg  overflow-hidden">
                {["Donor", "Blood Bank", "Hospital"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    className={`flex-1 py-2 text-center ${
                      form.role === role
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Switch Auth */}
        <p className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-red-600 hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-red-600 hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
