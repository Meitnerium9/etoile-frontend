import React from "react";

const BuyLaterHeader = ({ products, onToggleAll, onRemoveSelected }) => {
	return (
		<div className="bl-top-bar">
			<label className="bl-star-checkbox">
				<input
					type="checkbox"
					checked={products.length > 0 && products.every((p) => p.checked)}
					onChange={(e) => onToggleAll(e.target.checked)}
				/>
				<span className="bl-star-icon"></span>
				<div className="bl-star-napis">{"Zaznacz całą listę"}</div>
			</label>
			<button className="bl-text-btn" onClick={onRemoveSelected}>
				USUŃ ZAZNACZONE
			</button>
		</div>
	);
};

export default BuyLaterHeader;
