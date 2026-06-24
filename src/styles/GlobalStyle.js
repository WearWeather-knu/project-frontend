import { createGlobalStyle } from 'styled-components';
import '@fontsource/coda-caption';
import '@fontsource/duru-sans';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'KyoboHandwriting2025lyb';
    src: url('/KyoboHandwriting2025lyb.otf') format('opentype');
    font-weight: 400;
    font-style: normal;
    font-display: block;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    min-height: 100%;
  }

  html {
    background: #f4f5f7;
  }

  body {
    min-height: 100dvh;
    color: #111827;
    font-family:
      'Duru Sans',
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  button {
    border: 0;
    background: none;
    cursor: pointer;
  }

  button,
  a {
    -webkit-tap-highlight-color: transparent;
  }

  button:not(:disabled) {
    --press-scale: 0.985;
    --press-active-filter: brightness(0.94);
    transition:
      filter 140ms ease,
      transform 140ms ease,
      box-shadow 140ms ease;
    will-change: filter, transform;
  }

  button:not(:disabled):hover {
    filter: brightness(0.98);
  }

  button:not(:disabled):active {
    filter: var(--press-active-filter);
    transform: scale(var(--press-scale));
  }

  @media (prefers-reduced-motion: reduce) {
    button:not(:disabled) {
      transition: none;
      will-change: auto;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  #root {
    width: 100%;
    min-height: 100dvh;
    position: relative;
  }
`;

export default GlobalStyle;
