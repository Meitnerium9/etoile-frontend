import React from "react";

const OrderListHeader = ({ products, onToggleAll, onRemoveSelected }) => {
	return (
		<div className="ol-top-bar">
			<label className="ol-star-checkbox">
				<input
					type="checkbox"
					checked={products.length > 0 && products.every((p) => p.checked)}
					onChange={(e) => onToggleAll(e.target.checked)}
				/>
				<span className="ol-star-icon"></span>
				<div className="ol-star-napis">{"Zaznacz całą listę"}</div>
			</label>
			<button className="ol-text-btn" onClick={onRemoveSelected}>
				USUŃ ZAZNACZONE
			</button>
		</div>
	);
};

export default OrderListHeader;
