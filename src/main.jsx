import React from "react";
import ReactDOM from "react-dom/client";
import KJLECommandDeck from "./KJLECommandDeck";

/* Global CSS reset */
const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    background: #010810;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  #root {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <KJLECommandDeck />
  </React.StrictMode>
);
