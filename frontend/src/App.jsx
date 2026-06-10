import { useState } from "react";
import "./App.css";
import { materials } from "./creator/materialsData.js";

import iconFavourite from "./assets/ulubione.png";
import iconSample from "./assets/Sample.png";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useTitle } from "./main.jsx";
import CookieConsent from "./components/CookieConsent.jsx";

function App() {
	const [count, setCount] = useState(0);

	useTitle("Etoile");
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

						{<img style={{ marginBottom: "30px" }} src={iconFavourite} />}
						<div
							style={{
								height: "1500px",
								background: "linear-gradient(#f9faf5, #e2e3df)",
							}}>
							Przewiń mnie w dół...
							<div className="favourite-spacer"></div>
							<div className="materials-list">
								{materials.map((material) => (
									<div
										key={material.id}
										className="material-card"
										style={{ background: material.gradient }}>
										<span className="material-name">{material.name}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</main>
			<CookieConsent />
			<Footer />
		</div>
	);
}

export default App;
