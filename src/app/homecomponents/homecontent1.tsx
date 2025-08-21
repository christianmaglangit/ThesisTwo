"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function HomeContent1() {
  const slides = [
    {
      image: "/images/enhacing.png",
      text: "Enhancing the blood donation process by connecting donors with blood banks",
      link: "/dashdonor",
    },
    {
      image: "/images/beahero.png",
      text: "Be a Hero, Donate Blood, Save More Lives",
      link: "/dashdonor",
    },
    {
      image: "/images/UIL1.png",
      text: "To solve low awareness, inconvenience, and donation rates in blood donation",
      link: "/dashdonor",
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);
  return (
    <div className="relative w-full h-96 flex items-center justify-center text-center text-white mt-20 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={slides[currentIndex].image}
          alt="Blood Donation"
          fill
          className="object-cover transition-all duration-1000 ease-in-out"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <div className="relative z-10 max-w-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-shadow-lg/50">
          {slides[currentIndex].text}
        </h1>
        <a
          href="/donate"
          className="mt-6 inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition "
        >
          Donate Now
        </a>
      </div>
      <div className="absolute bottom-4 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-red-600" : "bg-white/50"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
