import { createGlobalStyle } from 'styled-components';
import '@fontsource/coda-caption';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'KyoboHandwriting2025lyb';
    src: url('/KyoboHandwriting2025lyb.otf') format('opentype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
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
      'KyoboHandwriting2025lyb',
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
