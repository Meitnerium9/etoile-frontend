import { useEffect, useState } from "react";
import "./OrderList.css";

import OrderListItem from "./OrderListItem.jsx";

import { useTitle } from "../../main.jsx";

function OrderList() {
	const [products, setProducts] = useState([]);
	const [historyOrders, setHistoryOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useTitle("Etoile - Lista zamówień");

	useEffect(() => {
		fetchAllData();
	}, []);

	async function fetchAllData() {
		const token = localStorage.getItem("token");

		if (!token) {
			setError("Musisz być zalogowany, aby zobaczyć swoje zamówienia.");
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError("");

			const response = await fetch("http://localhost:8000/orders/", {
				headers: {
					token: localStorage.getItem("token"),
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "",
					"Access-Control-Allow-Methods": "",
					"Access-Control-Allow-Headers": "*",
				},
			});

			if (!response.ok) {
				throw new Error("Nie udało się pobrać danych z bazy.");
			}

			const data = await response.json();
			let orders = [];
			for (const order of data) {
				console.log("http://localhost:8000/orderitems/" + order.order_id);
				const res = await fetch("http://localhost:8000/orderitems/" + order.order_id, {
					headers: {
						token: localStorage.getItem("token"),
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "",
						"Access-Control-Allow-Methods": "",
						"Access-Control-Allow-Headers": "*",
					},
				});
				const d = await res.json();
				for (const e of d) {
					e.status = order.status;
				}
				orders = orders.concat(d);
			}
			setProducts(orders);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	const handleToggleCheck = (id) => {
		setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p)));
	};

	const handleToggleAll = (isChecked) => {
		setProducts((prev) => prev.map((p) => ({ ...p, checked: isChecked })));
	};

	const handleRemoveSelected = async () => {
		const token = localStorage.getItem("token");
		if (!token) return alert("Musisz być zalogowany.");

		const selected = products.filter((p) => p.checked);
		if (selected.length === 0) return;

		try {
			await Promise.all(
				selected.map((item) =>
					fetch(`http://localhost:8000/orderlist/`, {
						method: "DELETE",
						headers: {
							token: localStorage.getItem("token"),
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							orderlist_id: item.id,
						}),
					})
				)
			);
			await fetchAllData();
		} catch (err) {
			alert("Nie udało się usunąć zaznaczonych pozycji.");
		}
	};

	return (
		<div className="ol-page-container">
			<div className="ol-layout">
				<div className="ol-main">
					{/* SEKCJA 1: Bieżąca lista zamówień */}
					<h1 className="ol-heading">Lista zamówień</h1>
					<div className="ol-white-card ol-shadow">
						<div className="ol-delivery-section">
							{loading && <p>Ładowanie listy...</p>}
							{error && <p>{error}</p>}
							{!loading && !error && products.length === 0 && (
								<p>Nie masz obecnie żadnych otwartych pozycji na liście.</p>
							)}

							{!loading &&
								!error &&
								products.map((item) => (
									<OrderListItem
										key={item.id}
										product={item}
										onToggleCheck={() => handleToggleCheck(item.id)}
									/>
								))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default OrderList;
