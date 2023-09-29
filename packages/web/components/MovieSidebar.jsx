import Image from "next/image";
import React from "react";
import logoImg from "../public/images/logo/tv.svg";
import { BiHomeAlt, BiVideoRecording, BiCalendar } from "react-icons/bi";
import { GoDeviceDesktop } from "react-icons/go";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

function MovieSidebar() {
  const sidebarItems = [
    {
      name: "home",
      title: "Home",
    },
    {
      name: "movies",
      title: "Movies",
    },
    {
      name: "tv_series",
      title: "TV Series",
    },
    {
      name: "upcoming",
      title: "Upcoming",
    },
  ];
  const selectedSidebar = "movies";

  return (
    <div className="w-[180px] h-screen flex flex-col items-center justify-start py-4 rounded-r-[30px] rounded-b-[30px] border-r-solid border-r-[1px] border-r-white2-500 ">
      <Link
        href="/"
        className="w-auto min-h-[90px] flex items-center justify-start gap-4  px-4"
      >
        <Image
          src={logoImg}
          className={"w-[25px] h-[25px] md:w-[35px] md:h-[35px] "}
          width={50}
          height={50}
          alt="image"
        />
        <p className="text-dark-100 font-ppB text-[13px] md:text-[16px] ">
          MovieBox
        </p>
      </Link>
      <div className="w-full h-full mt-9 flex flex-col items-center justify-start">
        {sidebarItems.map((d) => (
          <button
            className={twMerge(
              "w-full py-5  hover:bg-red-105 flex items-center justify-start gap-5 px-4 border-r-solid border-r-[4px] text-dark-100 hover:text-red-306 border-r-transparent ",
              selectedSidebar === d.name && "border-r-red-306 bg-red-105"
            )}
            key={d.name}
          >
            {renderNavItemsIcon(d.name, selectedSidebar === d.name)}
            <span
              className={twMerge(
                " text-[18px] font-ppB text-white-400 ",
                selectedSidebar === d.name && "text-red-306"
              )}
            >
              {d.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MovieSidebar;

function renderNavItemsIcon(name, active) {
  let icon = null;
  if (name === "home") {
    icon = <BiHomeAlt size={20} color={active ? "#000" : "#444"} />;
  }
  if (name === "movies") {
    icon = <BiVideoRecording size={20} color={active ? "#000" : "#444"} />;
  }
  if (name === "tv_series") {
    icon = <GoDeviceDesktop size={20} color={active ? "#000" : "#444"} />;
  }
  if (name === "upcoming") {
    icon = <BiCalendar size={20} color={active ? "#000" : "#444"} />;
  }
  return icon;
}
