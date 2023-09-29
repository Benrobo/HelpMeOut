import React from "react";
import MovieCard from "./Card";
import posterImg from "../../public/images/poster/Poster.png";
import Image from "next/image";

function FeaturedMovies({ movies }) {
  const imagePrix = `https://image.tmdb.org/t/p/original`;

  return (
    <div className="w-full mt-9 flex flex-col items-center justify-center md:grid lg:grid xl:grid md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 gap-10">
      {movies?.map((m) => (
        <MovieCard
          key={m.id}
          id={m.id}
          title={m.title ?? m?.original_name}
          release_date={m.release_date ?? m?.first_air_date}
          imageUrl={`${imagePrix}/${m?.poster_path}`}
        />
      ))}
      <br />
    </div>
  );
}

export default FeaturedMovies;
