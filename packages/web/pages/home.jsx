import React from "react";
import Layout from "../components/Layout";
import Logo2 from "../public/images/logos/logo-2.png";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import VideoCard from "../components/VideoCard";
import { getAllVideos } from "../http";
import usePageLoaded from "../hooks/usePageLoaded";
import moment from "moment";
import { Spinner } from "../components/Loader";

function Home({ response }) {
  const { pageLoaded } = usePageLoaded(1);
  const error = response?.error;
  const respMsg = response?.msg;
  const data = response?.data;

  return (
    <div className="w-full h-screen overflow-y-hidden">
      <div className="w-full h-full mb-8 flex flex-col items-center justify-between">
        <div className="w-full px-[4em] py-9 flex items-center justify-between">
          <Image src={Logo2} className="w-[100px] " />
          <button className="px-3 flex items-center justify-center gap-2"></button>
        </div>
        <div className="w-full px-[4em] py-5 flex items-start justify-between">
          <div className="w-auto flex flex-col items-start justify-start">
            <h1 className="text-dark-100 ppB text-[2em] ">Hello, John Mark</h1>
            <p className="text-white-400 text-[12px] ppReg ">
              Here are your recorded videos
            </p>
          </div>
          <div className="w-full max-w-[250px] bg-white-300 px-4 flex items-center justify-start rounded-lg">
            <FiSearch size={15} color="#ccc" />
            <input
              type="text"
              className="w-full py-3 bg-transparent outline-none border-none px-3 text-[10px] text-white-400 font-ppReg"
              placeholder="Search for a video"
            />
          </div>
        </div>
        <br />
        <div className="w-full px-[4em] min-h-[15em] mt-9 flex items-start justify-start flex-col gap-4 mb-5 overflow-y-scroll">
          <p className="text-dark-200 font-ppReg text-[12px] ">Recent files</p>
          <div className="w-full flex items-center justify-start flex-wrap gap-7">
            {pageLoaded ? (
              <Spinner color="#000" />
            ) : !error ? (
              data?.length > 0 ? (
                data.map((d) => (
                  <VideoCard
                    key={d?.vId}
                    date={moment(d?.date).format("MMMM Do YYYY")}
                    id={d?.vId}
                    url={d?.video}
                  />
                ))
              ) : (
                <p className="text-white-400 text-[13px] font-ppReg">
                  No recent videos.
                </p>
              )
            ) : (
              <p className="text-white-400 text-[13px]">{respMsg}</p>
            )}
          </div>
          <br />
          {/* <p className="text-dark-200 font-ppReg text-[12px] ">
            Files from last week.
          </p>
          <div className="w-full flex items-center justify-start flex-wrap">
            <VideoCard />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Home;

export async function getServerSideProps() {
  let response = { error: false, msg: null, data: null };
  try {
    const resp = await getAllVideos();
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
