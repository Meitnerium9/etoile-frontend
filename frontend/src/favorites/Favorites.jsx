import "../App.css";
import { useEffect, useState } from "react";
import "./Favorites.css";

import FavoritesHeader from "./components/FavoritesHeader.jsx";
import FavoritesItem from "./components/FavoritesItem.jsx";
import FavoritesSuggestions from "./components/FavoritesSuggestions.jsx";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer";
import { useTitle } from "../main.jsx";
import { Navigate } from "react-router-dom";

function Favorites() {
	if (localStorage.getItem("token") == null) return <Navigate to="/" replace />;
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const suggestedProducts = [
		{ id: 101, title: "NASZYJNIK KONICZYNA 40 PLATYNA", price: 5000 },
		{ id: 102, title: "BRANSOLETKA KRZYŻ 20 CM ŻÓŁTE ZŁOTO", price: 6600 },
		{ id: 103, title: "NASZYJNIK GWIAZDKA 30 CM SREBRO", price: 2700 },
		{ id: 104, title: "NASZYJNIK SERCE 45 CM RÓŻOWE ZŁOTO", price: 8000 },
	];

	useTitle("Etoile - Ulubione");

	useEffect(() => {
		fetchFavorites();
	}, []);

	async function fetchFavorites() {
		const token = localStorage.getItem("token");

		if (!token) {
			setError("Musisz być zalogowany, aby zobaczyć ulubione.");
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError("");

			const response = await fetch("http://localhost:8000/favorites/", {
				headers: {
					token: localStorage.getItem("token"),
					"Access-Control-Allow-Origin": "",
					"Access-Control-Allow-Methods": "",
					"Access-Control-Allow-Headers": "*",
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Nie udało się pobrać ulubionych.");
			}

			const data = await response.json();

			const favorites = data.map((item) => ({
				...item,
				id: item.favorite_id,
				product_id: item.product_id,
				project_id: item.project_id,
				checked: true,
				title: item.title || `Ulubiony element #${item.favorite_id}`,
				price: item.price || 0,
				seller: item.seller || "Etoile_Jewelry",
			}));

			console.log(favorites);

			setProducts(favorites);
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

		if (!token) {
			alert("Musisz być zalogowany.");
			return;
		}

		const selected = products.filter((p) => p.checked);

		if (selected.length === 0) {
			return;
		}

		try {
			await Promise.all(
				selected.map((item) =>
					fetch(`http://localhost:8000/favorites/`, {
						method: "DELETE",
						headers: {
							token: localStorage.getItem("token"),
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "",
							"Access-Control-Allow-Methods": "",
							"Access-Control-Allow-Headers": "*",
						},
						body: JSON.stringify({
							favorite_id: item.favorite_id,
						}),
					})
				)
			);
			await fetchFavorites();
			//setProducts((prev) => prev.filter((p) => !p.checked));
		} catch (err) {
			alert("Nie udało się usunąć zaznaczonych ulubionych.");
		}
	};

	const handleAddSelectedToCart = async () => {
		const token = localStorage.getItem("token");

		if (!token) {
			alert("Musisz być zalogowany.");
			return;
		}

		const selected = products.filter((p) => p.checked);

		if (selected.length === 0) return;

		try {
			const results = await Promise.all(
				selected.map(async (item) => {
					const payload = {
						product_id: item.product_id,
						project_id: item.project_id,
						quantity: 1,
					};

					console.log("➡️ REQUEST:", payload);

					const res = await fetch("http://localhost:8000/cart/", {
						method: "POST",
						headers: {
							Token: localStorage.getItem("token"),
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "",
							"Access-Control-Allow-Methods": "",
							"Access-Control-Allow-Headers": "*",
						},
						body: JSON.stringify(payload),
					});

					console.log("⬅️ STATUS:", res.status);

					const text = await res.text(); // 🔥 ważne (nie json na start)
					console.log("⬅️ RESPONSE:", text);

					if (!res.ok) {
						throw new Error(text);
					}

					return text;
				})
			);

			console.log("✅ ALL DONE:", results);
		} catch (err) {
			console.error("❌ ERROR:", err);
			alert("Nie udało się dodać zaznaczonych do koszyka.");
		}
	};

	const handleAddToCart = async (item) => {
		const token = localStorage.getItem("token");

		const payload = {
			product_id: item.product_id,
			project_id: item.project_id,
			quantity: 1,
		};

		console.log("➡️ ADD ONE ITEM:", payload);

		const res = await fetch("http://localhost:8000/cart/", {
			method: "POST",
			headers: {
				Token: localStorage.getItem("token"),
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "",
				"Access-Control-Allow-Methods": "",
				"Access-Control-Allow-Headers": "*",
			},
			body: JSON.stringify(payload),
		});

		console.log("STATUS:", res.status);
	};

	const checkedCount = products.filter((p) => p.checked).length;

	return (
		<div className="app-container">
			<Navbar />

			<div className="fav-page-container">
				<div className="fav-layout">
					<div className="fav-main">
						<h1 className="fav-heading">Ulubione</h1>

						<div className="fav-white-card fav-shadow">
							{checkedCount > 0 && (
								<FavoritesHeader
									products={products}
									onToggleAll={handleToggleAll}
									onRemoveSelected={handleRemoveSelected}
								/>
							)}

							<div className="fav-delivery-section">
								{loading && <p>Ładowanie ulubionych...</p>}

								{error && <p>{error}</p>}

								{!loading && !error && products.length === 0 && (
									<p>Nie masz jeszcze żadnych ulubionych.</p>
								)}

								{!loading &&
									!error &&
									products.map((item) => (
										<FavoritesItem
											key={item.id}
											product={item}
											onToggleCheck={() => handleToggleCheck(item.id)}
											onAddToCart={() => handleAddToCart(item)}
										/>
									))}
							</div>

							{checkedCount > 0 && (
								<div className="fav-bottom-bar">
									<span className="fav-bottom-count">
										Zaznaczono: <strong>{checkedCount}</strong>{" "}
										{checkedCount === 1
											? "produkt"
											: checkedCount < 5
												? "produkty"
												: "produktów"}
									</span>

									<button
										className="fav-btn-etoile fav-navy"
										onClick={handleAddSelectedToCart}>
										DODAJ ZAZNACZONE DO KOSZYKA
									</button>
								</div>
							)}
						</div>

						<h2 className="fav-upsell-heading">Zainspirowane Twoimi ulubionymi</h2>

						<div className="fav-upsell-grid">
							{suggestedProducts.map((item) => (
								<FavoritesSuggestions key={item.id} product={item} />
							))}
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
}

export default Favorites;
