import React from "react";
import { ShieldCheck, Lock, BadgeCheck } from "lucide-react"; // Trust icons

const Header = () => {
  return (
    <header className="w-full bg-white shadow-lg border-b border-gray-200 py-4 px-4 md:px-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      
      {/* Title & Subtitle */}
      <div className="text-center md:text-left max-w-2xl mx-auto md:mx-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-900 tracking-tight leading-snug">
          AFFF Foam Cancer Lawsuit – Check Eligibility
        </h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base leading-relaxed">
          Answer a few quick questions to see if you qualify. Takes less than{" "}
          <span className="font-semibold text-gray-900">2 minutes</span>.
        </p>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 shadow-sm w-full sm:w-auto justify-center">
          <BadgeCheck className="text-green-600 w-5 h-5" />
          <span className="text-sm font-medium text-gray-700">BBB Accredited</span>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 shadow-sm w-full sm:w-auto justify-center">
          <ShieldCheck className="text-blue-600 w-5 h-5" />
          <span className="text-sm font-medium text-gray-700">Free, No Obligation</span>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 shadow-sm w-full sm:w-auto justify-center">
          <Lock className="text-gray-600 w-5 h-5" />
          <span className="text-sm font-medium text-gray-700">Secure SSL</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
