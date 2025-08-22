"use client";

import { useState, useEffect } from "react";
import Navbar from "./homecomponents/navbar";
import HomeContent1 from "./homecomponents/homecontent1";
import HomeContent2 from "./homecomponents/homecontent2";
import Dashdonor from "./homecomponents/dashdonor";
import DashBBank from "./homecomponents/dashbbank";
import DashHospital from "./homecomponents/dashhospital";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [ready, setReady] = useState(false);

  // =========================
  // Setup predefined accounts
  // =========================
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

    if (!users.some((u: any) => u.email === "donor@example.com")) {
      users.push({
        name: "John Donor",
        email: "donor@example.com",
        password: "password123",
        role: "donor",
      });
    }

    localStorage.setItem("users", JSON.stringify(users));

    // Check current session
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
      setShowDashboard(true);
    }

    setReady(true); // ✅ now ready to render Navbar
  }, []);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setShowDashboard(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setShowDashboard(false);
  };

  const renderDashboard = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case "donor":
        return <Dashdonor />;
      case "bloodbank":
        return <DashBBank />;
      case "hospital":
        return <DashHospital />;
      default:
        return <Dashdonor />;
    }
  };

  if (!ready) return null; // wait until predefined accounts exist

  return (
    <>
      <Navbar
        onLogin={handleLogin}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {!showDashboard && (
        <>
          <HomeContent1 />
          <HomeContent2 />
        </>
      )}

      {showDashboard && renderDashboard()}
    </>
  );
}
