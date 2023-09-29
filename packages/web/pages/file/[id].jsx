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

function formatNumber(number) {
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + "B";
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "k";
  } else {
    return number?.toString();
  }
}

export default function VideoFile() {
  return (
    <Layout showFooter={true}>
      <section className="w-full h-auto mt-5">
        <div className="grid grid-cols-2 px-[6em]">
          <div className="left flex flex-col items-start justify-start pr-7 ">
            <div className="w-full flex flex-col items-start justify-start">
              <span className="text-white-400 ppReg text-[10px] ">Name</span>
              <div className="w-full flex items-center gap-7">
                <h1 className="font-soraB text-[20px] text-blue-100 ">
                  Untitled_Video
                </h1>
                <button className="p-2 border-none outline-none flex flex-col items-center justify-center">
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
            <div className="w-full h-[350px] bg-dark-300 rounded-md overflow-hidden shadow-lg ">
              <video src="" className="w-full h-full flex" controls></video>
            </div>
            <br />
            <div className="w-full h-auto flex flex-col items-start justify-start">
              <div className="w-full flex items-center justify-between">
                <p className="text-dark-100 font-ppB">Transcript</p>
                <button className="px-3 py-2 rounded-md flex items-center justify-center gap-3 font-ppSB bg-blue-200 text-white-100 text-[10px] scale-[.90] ">
                  View Transcript
                </button>
              </div>
              <div className="w-full h-auto mt-3 max-h-[250px] flex flex-col items-start justify-start gap-3 overflow-y-scroll hideScrollBar">
                <p className="text-white-400 font-ppReg text-[10px]">
                  Hey welcome{" "}
                </p>
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

// function SelectedMovie({ movieData }) {
//   const { query } = useRouter();
//   const { pageLoaded } = usePageLoaded(1);

//   console.log(movieData);

//   const movie = movieData?.data;
//   const imagePrix = `https://image.tmdb.org/t/p/original`;
//   const fullImage = `${imagePrix}/${movie?.backdrop_path}`;

//   const genre = movie?.genres?.map((g) => g.name);
//   const title = movie?.original_title;
//   const desc = movie?.overview;
//   const release_date = new Date(
//     movie?.release_date ?? m?.first_air_date
//   )?.toISOString();
//   const rating = formatNumber(movie?.vote_count);

//   const movieRuntime = () => {
//     // const totalMinutes = movie?.runtime;
//     // const hours = Math.floor(totalMinutes / 60);
//     // const minutes = totalMinutes % 60;
//     // const formattedTime = `${hours} hr ${minutes} min`;
//     // return formattedTime;
//     return movie?.runtime;
//   };

//   if (pageLoaded == false) {
//     return (
//       <div className="w-full h-screen flex flex-col items-center justify-center">
//         <Spinner color="#000" />
//       </div>
//     );
//   }

//   const imageStyle = {
//     backgroundImage: `url(${fullImage ?? "/images/poster/Poster.png"})`,
//     backgroundSize: "cover",
//     backgroundRepeat: "no-repeat",
//     backgroundPosition: "center",
//   };

//   return (
//     <div className="w-full h-full relative">
//       <div className="w-full flex items-start justify-start">
//         <MovieSidebar />
//         {movieData?.err === false && (
//           <div className="w-full h-screen overflow-scroll flex flex-col items-center justify-start py-9 px-6">
//             {/* Thumbnail */}
//             <div
//               className="w-full h-[450px] relative rounded-[10px] bg-dark-100 "
//               style={imageStyle}
//             >
//               {/* control button */}
//               <div className="w-full h-full flex flex-col items-center justify-center absolute top-0 left-0">
//                 <div className="w-full max-w-[168px] flex flex-col items-center justify-center ">
//                   <button className="w-[109px] h-[109px] backdrop-blur-sm rounded-[50%] transition-all scale-[.75] hover:scale-[.85] bg-white-105 text-center flex flex-col items-center justify-center">
//                     <BsFillPlayFill className="text-white-100 w-[54px] h-[54px] " />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Movie info */}
//             <br />
//             <div className="w-full flex flex-col items-center justify-start">
//               <div className="w-full flex items-center justify-between">
//                 <div className="w-auto flex items-center justify-start gap-3">
//                   <span
//                     className="text-dark-100 font-dmsans"
//                     data-testid="movie-title"
//                   >
//                     {title}
//                   </span>
//                   <span className="text-dark-100 font-dmsans">.</span>
//                   <span
//                     className="text-dark-100 font-dmsans"
//                     data-testid="movie-release-date"
//                   >
//                     {release_date}
//                   </span>
//                   {/* <span className="text-dark-100 font-dmsans">.</span> */}
//                   {/* <span className="text-dark-100 font-dmsans">PG-13</span> */}
//                   <span className="text-dark-100 font-dmsans">.</span>
//                   <span
//                     className="text-dark-100 font-dmsans"
//                     data-testid="movie-runtime"
//                   >
//                     {movieRuntime()}
//                   </span>
//                   {/* tags */}
//                   <div className="w-auto flex items-center justify-center gap-3">
//                     {genre?.map((g) => (
//                       <span
//                         id="tag"
//                         className="w-auto px-3 py-[4px] rounded-[30px] text-[12px] font-dmsansB bg-white-105 border-solid border-[1px] border-red-105 text-red-306 "
//                         key={g}
//                       >
//                         {g}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="w-auto flex items-center justify-start gap-2">
//                   <span className="text-white-400 flex items-center justify-start">
//                     <AiTwotoneStar className="text-orange-200" />
//                     <span className="font-dmsans">{rating}</span>
//                   </span>
//                   {/* <span className="font-dmsans">|</span> */}
//                   {/* <span className="font-dmsans">350k</span> */}
//                 </div>
//               </div>
//               <br />
//               <div className="w-full flex items-center justify-between gap-6">
//                 <div className="w-full  max-w-[700px] mt-2 flex flex-col items-start justify-start">
//                   <p
//                     className="text-gray-600 font-dmsans text-[14px] "
//                     data-testid="movie-overview"
//                   >
//                     {desc}
//                   </p>
//                 </div>
//                 <div className="w-[600px] h-full "></div>
//               </div>
//             </div>
//           </div>
//         )}

//         {movieData?.err && (
//           <div className="w-full h-screen flex flex-col items-center justify-center">
//             <p className="text-dark-300 font-ppB">Something went wrong!</p>
//             <h2 className="text-white-400 font-dmsans text-[20px] ">
//               Oops, there is an error!
//             </h2>
//             <br />
//             <button
//               type="button"
//               onClick={() => {
//                 window && window.location.reload();
//               }}
//               className="w-auto px-5 py-3 rounded-md flex items-center justify-center text-center bg-dark-100 text-white-100 ppR text-[13px] "
//             >
//               Try again?
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SelectedMovie;

// // getStaticProps generates the page at build time. There's no possible way to know the custom query params your visitors can use at build time.

// // getInitialProps and getServerSideProps can know all the possible query params because the page is generated at runtime, whenever you receive a new request.

// export async function getServerSideProps({ query }) {
//   const apiKey = process.env.TMDB_API;
//   const resp = await getMovieById(apiKey, query?.id);

//   let result = { err: false, data: null };

//   if (resp?.success === false) {
//     result["err"] = true;
//     result["data"] = null;
//   } else {
//     result["data"] = resp;
//   }
//   return {
//     props: {
//       movieData: result,
//     },
//   };
// }
