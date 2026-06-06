import React from "react";

const OrderHistoryItem = ({ order }) => {
	return (
		<div className="ol-history-row">
			<div className="ol-history-info">
				<span className="ol-history-number">{order.order_number}</span>
				<span className="ol-history-date">{order.date}</span>
				{order.products && order.products.length > 0 && (
					<p className="ol-history-summary-text">
						{order.products.map((p) => p.title || p.name).join(", ")}
					</p>
				)}
			</div>

			<div className="ol-history-status-container">
				{/* Status płatności z bazy */}
				<span
					className={`ol-badge ${order.is_paid ? "ol-badge-success" : "ol-badge-danger"}`}>
					{order.is_paid ? "Opłacone" : "Nieopłacone"}
				</span>

				{/* Status dostawy z bazy */}
				<span
					className={`ol-badge ${order.is_delivered ? "ol-badge-info" : "ol-badge-warning"}`}>
					{order.is_delivered ? "Dostarczone" : "W drodze / Oczekuje"}
				</span>
			</div>

			<div className="ol-history-price">
				<span>{order.total_price} zł</span>
			</div>
		</div>
	);
};

export default OrderHistoryItem;
