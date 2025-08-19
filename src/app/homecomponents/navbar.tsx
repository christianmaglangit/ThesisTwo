import Image from "next/image";

export default function Navbar() {
  return (
    <nav className ="fixed top-0 left-0 w-full shadow-md z-50">
      <div className="flex items-center justify-between p-4 bg-white text-red-600">
        <div className="flex items-center">
          {/* <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          /> */}
          <div className="ml-2">
            <span className="text-3xl font-bold block">DUGO</span>
            <span className="text-sm block">Donor Utility for Giving and Organizing</span>
          </div>
        </div>
        <ul className="flex space-x-4">
          <li>
            <a href="/"className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Login
            </a>
          </li>
          <li>
            <a href="/about" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
              Sign Up
            </a>
          </li>
        </ul>
      </div>      
    </nav>
  );
}
