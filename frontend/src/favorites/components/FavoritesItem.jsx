import React from "react";
import iconSample from "../../assets/Sample.png";

const FavoritesItem = ({ product, onToggleCheck }) => {
	return (
		<div className="fav-product">
			<label className="fav-star-checkbox">
				<input type="checkbox" checked={product.checked} onChange={onToggleCheck} />
				<span className="fav-star-icon"></span>
			</label>

			<a href="/" className="fav-preview-box">
				<img src={iconSample} alt="produkt" />
			</a>

			<div className="fav-product-info">
				<p className="fav-product-name">{product.title}</p>
				<span className="fav-seller-tag">od {product.seller}</span>
				<div className="fav-product-row" style={{ marginTop: "10px" }}>
					<span className="fav-price-big">{product.price} zł</span>
					<button
						className="fav-btn-etoile fav-green"
						style={{ width: "auto", padding: "8px 20px", margin: 0 }}>
						DO KOSZYKA
					</button>
				</div>
			</div>
		</div>
	);
};

export default FavoritesItem;
