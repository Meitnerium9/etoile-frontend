import "../App.css";
import { useEffect, useState } from "react";
import "./BuyLater.css";

import BuyLaterHeader from "./components/BuyLaterHeader.jsx";
import BuyLaterItem from "./components/BuyLaterItem.jsx";
import BuyLaterSummary from "./components/BuyLaterSummary.jsx";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer";
import { useTitle } from "../main.jsx";

function BuyLater() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("electronic");

	useTitle("Etoile - Kup później");

	useEffect(() => {
		fetchBuyLater();
	}, []);

	async function fetchBuyLater() {
		const token = localStorage.getItem("token");

		if (!token) {
			setError("Musisz być zalogowany, aby zobaczyć produkty zapisane na później.");
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError("");

			const response = await fetch("http://localhost:8000/buylater/", {
				headers: {
					token: localStorage.getItem("token"),
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Nie udało się pobrać produktów.");
			}

			const data = await response.json();

			const formattedData = data.map((item) => ({
				...item,
				id: item.buylater_id || item.id,
				product_id: item.product_id,
				project_id: item.project_id,
				checked: true,
				title: item.title || `Produkt na później #${item.id}`,
				price: item.price || 0,
				seller: item.seller || "Etoile_Jewelry",
			}));

			setProducts(formattedData);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	const handleToggleCheck = (id) => {
		setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p)));
	};

	const handleToggleAll = (isChecked) => {
		setProducts((prev) => prev.map((p) => ({ ...p, checked: isChecked })));
	};

	const handleRemoveSelected = async () => {
		const token = localStorage.getItem("token");
		if (!token) return alert("Musisz być zalogowany.");

		const selected = products.filter((p) => p.checked);
		if (selected.length === 0) return;

		try {
			await Promise.all(
				selected.map((item) =>
					fetch(`http://localhost:8000/buylater/`, {
						method: "DELETE",
						headers: {
							token: localStorage.getItem("token"),
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							buylater_id: item.id,
						}),
					})
				)
			);
			await fetchBuyLater();
		} catch (err) {
			alert("Nie udało się usunąć zaznaczonych produktów.");
		}
	};

	const handlePayment = async () => {
		const token = localStorage.getItem("token");
		if (!token) return alert("Musisz być zalogowany.");

		const selected = products.filter((p) => p.checked);
		if (selected.length === 0) return alert("Zaznacz produkty, za które chcesz zapłacić.");

		// Logika płatności integrująca wybraną metodę płatności i zaznaczone produkty
		const payload = {
			products: selected.map((p) => ({ product_id: p.product_id, project_id: p.project_id })),
			payment_method: paymentMethod,
		};

		console.log("➡️ PROCESOWANIE PŁATNOŚCI:", payload);
		alert(`Przekierowywanie do płatności elektronicznej. Suma: ${totalPrice} zł`);
	};

	const checkedProducts = products.filter((p) => p.checked);
	const totalPrice = checkedProducts.reduce((sum, p) => sum + p.price, 0);

	return (
		<div className="app-container">
			<Navbar />

			<div className="bl-page-container">
				<div className="bl-layout">
					<div className="bl-main">
						<h1 className="bl-heading">Kup później</h1>

						<div className="bl-white-card bl-shadow">
							{products.length > 0 && (
								<BuyLaterHeader
									products={products}
									onToggleAll={handleToggleAll}
									onRemoveSelected={handleRemoveSelected}
								/>
							)}

							<div className="bl-delivery-section">
								{loading && <p>Ładowanie produktów...</p>}
								{error && <p>{error}</p>}
								{!loading && !error && products.length === 0 && (
									<p>Nie masz żadnych produktów zapisanych na później.</p>
								)}

								{!loading &&
									!error &&
									products.map((item) => (
										<BuyLaterItem
											key={item.id}
											product={item}
											onToggleCheck={() => handleToggleCheck(item.id)}
										/>
									))}
							</div>
						</div>
					</div>

					{/* Okienko po prawej stronie z podsumowaniem */}
					<div className="bl-sidebar">
						<BuyLaterSummary
							checkedCount={checkedProducts.length}
							totalPrice={totalPrice}
							paymentMethod={paymentMethod}
							setPaymentMethod={setPaymentMethod}
							onPay={handlePayment}
						/>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
}

export default BuyLater;
