import Image from "next/image";

export default function HomeContent1() {
  return (
    <div className="relative w-full h-96 flex items-center justify-center text-center text-white mt-20">
      <Image
        src="/images/enhacing.png"
        alt="Background"
        fill
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 max-w-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Enhancing the blood donation process by connecting donors with blood banks
        </h1>
        <a
          href="/donate"
          className="mt-6 inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Donate Now
        </a>
      </div>
    </div>
  );
};
