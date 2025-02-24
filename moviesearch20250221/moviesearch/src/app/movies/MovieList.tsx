import { Movie } from "../types/Movie";
import styles from "./MovieList.module.css";
import Link from "next/link";
import Image from "next/image";

type MovieListProps = {
  movies: Movie[];
};

export default function MovieList({ movies }: MovieListProps) {
  return (
    <div className={styles.movielist}>
      <h2>{movies.length} movies found</h2>
      <div className={styles.movies}>
        {movies.map((movie) => (
          <div key={movie.imdbID} className={styles.movie}>
            <Link href={`/movies/${movie.imdbID}`}>
              <div className={styles.moviePoster}>
                <Image
                    src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.jpg"} // Fallback für ungültige Poster-URLs
                    alt={movie.Title}
                    width={300}
                    height={450}
                    unoptimized
                />
              </div>
            </Link>
            <div className={styles.movieTitle}>{movie.Title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
