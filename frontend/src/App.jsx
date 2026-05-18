import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import iconFavourite from "./assets/ulubione.png";
import iconCart from "./assets/cart.png";
import iconLogo from "./assets/logo.png";
import iconAcc from "./assets/account.png";
import iconSample from "./assets/Sample.png";
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app-container">
       <Navbar />

      <main className="main-content">
        {/* LEWA STRONA */}
        <div className="left-side">
          <div className="card">
            <img
              style={{ marginBottom: "30px" }}
              src={iconSample}
              alt="Przykład"
              className="wyb-Sample-img"
            />
            <h2 className="card-title">CENA CAŁKOWITA</h2>
            <p style={{ marginBottom: "30px" }} className="card-price">
              6200 zł
            </p>
          </div>
        </div>

        <div className="divider"></div>

        {/* PRAWA STRONA */}
        <div className="right-side">
          <div className="scroll-content">
            <h2>Wybór materiałów</h2>
            {
              <img
                style={{ marginBottom: "30px" }}
                src={iconFavourite}
                alt="Przykład"
                className="wyb-Sample-img"
              />
            }
            <div
              style={{
                height: "1500px",
                background: "linear-gradient(#f9faf5, #e2e3df)",
              }}
            >
              Przewiń mnie w dół...
            </div>
          </div>
        </div>
      </main>

        <Footer />
    </div>
  );
}

export default App;
