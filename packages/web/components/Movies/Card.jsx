import Image from "next/image";
import React, { useEffect, useState } from "react";
import posterImg from "../../public/images/poster/Poster.png";
import { AiFillHeart } from "react-icons/ai";
import { twMerge } from "tailwind-merge";
import imdbImg from "../../public/images/logo/imdb.svg";
import tomatoImg from "../../public/images/logo/tomato.svg";
import Link from "next/link";
import moment from "moment";

function MovieCard({ title, release_date, id, imageUrl }) {
  const [savedmovieId, setSavedMovieId] = useState("");
  const imageStyle = {
    backgroundImage: `url(${imageUrl ?? "/images/poster/Poster.png"})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  useEffect(() => {
    const movies =
      localStorage.getItem("@movies") === null
        ? null
        : JSON.parse(localStorage.getItem("@movies"));
    if (movies !== null && movies.length > 0) {
      const filtered = movies.find((d) => d.id === id);
      setSavedMovieId(filtered?.id ?? "");
    }
  }, []);

  function addToLocalStorage() {
    const data = {
      id,
      title,
      release_date,
      imageUrl,
    };
    const prevItems =
      localStorage.getItem("@movies") === null
        ? null
        : JSON.parse(localStorage.getItem("@movies"));

    if (prevItems !== null) {
      const filtered = prevItems.filter((d) => d.id === id);
      if (filtered.length === 0) {
        const comb = [...prevItems, data];
        localStorage.setItem("@movies", JSON.stringify(comb));
        setSavedMovieId(id);
      } else {
        const rest = prevItems.filter((d) => d.id !== id);
        localStorage.setItem("@movies", JSON.stringify(rest));
        setSavedMovieId("");
      }
    } else {
      localStorage.setItem("@movies", JSON.stringify([data]));
      if (savedmovieId === id) setSavedMovieId("");
      else setSavedMovieId(id);
    }
  }

  return (
    <div
      className="w-[250px] max-w-[250px] relative min-h-[490px] flex flex-col items-center justify-start leading-5 "
      data-testid="movie-card"
    >
      <div
        className="w-full h-[360px] relative "
        // style={imageStyle}
        // data-testid="movie-poster"
      >
        <img
          className="w-full h-[360px] absolute top-0 left-0 "
          src={imageUrl}
          alt="poster-img"
          width={0}
          height={0}
          placeholder="empty"
          data-testid="movie-poster"
        />
        <div className="w-full absolute top-0 left-0 flex items-center justify-between py-5 px-3">
          <span
            id="tag"
            className="w-auto invisible px-2 py-[4px] rounded-[30px] text-[12px] font-dmsansB bg-white-105 "
          >
            TV SERIES
          </span>
          <button
            className={twMerge(
              "flex flex-col items-center justify-center text-white-300 p-2 rounded-[50%] ",
              savedmovieId === id ? "bg-red-100" : "bg-white-105"
            )}
            onClick={addToLocalStorage}
          >
            <AiFillHeart
              className={
                savedmovieId === id ? "text-red-305" : "text-white-300"
              }
            />
          </button>
        </div>
      </div>
      <div className="w-full flex flex-col items-start justify-start mt-4 gap-2">
        <p
          className="text-white2-600 font-dmsans text-[13px] "
          data-testid="movie-release-date"
        >
          {release_date}
        </p>
        <h1
          className="text-dark-100 font-dmsansB text-[20px] "
          data-testid="movie-title"
        >
          {title}
        </h1>
        <div className="w-full flex items-center justify-start gap-10">
          {/* <div className="w-auto flex items-center gap-3">
            <Image src={imdbImg} width={35} height={30} />
            <span className="text-white-400 font-dmsans text-[13px]">
              0 / 100
            </span>
          </div>
          <div className="w-auto flex items-center gap-3">
            <Image src={tomatoImg} width={15} height={10} alt="tomato" />
            <span className="text-white-400 font-dmsans text-[13px]">0%</span>
          </div> */}
          <Link
            href={`/movies/${id}`}
            className="text-red-306 font-dmsans text-[13px] underline "
          >
            View details
          </Link>
        </div>
        <div className="w-full flex gap-1">
          <span className="text-white2-500 text-[13px] font-dmsansB ">
            {/* Action, Adventure */}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
