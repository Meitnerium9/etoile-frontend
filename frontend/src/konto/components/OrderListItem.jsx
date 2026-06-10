import React from "react";
import iconSample from "../../assets/Sample.webp";

const OrderListItem = ({ product, onToggleCheck }) => {
	return (
		<div className="ol-product">
			<a className="ol-preview-box">
				<img src={product.image || iconSample} alt="produkt" />
			</a>
			<div className="product-info">
				<p>{product.name}</p>
				<p>Od: {product.seller}</p>

				<p>Ilość: {product.quantity}</p>

				<p>{product.price_at_purchase} zł</p>
				<p>Razem: {(product.price_at_purchase * product.quantity).toFixed(2)} zł</p>
			</div>
		</div>
	);
};

export default OrderListItem;
