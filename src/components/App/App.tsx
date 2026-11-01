import { useCallback, useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import SearchBar from '../SearchBar/SearchBar';
import css from './App.module.css';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, dataUpdatedAt, isLoading, isError, isSuccess, refetch } =
    useQuery({
      queryKey: ['movies', searchQuery, page],
      queryFn: ({ signal }) => fetchMovies(searchQuery, page, signal),
      enabled: searchQuery.length > 0,
    });

  const movies = data?.results ?? [];
  // TMDB accepts page numbers up to 500, even for larger result sets.
  const totalPages = Math.min(data?.total_pages ?? 0, 500);

  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
      toast('No movies found for your request.', { id: 'movie-search' });
    }
  }, [data, dataUpdatedAt, isSuccess, searchQuery, page]);

  function handleSearch(query: string): void {
    setSearchQuery(query);
    setPage(1);
    setSelectedMovie(null);
    toast.dismiss('movie-search');

    if (query === searchQuery && page === 1) {
      void refetch();
    }
  }

  const handleCloseModal = useCallback((): void => {
    setSelectedMovie(null);
  }, []);

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <main>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {!isLoading && !isError && totalPages > 1 && (
          <nav aria-label="Movie result pages">
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }: { selected: number }) =>
                setPage(selected + 1)
              }
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              disabledClassName={css.disabled}
              nextLabel="→"
              previousLabel="←"
              disableInitialCallback
            />
          </nav>
        )}
        {!isLoading && !isError && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />
        )}
      </main>
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
      <Toaster position="top-right" />
    </div>
  );
}
