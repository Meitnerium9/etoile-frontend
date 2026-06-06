import React from "react";
import iconSample from "../../assets/Sample.png";

const OrderListItem = ({ product, onToggleCheck }) => {
	return (
		<div className="ol-product">
			<a
				href={product.project_id == null ? "/" : `../blog/${product.project_id}`}
				className="ol-preview-box">
				<img src={iconSample} alt="produkt" />
			</a>
			<div className="ol-product-info">
				<p className="ol-product-name">{product.title}</p>
				<div className="ol-product-row" style={{ marginTop: "10px" }}>
					<span className="ol-price-big">{product.price_at_purchase} zł</span>
				</div>
				<p style={{ marginTop: "10px" }}>{product.status}</p>
			</div>
		</div>
	);
};

export default OrderListItem;
