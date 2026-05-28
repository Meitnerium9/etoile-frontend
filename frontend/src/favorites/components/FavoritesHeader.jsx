import React from "react";

const FavoritesHeader = ({ products, onToggleAll, onRemoveSelected }) => {
	return (
		<div className="fav-top-bar">
			<label className="fav-star-checkbox">
				<input
					type="checkbox"
					checked={products.length > 0 && products.every((p) => p.checked)}
					onChange={(e) => onToggleAll(e.target.checked)}
				/>
				<span className="fav-star-icon"></span>
				<div className="fav-star-napis">{"cała lista"}</div>
			</label>
			<button className="fav-text-btn" onClick={onRemoveSelected}>
				USUŃ ZAZNACZONE
			</button>
		</div>
	);
};

export default FavoritesHeader;
