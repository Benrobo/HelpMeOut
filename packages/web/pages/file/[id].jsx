import { BsFillPlayFill, BsTelegram, BsWhatsapp } from "react-icons/bs";
import { AiOutlineEdit, AiTwotoneStar } from "react-icons/ai";
import { IoCopyOutline } from "react-icons/io5";
import { BiLogoFacebookCircle } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import usePageLoaded from "../../hooks/usePageLoaded";
import { Spinner } from "../../components/Loader";
import moment from "moment";
import TopBar from "../../components/TopBar";
import Link from "next/link";
import Layout from "../../components/Layout";
import { getVideoById } from "../../http";
import { twMerge } from "tailwind-merge";

export default function VideoFile({ response }) {
  const { pageLoaded } = usePageLoaded(0.5);

  return (
    <Layout showFooter={true}>
      <section className="w-full h-auto mt-5">
        <div className="grid grid-cols-2 px-[6em]">
          <div className="left flex flex-col items-start justify-start pr-7 ">
            <div
              className={twMerge(
                "w-full flex flex-col items-start justify-start",
                response?.error
                  ? "opacity-[.3] grayscale cursor-not-allowed select-none "
                  : "opacity-1"
              )}
            >
              <span className="text-white-400 ppReg text-[10px] ">Name</span>
              <div className="w-full flex items-center gap-7">
                <h1 className="font-soraB text-[20px] text-blue-100 ">
                  {response?.error ? "N/A" : response?.data?.id}
                </h1>
                <button
                  className="p-2 border-none outline-none flex flex-col items-center justify-center"
                  disabled={response?.error}
                >
                  <AiOutlineEdit className="text-blue-200" />
                </button>
              </div>
              <div className="w-full  flex flex-col items-start justify-start gap-7">
                <div className="w-full px-3 rounded-[10px] flex items-center justify-start border-solid border-[1px] border-white-500 bg-white-105 mt-5 ">
                  <input
                    type="text"
                    className="w-full text-white-300 text-[10px] text-white-400 px-2 py-[1.5em] font-ppReg outline-none border-none bg-transparent"
                    placeholder="enter email of receiver"
                  />
                  <button className="px-3 py-2 rounded-md flex items-center justify-center gap-3 font-ppSB bg-blue-200 text-white-100 text-[10px] scale-[.90] ">
                    Send
                  </button>
                </div>
              </div>

              <br />
              <br />
              <div className="w-full  flex flex-col items-start justify-start gap-2">
                <span className="text-dark-400 ppB text-[12px] ">
                  Video Url
                </span>
                <div className="w-full px-3 rounded-[10px] flex items-center justify-start border-solid border-[1px] border-white-500 bg-white-105 ">
                  <input
                    type="text"
                    className="w-full text-white-300 text-[10px] text-white-400 px-2 py-[1.5em] font-ppReg outline-none border-none bg-transparent"
                    value={response?.error ? "" : response?.data?.videoPath}
                  />
                  <button className="px-3 py-2 rounded-md flex items-center justify-center gap-3 font-ppSB bg-white-105 text-blue-100 text-[10px] scale-[.90] border-solid border-[1px] border-blue-200 ">
                    <IoCopyOutline /> Copy
                  </button>
                </div>
              </div>
              <br />
              <br />
              <div className="w-full  flex flex-col items-start justify-start gap-2">
                <span className="text-dark-400 ppB text-[10px] ml-1 ">
                  Share your video
                </span>
                <div className="w-full rounded-[10px] flex items-center justify-start gap-1 ">
                  <button className="px-3 py-2 rounded-md flex items-center justify-center gap-2 font-ppSB bg-white-105 text-blue-100 text-[10px] scale-[.90] border-solid border-[1px] border-blue-100 ">
                    <BiLogoFacebookCircle className="text-blue-300" size={15} />{" "}
                    Facebook
                  </button>
                  <button className="px-3 py-2 rounded-md flex items-center justify-center gap-2 font-ppSB bg-white-105 text-blue-100 text-[10px] scale-[.90] border-solid border-[1px] border-blue-100 ">
                    <BsWhatsapp className="text-green-500" size={15} /> Whatsapp
                  </button>
                  <button className="px-3 py-2 rounded-md flex items-center justify-center gap-2 font-ppSB bg-white-105 text-blue-100 text-[10px] scale-[.90] border-solid border-[1px] border-blue-100 ">
                    <BsTelegram className="text-blue-300" size={15} /> Telegram
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="right flex flex-col items-center justify-center pl-4 border-l-solid border-l-[2px] border-l-white-300">
            <div className="w-full h-[350px] bg-dark-300 rounded-md overflow-hidden flex flex-col items-center justify-center shadow-lg ">
              {!pageLoaded && (
                <video
                  src={
                    response?.error
                      ? "/oops-video.mp4"
                      : response?.data?.videoPath
                  }
                  className="w-full h-full flex object-cover"
                  controls={!response?.error}
                  autoPlay
                  loop={response?.error}
                  muted={response?.error}
                ></video>
              )}
              {pageLoaded && <Spinner color="#fff" />}
            </div>
            <br />
            <div className="w-full h-auto flex flex-col items-start justify-start">
              <div className="w-full flex items-center justify-between">
                <p className="text-dark-100 font-ppB">Transcript</p>
                {/* <button
                  className={twMerge(
                    "px-3 py-2 rounded-md flex items-center justify-center gap-3 font-ppSB bg-blue-200 text-white-100 text-[10px] scale-[.90] ",
                    response?.error
                      ? "opacity-[.5] cursor-not-allowed"
                      : "opacity-1"
                  )}
                  disabled={response?.error}
                >
                  View Transcript
                </button> */}
              </div>
              <div className="w-full h-auto mt-3 max-h-[250px] flex flex-col items-start justify-start gap-3 overflow-y-scroll hideScrollBar">
                {!response?.error ? (
                  response?.data.transcript?.length > 0 ? (
                    response?.data?.transcript.split("\n").map((data) => (
                      <p
                        key={data}
                        className="text-white-400 font-ppReg text-[10px]"
                      >
                        {data}
                      </p>
                    ))
                  ) : (
                    <p className="text-white-400 font-ppReg text-[10px]">
                      No Transcript available
                    </p>
                  )
                ) : (
                  <p className="px-3 py-2 bg-red-305 text-white-100 font-ppB text-[10px] rounded-sm">
                    ⚠️ {response?.msg}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mt-[10em] text-center flex flex-col items-center justify-center gap-3 mb-9 pb-9">
          <div className="w-full max-w-[450px] text-center flex flex-col items-center justify-center gap-3">
            <p className="text-blue-100 text-[13px] font-ppB">
              To ensure the availability and privacy of your video, we recommend
              saving it to your account.
            </p>
            <button className="px-3 py-2 rounded-md flex items-center justify-center gap-3 font-ppSB bg-blue-100 text-white-100 text-[10px] scale-[.90] ">
              Save Video
            </button>
            <p className="text-white-400 font-ppReg text-[13px]">
              Don't have an account?{" "}
              <Link href="#" className="text-blue-100">
                Create account.
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  let response = { error: false, msg: null, data: null };
  try {
    const resp = await getVideoById(query["id"]);
    const data = resp?.data ?? resp?.response?.data;

    response["data"] = data?.data;
    response["error"] = false;
  } catch (e) {
    const msg = e?.response?.data.message ?? e?.message;
    response["error"] = true;
    response["msg"] = msg;
  }

  return {
    props: { response },
  };
}
