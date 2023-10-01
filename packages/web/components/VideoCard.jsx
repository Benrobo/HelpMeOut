import Link from "next/link";
import React from "react";

function VideoCard({ url, id, date }) {
  return (
    <Link
      href={`/file/${id}`}
      className="w-full p-4 max-w-[300px] h-[200px] border-solid border-white-300 border-[2px] flex flex-col items-start justify-start rounded-[10px] "
    >
      <video
        src={url}
        autoPlay
        muted
        loop={true}
        className="w-full h-[120px] rounded-[10px] bg-white-300 object-cover"
      ></video>
      <p className="text-dark-100 font-ppSB text-[15px] mt-1">{id ?? "N/A"}</p>
      <p className="text-white-400 opacity-[.5] font-ppReg text-[11px]">
        {date ?? "N/A"}
      </p>
    </Link>
  );
}

export default VideoCard;
