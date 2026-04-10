import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    min-height: 100vh;

    background: linear-gradient(90deg, #cde5ff 0%, #f6faff 100%);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  * {
    &::-webkit-scrollbar {
      width: 3px; 
    }
    &::-webkit-scrollbar-track {
      background: #f0f4f8; 
    }
    &::-webkit-scrollbar-thumb {
      background: #4da3ff;
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #2f8cff;
    }
    scrollbar-width: thin;
    scrollbar-color: #4da3ff #f0f4f8;
  }

  @font-face {
    font-family: "Inter";
    src: url('/fonts/inter-regular.ttf') format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  body {
    font-family: "Inter", sans-serif;
  }

  a {
    font-weight: 500;
    color: #646cff;
    text-decoration: inherit;
  }

  a:hover {
    color: #535bf2;
  }
`;

export default GlobalStyle;
