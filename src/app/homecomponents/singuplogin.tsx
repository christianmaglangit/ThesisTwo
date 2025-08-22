"use client";

import { useState } from "react";

interface AuthModalProps {
  mode: "login" | "signup";
  onClose: () => void;
  onLogin: (user: any) => void;
}

export default function AuthModal({ mode, onClose, onLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      // LOGIN
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = users.find(
        (u: any) => u.email === form.email && u.password === form.password
      );

      if (foundUser) {
        localStorage.setItem("currentUser", JSON.stringify(foundUser));
        alert("Login successful!");
        onLogin(foundUser);
        onClose();
      } else {
        alert("Invalid email or password.");
      }
    } else {
      // SIGNUP
      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const exists = users.some((u: any) => u.email === form.email);
      if (exists) {
        alert("Email already registered!");
        return;
      }

      const newUser = {
        name: form.name,
        email: form.email,
        password: form.password,
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      alert("Account created successfully!");
      onLogin(newUser);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
          {isLogin ? "Login" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-300 text-gray-900"
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
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-300 text-gray-900"
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
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-300 text-gray-900"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-red-300 text-gray-900"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

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
