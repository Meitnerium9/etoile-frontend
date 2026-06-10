import { useState } from "react";
import "./Creator.css";

import CreatorTitle from "./componenty/CreatorTitle.jsx";
import MaterialSelector from "./componenty/MaterialSelector.jsx";
import CreatorActions from "./componenty/CreatorActions.jsx";
import JewelryTypeSelector from "./componenty/TypeSelector.jsx";
import LengthSelector from "./componenty/LengthSelector.jsx";
import CharmsSelector from "./componenty/CharmsSelector.jsx";
import PriceSummary from "./componenty/PriceSummary.jsx";
import JewelryPreview from "./componenty/JewelryPreview.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useTitle } from "../main.jsx";
import { materials } from "./materialsData.js";
import { Navigate } from "react-router-dom";

const images = import.meta.glob("/src/assets/creator/**/*.{png,jpg,jpeg,webp}", {
	eager: true,
	import: "default",
});

function Creator() {
	if (localStorage.getItem("token") == null) return <Navigate to="/" replace />;
	// Istniejące stany konfiguracji
	const [selectedMaterial, setSelectedMaterial] = useState(1);
	const [isOpen, setIsOpen] = useState(true);
	const [selectedType, setSelectedType] = useState("bracelet");
	const [selectedLength, setSelectedLength] = useState("18 cm");
	const [isLengthOpen, setIsLengthOpen] = useState(true);
	const [selectedCharm1, setSelectedCharm1] = useState("serce");
	const [selectedCharm2, setSelectedCharm2] = useState("none");
	const isNecklace = selectedType === "necklace";

	// NOWE STANY: Potrzebne do obsługi formularza i zapisu
	const [projectName, setProjectName] = useState("Mój Projekt Biżuterii");
	const [loading, setLoading] = useState(false);

	// Logika obliczania cen
	const basePrice = selectedType === "bracelet" ? 800 : 1000;

	const metalPrices = {
		1: 3800,
		2: 4200,
		3: 4000,
		4: 5200,
		5: 1800,
	};

	const lengthPrices = {
		bracelet: {
			"16 cm": 0,
			"18 cm": 200,
			"20 cm": 400,
		},
		necklace: {
			"40 cm": 0,
			"45 cm": 300,
			"50 cm": 600,
		},
	};

	const getImagePath = () => {
		const jewelryFolder = selectedType === "bracelet" ? "Bransoletka" : "Naszyjnik";

		const rawMaterial = materials[selectedMaterial - 1].name;

		const silverLike = ["Srebro", "Platyna", "Złoto białe"];

		const materialFolder = silverLike.includes(rawMaterial)
			? "Srebro"
			: materials[selectedMaterial - 1].name;

		const isTwoCharms = selectedType === "bracelet" && selectedCharm2 !== "none";

		const charmsFolder = isTwoCharms ? "2z" : "1z";

		const fileName = isTwoCharms
			? `${selectedCharm1}-${selectedCharm2}.webp`
			: `${selectedCharm1}.webp`;

		return `/src/assets/creator/${jewelryFolder}/${materialFolder}/${charmsFolder}/${fileName}`;
	};

	const previewImage = images[getImagePath()] || null;
	const lengthPrice = lengthPrices[selectedType]?.[selectedLength] ?? 0;
	const charmPrice = 800;
	const charmsPrice = charmPrice + (selectedCharm2 === "none" ? 0 : charmPrice);
	const metalPrice = metalPrices[selectedMaterial];
	const totalPrice = basePrice + charmsPrice + lengthPrice + metalPrice;

	const finishProjectApi = async (projectData) => {
		// Adres URL jest teraz czysty, nie doklejamy już do niego parametrów "?token="
		const response = await fetch("http://localhost:8000/projects/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "",
				"Access-Control-Allow-Methods": "",
				"Access-Control-Allow-Headers": "*",
				token: localStorage.getItem("token"),
			},
			body: JSON.stringify(projectData),
		});

		if (!response.ok) {
			console.log(await response.json());
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.detail || "Nie udało się zapisać projektu.");
		}

		return await response.json();
	};

	const finishProject = async () => {
		try {
			setLoading(true);

			// Wysyłamy wyłącznie to, czego żąda nowa klasa ProjectCreate
			const payload = {
				name: projectName,
				total_price: totalPrice, // Jeśli operujesz na groszach w kreatorze (np. 5600 -> 56.0)
				category_id: selectedType == "bracelet" ? 2 : 1,
				metal: materials[selectedMaterial - 1].name,
				project_size: Number(selectedLength.split(" ")[0]),
				image_path: getImagePath(), // Możesz też wysłać tylko nazwę pliku i odtwarzać obraz po stronie backendu
				trinket1: selectedCharm1,
				trinket2: selectedCharm2,
			};

			console.log(payload);

			const result = await finishProjectApi(payload);
			alert(`Projekt utworzony!`);

			// Reset formularza
			setProjectName("Mój Projekt Biżuterii");
			setSelectedMaterial(1);
			setSelectedType("bracelet");
			setSelectedLength("16 cm");
			setSelectedCharm1("serce");
			setSelectedCharm2("none");
		} catch (err) {
			alert(`Błąd: ${err.message}`);
		} finally {
			setLoading(false);
		}
	};

	useTitle("Etoile - Kreator");
	return (
		<>
			<Navbar />
			<main className="creator-page">
				<div className="creator-wrapper">
					<div className="creator-layout">
						<JewelryPreview image={previewImage} />
						<div className="creator-panel">
							<CreatorTitle />
							<div
								className="project-name-section"
								style={{ margin: "20px 0", textAlign: "center" }}>
								<label
									htmlFor="projectName"
									style={{ marginRight: "10px", fontWeight: "bold" }}>
									Nazwa Twojego projektu:
								</label>
								<input
									id="projectName"
									type="text"
									value={projectName}
									onChange={(e) => setProjectName(e.target.value)}
									disabled={loading}
									style={{
										padding: "5px 10px",
										borderRadius: "4px",
										border: "1px solid #ccc",
									}}
								/>
							</div>

							<JewelryTypeSelector
								selectedType={selectedType}
								setSelectedType={setSelectedType}
								setSelectedLength={setSelectedLength}
							/>

							<MaterialSelector
								selectedMaterial={selectedMaterial}
								setSelectedMaterial={setSelectedMaterial}
								isOpen={isOpen}
								setIsOpen={setIsOpen}
							/>

							<LengthSelector
								selectedType={selectedType}
								selectedLength={selectedLength}
								setSelectedLength={setSelectedLength}
								isLengthOpen={isLengthOpen}
								setIsLengthOpen={setIsLengthOpen}
							/>

							<CharmsSelector
								selectedCharm1={selectedCharm1}
								setSelectedCharm1={setSelectedCharm1}
								selectedCharm2={selectedCharm2}
								setSelectedCharm2={setSelectedCharm2}
								isNecklace={selectedType === "necklace"}
							/>

							<PriceSummary
								basePrice={basePrice}
								charmsPrice={charmsPrice}
								lengthPrice={lengthPrice}
								metalPrice={metalPrice}
								totalPrice={totalPrice}
							/>

							<CreatorActions finishProject={finishProject} loading={loading} />
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}

export default Creator;
