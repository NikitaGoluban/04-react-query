import type { KeyboardEvent, SyntheticEvent } from 'react';
import type { Movie } from '../../types/movie';
import css from './MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
    movie: Movie,
  ): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(movie);
    }
  }

  function handleImageError(event: SyntheticEvent<HTMLImageElement>): void {
    if (event.currentTarget.getAttribute('src') !== '/movie-placeholder.svg') {
      event.currentTarget.src = '/movie-placeholder.svg';
    }
  }

  return (
    <ul className={css.grid}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <div
            className={css.card}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${movie.title}`}
            onClick={() => onSelect(movie)}
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) =>
              handleKeyDown(event, movie)
            }
          >
            <img
              className={css.image}
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : '/movie-placeholder.svg'
              }
              alt={movie.title}
              loading="lazy"
              onError={handleImageError}
            />
            <h2 className={css.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}
