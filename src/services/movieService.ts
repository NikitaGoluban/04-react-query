import axios from 'axios';
import type { Movie } from '../types/movie';

interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(
  query: string,
  page: number,
  signal?: AbortSignal,
): Promise<MovieSearchResponse> {
  const token = import.meta.env.VITE_TMDB_TOKEN?.trim();

  if (!token) {
    throw new Error('VITE_TMDB_TOKEN is not configured.');
  }

  const response = await axios.get<MovieSearchResponse>(
    'https://api.themoviedb.org/3/search/movie',
    {
      params: { query, include_adult: false, language: 'en-US', page },
      headers: { Authorization: `Bearer ${token}` },
      signal,
      timeout: 15000,
    },
  );

  return response.data;
}
