import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
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
