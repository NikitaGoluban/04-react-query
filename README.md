# 04-react-query

Homework 4: a movie search app using the TMDB API, TanStack Query, and React Paginate. Built on homework 3 with React, TypeScript, Vite, Axios, React Hot Toast, CSS Modules, and modern-normalize.

## Local setup

1. Install dependencies:

   ```sh
   npm ci
   ```

2. Copy `.env.example` to `.env` and set your **API Read Access Token** from [TMDB API settings](https://www.themoviedb.org/settings/api):

   ```dotenv
   VITE_TMDB_TOKEN=your_api_read_access_token
   ```

   Use the read access token for Bearer authentication. `.env` is ignored by Git. Restart Vite after changing `.env`.

3. Start the app:

   ```sh
   npm run dev
   ```

On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Features

- Movie search with validation for empty or whitespace-only input.
- TanStack Query manages response caching, loading, errors, and cancellation through Axios. The query key contains the search text and page. Results stay fresh for one minute.
- React Paginate displays navigation above the gallery when `total_pages` is greater than one. The API uses one-based pages; the pagination component uses zero-based indices.
- Navigation respects [TMDB's maximum of 500 pages](https://developer.themoviedb.org/docs/errors), including searches that report more pages.
- A new search resets the page to one and clears the previous selection. Submitting the same search again on page one retries the request.
- Empty-result notifications, a loading indicator, and an error message.
- A movie details modal with title, image, overview, release date, and rating.
- Modal closing by button, Escape, or backdrop; keyboard focus management and scroll locking.
- Local fallback images for missing or unavailable posters.

## Structure

```text
src/
  components/
    App/
    SearchBar/
    MovieGrid/
    Loader/
    ErrorMessage/
    MovieModal/
  services/movieService.ts
  types/movie.ts
  index.css
  main.tsx
```

Each component has matching `.tsx` and `.module.css` files. `src/main.tsx` creates the query client and provides it to the app. `App` uses `useQuery`; the movie service returns the full search response, including `results` and `total_pages`.

The existing component styles come from the [assignment styles repository](https://github.com/goitacademy/react-movies-styles), with responsive form and modal adjustments. Pagination uses the assignment's styles with keyboard focus and disabled states.

## Checks

```sh
npm run build
npm run lint
npm run format:check
```

To preview the production build locally:

```sh
npm run build
npm run preview
```

## Vercel deployment

1. Push the project to [04-react-query](https://github.com/NikitaGoluban/04-react-query) and import that repository into Vercel.
2. Select the **Vite** preset, build command `npm run build`, and output directory `dist`.
3. Add `VITE_TMDB_TOKEN` with your TMDB API Read Access Token for Production before deploying. Redeploy if you add or change it afterward.
4. Verify search, page navigation, resetting to page one on a new search, empty results, and the movie modal on the deployed app. Check that normal operation has no browser console errors or warnings.
5. Submit the repository link and the **production URL from the Domains section** in Vercel. The assignment asks you to wait five minutes after your last GitHub update before submitting.
