import React from "react";
import Image from "next/image";

function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Image
          src="/jiga-logo.svg"
          alt="Logo"
          className="h-8 w-auto"
          width={50}
          height={50}
        />
        <h1 className="text-xl font-semibold">
          Jiga - Senior Full Stack Dev Takehome Task
        </h1>
      </div>
    </header>
  );
}

export default Header;
