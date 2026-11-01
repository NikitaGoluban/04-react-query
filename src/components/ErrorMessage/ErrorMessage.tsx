import css from './ErrorMessage.module.css';

export default function ErrorMessage() {
  return (
    <p className={css.text} role="alert">
      There was an error, please try again...
    </p>
  );
}
