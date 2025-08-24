"use client";

import Navbar from "./homecomponents/navbar";
import HomeContent1 from "./homecomponents/homecontent1";
import HomeContent2 from "./homecomponents/homecontent2";

export default function HomePage() {
  return (
    <div>
      {/* Navbar only for homepage */}
      <Navbar
        onLogin={() => {}}
        onLogout={() => {}}
        currentUser={null}
      />

      <main className="">
        {/* Hero Section */}
        <section className="">
          <HomeContent1 />
        </section>

        {/* Info Section */}
        <section className="">
          <HomeContent2 />
        </section>
      </main>
    </div>
  );
}
