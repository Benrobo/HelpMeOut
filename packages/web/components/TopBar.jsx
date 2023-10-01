import React from "react";
import Logo2 from "../public/images/logos/logo-2.png";
import Image from "next/image";
import Link from "next/link";

function TopBar() {
  return (
    <div className="w-full flex items-center justify-start px-[5em] py-4 shadow-sm">
      <div className="w-full flex items-center justify-between gap-9">
        <Image src={Logo2} className="w-[100px] " />
        <div className="flex items-center justify-center gap-3">
          <Link href="#" className="text-blue-100 text-[12px] font-ppSB">
            Features
          </Link>
          <Link href="#" className="text-blue-100 text-[12px] font-ppSB">
            How it Works
          </Link>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link href="#" className="text-blue-100 text-[12px] font-ppSB">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
