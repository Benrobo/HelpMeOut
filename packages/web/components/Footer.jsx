import React from "react";
import { AiFillFacebook } from "react-icons/ai";
import { BsInstagram, BsTwitter, BsYoutube } from "react-icons/bs";
import Logo3 from "../public/images/logos/logo-3.svg";
import Image from "next/image";
import Link from "next/link";

function Footer() {
  return (
    <div className="w-full h-auto min-h-[100px] bg-blue-100 flex items-center justify-center py-5 px-5 ">
      <footer className="w-full md:px-6 px-2 py-10 font-bold text-gray-90 flex items-center justify-between">
        <div className="left w-auto min-w-[30%]">
          <Image src={Logo3} className="w-[100px]" />
        </div>
        <div className="w-full flex items-center justify-start gap-[10em]">
          <div className="w-auto flex flex-col items-start justify-start gap-2">
            <label htmlFor="" className="text-white-100 text-[13px] font-ppB">
              Menu
            </label>
            <Link href="#" className="text-[10px] text-white-100 font-ppReg ">
              Home
            </Link>
            <Link href="#" className="text-[10px] text-white-100 font-ppReg ">
              Converter
            </Link>
            <Link href="#" className="text-[10px] text-white-100 font-ppReg ">
              How it Works
            </Link>
          </div>
          <div className="w-auto flex flex-col items-start justify-start gap-2">
            <label htmlFor="" className="text-white-100 text-[13px] font-ppB">
              About us
            </label>
            <Link href="#" className="text-[10px] text-white-100 font-ppReg ">
              About
            </Link>
            <Link href="#" className="text-[10px] text-white-100 font-ppReg ">
              Contact Us
            </Link>
            <Link href="#" className="text-[10px] text-white-100 font-ppReg ">
              Privacy Policy
            </Link>
          </div>
          <div className="w-auto flex flex-col items-start justify-start gap-2">
            <label htmlFor="" className="text-white-100 text-[13px] font-ppB">
              Screen Record
            </label>
            <Link href="#" className="text-[10px] text-white-100 font-ppReg ">
              Browser Window
            </Link>
            <Link href="#" className="text-[10px] text-white-100 font-ppReg ">
              Desktop
            </Link>
            <Link href="#" className="text-[10px] text-white-100 font-ppReg ">
              Application
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
