import "../App.css";
import { useEffect, useState } from "react";
import "./OrderList.css";

import OrderListHeader from "./components/OrderListHeader.jsx";
import OrderListItem from "./components/OrderListItem.jsx";
import OrderHistoryItem from "./components/OrderHistoryItem.jsx";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useTitle } from "../main.jsx";

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

			// 1. Pobieranie bieżącej listy zamówień/produktów
			const responseCurrent = await fetch("http://localhost:8000/orderlist/", {
				headers: {
					token: localStorage.getItem("token"),
					"Content-Type": "application/json",
				},
			});

			// 2. Pobieranie historii zamówień wraz ze statusami (opłacone, dostarczone)
			const responseHistory = await fetch("http://localhost:8000/orderlist/history/", {
				headers: {
					token: localStorage.getItem("token"),
					"Content-Type": "application/json",
				},
			});

			if (!responseCurrent.ok || !responseHistory.ok) {
				throw new Error("Nie udało się pobrać danych z bazy.");
			}

			const currentData = await responseCurrent.json();
			const historyData = await responseHistory.json();

			// Formatowanie bieżących produktów
			const formattedCurrent = currentData.map((item) => ({
				...item,
				id: item.orderlist_id || item.id,
				product_id: item.product_id,
				project_id: item.project_id,
				checked: true,
				title: item.title || `Produkt #${item.id}`,
				price: item.price || 0,
				seller: item.seller || "Etoile_Jewelry",
			}));

			// Mapowanie historii z bazy danych (płatność i dostawa)
			const formattedHistory = historyData.map((order) => ({
				id: order.order_id || order.id,
				order_number: order.order_number || `ZA-${order.id}`,
				date: order.created_at || order.date || "Brak daty",
				total_price: order.total_price || 0,
				is_paid: order.is_paid ?? false,
				is_delivered: order.is_delivered ?? false,
				products: order.products || [], // lista produktów w danym zamówieniu historycznym
			}));

			setProducts(formattedCurrent);
			setHistoryOrders(formattedHistory);
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
		<div className="app-container">
			<Navbar />

			<div className="ol-page-container">
				<div className="ol-layout">
					<div className="ol-main">
						{/* SEKCJA 1: Bieżąca lista zamówień */}
						<h1 className="ol-heading">Lista zamówień</h1>
						<div className="ol-white-card ol-shadow">
							{products.length > 0 && (
								<OrderListHeader
									products={products}
									onToggleAll={handleToggleAll}
									onRemoveSelected={handleRemoveSelected}
								/>
							)}

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

						{/* SEKCJA 2: Historia zamówień ze statusami z bazy */}
						<h2 className="ol-subheading">Historia zamówień</h2>
						<div className="ol-white-card ol-shadow">
							<div className="ol-history-section">
								{loading && <p>Ładowanie historii...</p>}
								{!loading && historyOrders.length === 0 && (
									<p>Brak zamówień w historii.</p>
								)}
								{!loading &&
									historyOrders.map((order) => (
										<OrderHistoryItem key={order.id} order={order} />
									))}
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
}

export default OrderList;
