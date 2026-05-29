import React, { useEffect, useState } from "react";
import "./Dostawa.css";

const SHIPPING_OPTIONS = [
	{
		id: "inpost",
		name: "Paczkomat InPost 24/7",
		description: "Wybierz punkt na mapie w kolejnym kroku",
		provider: "InPost",
		time: "1 dzień roboczy",
		price: 12.99,
		freeFrom: null,
	},
	{
		id: "dpd",
		name: "Kurier DPD",
		description: "Dostawa pod wskazany adres",
		provider: "DPD",
		time: "1-2 dni robocze",
		price: 16.0,
		freeFrom: null,
	},
	{
		id: "dhl_cod",
		name: "Kurier DHL - Pobranie",
		description: "Zapłać gotówką lub kartą u kuriera",
		provider: "DHL",
		time: "1-2 dni robocze",
		price: 22.0,
		freeFrom: null,
	},
	{
		id: "orlen",
		name: "Orlen Paczka",
		description: "Odbiór w punkcie lub automacie Orlen",
		provider: "Orlen",
		time: "2 dni robocze",
		price: 9.99,
		freeFrom: null,
	},
	{
		id: "pickup",
		name: "Odbiór osobisty",
		description: "ul. Towarowa 10, Warszawa (Pon-Pt 8-16)",
		provider: "Sklep własny",
		time: "Gotowe w 2h",
		price: 0.0,
		freeFrom: null,
	},
];

export default function Dostawa({ outRef }) {
	const [selectedMethod, setSelectedMethod] = useState("inpost");
	const [note, setNote] = useState("");

	const handleSelection = (option) => {
		setSelectedMethod(option.id);
		outRef(option.price);
	};

	return (
		<div className="shipping-container shadow">
			<h2 className="shipping-title">Wybierz sposób dostawy</h2>

			<div className="shipping-grid">
				{SHIPPING_OPTIONS.map((option) => {
					const isSelected = selectedMethod === option.id;

					return (
						<div
							key={option.id}
							className={`shipping-card ${isSelected ? "selected" : ""}`}
							onClick={() => handleSelection(option)}>
							<div className="shipping-radio-group">
								<input
									type="radio"
									name="shippingMethod"
									className="shipping-radio-input"
									checked={isSelected}
									onChange={() => handleSelection(option)}
								/>
								<div className="shipping-info">
									<div className="shipping-method-name">{option.name}</div>
									<div className="shipping-method-desc">{option.description}</div>
									<div className="shipping-method-time">⏱ {option.time}</div>
								</div>
							</div>

							<div className="shipping-price-group">
								<span className="shipping-price">
									{option.price === 0
										? "Gratis"
										: `${option.price.toFixed(2)} zł`}
								</span>
							</div>
						</div>
					);
				})}
			</div>

			{(selectedMethod === "inpost" || selectedMethod === "orlen") && (
				<div className="shipping-alert">
					💡 <strong>Informacja:</strong> Mapa wyboru punktu odbioru otworzy się
					automatycznie po przejściu do podsumowania.
				</div>
			)}

			<div className="shipping-note-section">
				<label htmlFor="delivery-note" className="shipping-label">
					📝 Uwagi do dostawy dla kuriera (opcjonalnie)
				</label>
				<textarea
					id="delivery-note"
					className="shipping-textarea"
					placeholder="Napisz np. kod do domofonu, prośbę o kontakt telefoniczny..."
					value={note}
					onChange={(e) => setNote(e.target.value)}
				/>
			</div>
		</div>
	);
}
