import { useState } from "react";

import heartIcon from "../../assets/ulubione.webp";
import heartFilledIcon from "../../assets/ulubione-fill.webp";
import cartIcon from "../../assets/cart.webp";

import "./ProductCard.css";

function ProductCard({ product, isOpen, onToggle }) {
	const [isFavorite, setIsFavorite] = useState(false);
	const [favoriteId, setFavoriteId] = useState(null);

	useState(() => {
		async function loadFavorites() {
			try {
				console.log("Ładowanie ulubionych dla produktu:", product.product_id);
				const response = await fetch("http://localhost:8000/favorites", {
					method: "GET",
					headers: {
						token: localStorage.getItem("token"),
						"Access-Control-Allow-Origin": "",
						"Access-Control-Allow-Methods": "",
						"Access-Control-Allow-Headers": "*",
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error("Nie udało się pobrać ulubionych");
				}

				const data = await response.json();

				console.log(data);

				console.log("Znaleziony ulubiony:", data);
				const fav = data.find((f) => f.product_id === product.product_id);
				if (fav) {
					setIsFavorite(true);
					setFavoriteId(fav.favorite_id);
				} else {
					setIsFavorite(false);
					setFavoriteId(null);
				}
				console.log("isFavorite ustawione na:", isFavorite);
			} catch (err) {
				console.error(err);
			}
		}
		loadFavorites();
	}, [product.product_id]);

	async function addCart() {
		const request = await fetch("http://localhost:8000/cart/", {
			method: "POST",
			headers: {
				Token: localStorage.getItem("token"),
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "",
				"Access-Control-Allow-Methods": "",
				"Access-Control-Allow-Headers": "*",
			},
			body: JSON.stringify({ product_id: product.product_id, quantity: 1 }),
		});
		//if (request.ok) alert("Przedmiot dodany do koszyka");
		const body = await request.json();
		console.log(body);
	}

	const toggleFavorite = async () => {
		try {
			if (isFavorite) {
				const response = await fetch("http://localhost:8000/favorites", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						token: localStorage.getItem("token"),
						"Access-Control-Allow-Origin": "",
						"Access-Control-Allow-Methods": "",
						"Access-Control-Allow-Headers": "*",
					},
					body: JSON.stringify({
						favorite_id: favoriteId,
					}),
				});

				if (!response.ok) {
					throw new Error("Błąd usuwania");
				}

				setIsFavorite(false);
				setFavoriteId(null);
			} else {
				const response = await fetch("http://localhost:8000/favorites", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						token: localStorage.getItem("token"),
						"Access-Control-Allow-Origin": "",
						"Access-Control-Allow-Methods": "",
						"Access-Control-Allow-Headers": "*",
					},
					body: JSON.stringify({
						product_id: product.product_id,
						project_id: null,
					}),
				});

				if (!response.ok) {
					throw new Error("Błąd dodawania");
				}

				const data = await response.json();

				setIsFavorite(true);
				setFavoriteId(data.favorite_id);
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<article className={`product-card ${isOpen ? "product-card-open" : ""}`} onClick={onToggle}>
			<img src={product.image_path} alt={product.name} className="product-image" />

			<div className="product-info">
				<h2 className="product-name">{product.name}</h2>

				<span className="product-price">{product.price}zł</span>
			</div>

			<div
				className={`product-actions ${isOpen ? "product-actions-open" : ""}`}
				onClick={(event) => event.stopPropagation()}>
				<button type="button" className="product-icon-button" onClick={toggleFavorite}>
					<img
						src={isFavorite ? heartFilledIcon : heartIcon}
						alt="Ulubione"
						className="product-action-icon"
					/>
				</button>

				<button type="button" className="product-icon-button" onClick={addCart}>
					<img src={cartIcon} alt="Koszyk" className="product-action-icon" />
				</button>
			</div>
		</article>
	);
}

export default ProductCard;
