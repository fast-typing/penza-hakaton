import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Movie } from "../../interfaces/Interfaces";
import { getMovie, getReviews, getUserData } from "../../services/http.service";
import { MOVIE_FIELDS } from "../../App.constants";
import Reviews from "./Reviews/Reviews";
import PageSkeleton from "./PageSkeleton/PageSkeleton";
import Trailer from "./Trailer/Trailer";
import { changeBooleanTypesOfMovies } from "../../services/movieField.service";
import { Rating } from "@mui/material";
import Widgets from "./Widgets/Widgets";

export default function MoviePage() {
  const [movie, setMovie] = useState<Movie>(null);
  const [detailedInfo, setDetailedInfo] = useState(null);
  const [reviews, setReviews] = useState(null)
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const movieFields = MOVIE_FIELDS;

  useEffect(() => {
    const init = async () => {
      let resMovie = await getMovie(id);
      const resReviews = await getReviews(id);
      const token = localStorage.getItem("token") ?? "";
      const user = await getUserData(token);
      if (!resMovie) return;
      resMovie = changeBooleanTypesOfMovies([resMovie], user)[0];

      initDetailedInfo(resMovie)
      setReviews(resReviews)
      setMovie(resMovie);
      setLoading(false);
    };

    init();
  }, []);

  function initDetailedInfo(movie: Movie) {
    const info = [];
    for (let key of Object.keys(movieFields)) {
      const layout =
        (<div className="flex gap-2 justify-between md:justify-normal text-sm">
          <span className="md:w-[140px]">{movieFields[key]}: </span>
          <h3 className="text-sm text-right md:text-left">
            {Array.isArray(movie[key]) ? movie[key].map((el) => <span>{el}, </span>) ?? "-" : movie[key] ?? "-"}
          </h3>
        </div>)

      info.push(layout);
    }

    setDetailedInfo(info);
  }

  return (
    loading ? (
      <PageSkeleton />
    ) : (
      <div className="grid gap-12 w-full">
        <div className="w-full grid gap-4">
          <div className="flex flex-wrap sm:flex-nowrap gap-4 justify-between sm:justify-start items-center">
            <h1>{movie.title}</h1>
            <div className="flex gap-1 items-center">
              <Rating max={10} precision={0.1} defaultValue={movie.average_rating} size="large" readOnly />
              <p className="text-lg">{movie.average_rating}</p>
            </div>
          </div>
          <Widgets movie={movie} />
        </div>
        <div className="grid md:flex gap-8 w-full">
          <Trailer movie={movie} />
          <div className="w-full">
            <h2 className="mb-4">О фильме</h2>
            <div className="grid gap-4">{detailedInfo}</div>
          </div>
        </div>
        <Reviews film_id={id} reviews={reviews} />
      </div>
    )
  );
}