"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white fixed left-1/2 -translate-x-1/2 z-50 mt-4 sm:mt-8 md:mt-12 
    w-[90%] md:w-auto rounded-xl shadow-sm border">

      <div className="flex items-center justify-between px-4 py-3 md:px-6">

        {/* Logo / Title */}
        <Link href="/" className="font-semibold whitespace-nowrap">
          AUC ASIC Design School
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-10 ml-10">
          <Link href="/members">
            Members
          </Link>
          <Link href="/publications">
            Publications
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col px-4 pb-4 border-t">
          <Link
            href="/members"
            onClick={() => setOpen(false)}
            className="py-3"
          >
            Members
          </Link>
          <hr className="border-t" />
          <Link
            href="/publications"
            onClick={() => setOpen(false)}
            className="py-2"
          >
            Publications
          </Link>
        </div>
      )}
    </nav>
  );
}