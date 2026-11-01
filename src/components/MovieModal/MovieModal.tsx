import { useEffect, useId, useRef } from 'react';
import type { MouseEvent, SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movie';
import css from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') onClose();

      if (event.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [tabindex="0"]',
        );
        const first = focusable?.[0];
        const last = focusable?.[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose]);

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) onClose();
  }

  function handleImageError(event: SyntheticEvent<HTMLImageElement>): void {
    if (event.currentTarget.getAttribute('src') !== '/movie-placeholder.svg') {
      event.currentTarget.src = '/movie-placeholder.svg';
    }
  }

  const imagePath = movie.backdrop_path || movie.poster_path;

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
    >
      <div className={css.modal} ref={modalRef}>
        <button
          className={css.closeButton}
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          ref={closeButtonRef}
        >
          &times;
        </button>
        <img
          src={
            imagePath
              ? `https://image.tmdb.org/t/p/original${imagePath}`
              : '/movie-placeholder.svg'
          }
          alt={movie.title}
          className={css.image}
          onError={handleImageError}
        />
        <div className={css.content} tabIndex={0}>
          <h2 id={titleId}>{movie.title}</h2>
          <p>{movie.overview || 'No overview available.'}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date || 'Unknown'}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
