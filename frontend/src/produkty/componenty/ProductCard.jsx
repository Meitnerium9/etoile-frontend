import { useState } from "react";

import heartIcon from "../../assets/ulubione.png";
import heartFilledIcon from "../../assets/ulubione-fill.png";
import cartIcon from "../../assets/cart.png";

import "./ProductCard.css";

function ProductCard({ product, isOpen, onToggle }) {
	const [isFavorite, setIsFavorite] = useState(false);

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
			body: JSON.stringify({ product_id: product.id, quantity: 1 }),
		});
		if (request.ok) alert("Przedmiot dodany do koszyka");
	}

	async function addFavorite() {
		const request = await fetch("http://localhost:8000/favorites/", {
			method: "POST",
			headers: {
				Token: localStorage.getItem("token"),
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "",
				"Access-Control-Allow-Methods": "",
				"Access-Control-Allow-Headers": "*",
			},
			body: JSON.stringify({ product_id: product.id }),
		});
		setIsFavorite((current) => !current);
		if (request.ok) alert("Przedmiot dodany do ulubionych");
	}

	return (
		<article className={`product-card ${isOpen ? "product-card-open" : ""}`} onClick={onToggle}>
			<img
				src={"src/assets/" + product.image_path}
				alt={product.name}
				className="product-image"
			/>

			<div className="product-info">
				<h2 className="product-name">{product.name}</h2>

				<span className="product-price">{product.price}</span>
			</div>

			<div
				className={`product-actions ${isOpen ? "product-actions-open" : ""}`}
				onClick={(event) => event.stopPropagation()}>
				<button type="button" className="product-icon-button" onClick={addFavorite}>
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
