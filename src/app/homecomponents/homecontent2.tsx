import Image from "next/image";

export default function HomeContent2() {
  return (
    <div className="relative w-full h-70 flex items-center justify-center text-center text-white bg-gray-200 ">
        <div className="relative z-10 bg-white bg-opacity-75 rounded-lg m-5 w-50 flex flex-col items-center p-4 shadow-xl">
            <Image
                src="/images/blooddonation.png"
                alt="Logo"
                width={80}
                height={80}
                className=" mb-4"
            />
            <p className="text-gray-700 ">Track your donation</p>
        </div>
        <div className="relative z-10 bg-white bg-opacity-75 rounded-lg m-5 w-50 flex flex-col items-center p-4 shadow-xl">
            <Image
              src="/images/appointment.png"
              alt="Logo"
              width={80}
              height={80}
              className="mb-4"
            />
            <p className="text-gray-700">Scheduling</p>
        </div>
        <div className="relative z-10 bg-white bg-opacity-75 rounded-lg m-5 w-50 flex flex-col items-center p-4 shadow-xl">
            <Image
              src="/images/donorres.png"
              alt="Logo"
              width={80}
              height={80}
              className="mb-4"
            />
            <p className="text-gray-700">Donor Resource</p>
        </div>
        <div className="relative z-10 bg-white bg-opacity-75 rounded-lg m-5 w-50 flex flex-col items-center p-4 shadow-xl">
            <Image
              src="/images/whydonate.png"
              alt="Logo"
              width={80}
              height={80}
              className="mb-4"
            />
            <p className="text-gray-700">Why donate</p>
        </div>
    </div>
  );
};