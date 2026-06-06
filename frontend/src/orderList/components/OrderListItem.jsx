import React from "react";
import iconSample from "../../assets/Sample.png";

const OrderListItem = ({ product, onToggleCheck }) => {
	return (
		<div className="ol-product">
			<label className="ol-star-checkbox">
				<input type="checkbox" checked={product.checked} onChange={onToggleCheck} />
				<span className="ol-star-icon"></span>
			</label>
			<a
				href={product.project_id == null ? "/" : `../blog/${product.project_id}`}
				className="ol-preview-box">
				<img src={iconSample} alt="produkt" />
			</a>
			<div className="ol-product-info">
				<p className="ol-product-name">{product.title}</p>
				<span className="ol-seller-tag">od {product.seller}</span>
				<div className="ol-product-row" style={{ marginTop: "10px" }}>
					<span className="ol-price-big">{product.price} zł</span>
				</div>
			</div>
		</div>
	);
};

export default OrderListItem;
