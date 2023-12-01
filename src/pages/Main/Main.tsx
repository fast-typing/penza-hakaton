import React, { useEffect, useState } from "react";
import MovieSceleton from "../../components/MovieSkeleton";
import AdaptiveContainer from "../../components/AdaptiveContainer";
import MovieCard from "../../components/MovieCard/MovieCard";
import { getAllMovies } from "../../services/http.service";
import { Movie } from "../../interfaces/Interfaces";
import { markFavorites } from "../../services/movieField.service";
import Genres from "./Genres/Genres";
import "./Main.css";

const skeleton = () => { return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((el, i) => <MovieSceleton key={i} />) }

export default function Main() {
  const [movies, setMovies] = useState({ default: [], top: [], new: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const res = await getAllMovies();
      if (!res) return;
      const markedMovies = await markFavorites(res);
      setMovies({ default: res, top: sortByField("average_rating", markedMovies), new: sortByField("year", markedMovies) })
      setLoading(false)
    };

    init();
  }, []);

  function sortByField(field: string, arr: Movie[]) {
    return arr
      .sort((curr, prev) => prev[field] - curr[field])
      .slice(0, 10)
      .map((movie) => <MovieCard key={movie.id} movie={movie}></MovieCard>);
  }

  return (
    <>
      <Genres movies={movies.default} />
      <div>
        <h1 className="mb-3">Новинки</h1>
        <AdaptiveContainer content={loading ? skeleton() : movies.new} />
      </div>
      <div>
        <h1 className="mb-3">Топ 10 лучших фильмов</h1>
        <AdaptiveContainer content={loading ? skeleton() : movies.top} />
      </div>
    </>
  );
}
