import MovieDetailView from "../../components/MovieDetailView";
import { MovieDetail } from "../../types/MovieDetail";

async function fetchMovieDetails(imdbID: string): Promise<MovieDetail> {
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=cd2aa4ca&i=${imdbID}&plot=full`
  );

  if (!res.ok) {
    throw new Error("Fehler beim Laden der Filmdetails");
  }

  return res.json();
}

export default async function MoviePage({
  params,
}: {
  params: { imdbID: string };
}) {
  if (!params || !params.imdbID) {
    return <div>Fehler: Keine IMDb-ID gefunden.</div>;
  }

  try {
    const movie = await fetchMovieDetails(params.imdbID);
    return <MovieDetailView movie={movie} />;
  } catch (error) {
    return (
      <div>
        Fehler beim Laden der Filmdetails:{" "}
        {error instanceof Error ? error.message : "Unbekannter Fehler"}
      </div>
    );
  }
}

