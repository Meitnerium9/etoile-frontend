import React from "react";
import iconSample from "../../assets/Sample.png";

const BuyLaterItem = ({ product, onToggleCheck }) => {
	return (
		<div className="bl-product">
			<label className="bl-star-checkbox">
				<input type="checkbox" checked={product.checked} onChange={onToggleCheck} />
				<span className="bl-star-icon"></span>
			</label>
			<a
				href={product.project_id == null ? "/" : `../blog/${product.project_id}`}
				className="bl-preview-box">
				<img src={iconSample} alt="produkt" />
			</a>
			<div className="bl-product-info">
				<p className="bl-product-name">{product.title}</p>
				<span className="bl-seller-tag">od {product.seller}</span>
				<div className="bl-product-row" style={{ marginTop: "10px" }}>
					<span className="bl-price-big">{product.price} zł</span>
				</div>
			</div>
		</div>
	);
};

export default BuyLaterItem;
