import React from "react";
import iconSample from "../../assets/Sample.png";

const FavoritesSuggestions = ({ product }) => {
	return (
		<div className="fav-upsell-box fav-shadow">
			<a href="/" className="fav-upsell-img">
				<img src={iconSample} alt="produkt" />
			</a>
			<p className="fav-price-mid">{product.price} zł</p>
			<p className="fav-upsell-text">{product.title}</p>
			<button className="fav-add-btn">DO KOSZYKA</button>
		</div>
	);
};

export default FavoritesSuggestions;
