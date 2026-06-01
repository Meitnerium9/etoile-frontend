import heartIcon from "../../assets/ulubione.png";
import cartIcon from "../../assets/cart.png";

import "./CreatorActions.css";

function CreatorActions({ finishProject, loading }) {
	return (
		<div className="creator-buttons-row">
			<button
				type="button"
				className="creator-cart-button"
				onClick={finishProject}
				disabled={loading}>
				<span className="creator-cart-text">Ukończ projekt</span>
			</button>
		</div>
	);
}

export default CreatorActions;
