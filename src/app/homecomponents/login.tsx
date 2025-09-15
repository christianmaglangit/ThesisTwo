"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: any) => void;
  onSwitchToSignup: () => void;
}

export default function LoginModal({ onClose, onLogin, onSwitchToSignup }: LoginModalProps) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (authError || !authData.user) {
        alert("Invalid email or password");
        setLoading(false);
        return;
      }

      const user = authData.user;

      // 2️⃣ Check if profile exists
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        // Ignore "no rows found" (PGRST116), but log other errors
        console.error("Profile fetch error:", profileError);
      }

      // 3️⃣ Insert profile if it doesn't exist
      if (!profileData) {
        await supabase.from("profiles").insert({
          id: user.id,
          full_name: "New User",
          age: null,
          gender: null,
          contact: null,
          address: null,
          blood_type: null,
        });
      }

      // 4️⃣ Save current user in localStorage (optional)
      localStorage.setItem("currentUser", JSON.stringify(user));

      // 5️⃣ Trigger parent onLogin
      onLogin(user);
      onClose();

      // 6️⃣ Redirect based on user role
      // Assuming roles are stored in `user.user_metadata.role` or a custom table
      const role = (user.user_metadata as any)?.role || "donor"; // default to donor
      if (role === "donor") router.push("/donor");
      if (role === "bloodbank") router.push("/bloodbank/bloodbank_dashboard");
      if (role === "hospital") router.push("/hospital/hospital_dashboard");

    } catch (err) {
      console.error("Login error:", err);
      alert("An unexpected error occurred during login.");
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
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-800 "
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-800"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

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
