import React from "react";
import Layout from "../components/Layout";
import Logo2 from "../public/images/logos/logo-2.png";
import Image from "next/image";

function Home() {
  return (
    <Layout showFooter showTopBar={false}>
      <div className="w-full flex flex-col items-center justify-between">
        <div className="w-full px-[4em] py-9 flex items-center justify-between">
          <Image src={Logo2} className="w-[100px] " />
          <button className="px-3 flex items-center justify-center gap-2"></button>
        </div>
        <div className="w-full px-[4em] py-9 flex flex-col items-start justify-start">
          <h1 className="text-dark-100 ppB text-[2em] ">Hello, John Mark</h1>
          <p className="text-white-400 text-[12px] ppReg ">
            Here are your recorded videos
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
