import React from "react";
import Layout from "../components/Layout";
import Logo2 from "../public/images/logos/logo-2.png";
import Image from "next/image";

function Home() {
  return (
    <Layout showFooter showTopBar={false}>
      <div className="w-full flex items-center justify-between">
        <div className="w-full px-[4em] py-9 flex items-center justify-between">
          <Image src={Logo2} className="w-[100px] " />
        </div>
      </div>
    </Layout>
  );
}

export default Home;
