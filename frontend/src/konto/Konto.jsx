import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import "./Konto.css";
import Ustawienia from "./components/Ustawienia.jsx";
import ProjectList from "./components/ProjectList.jsx";
import OrderList from "./components/OrderList.jsx";

export default function Konto() {
	if (localStorage.getItem("token") == null) return <Navigate to="/" replace />;

	return (
		<>
			<Navbar />
			<main>
				<nav className="kontoNav">
					<a href="./ustawienia">Ustawienia</a>
					<a href="./projekty">Moje projekty</a>
					<a href="./zamowienia">Moje zamówienia</a>
				</nav>
				<hr />
				<Routes>
					<Route path="/" element={<Navigate to="info" replace />} />
					<Route path="ustawienia" element={<Ustawienia />} />
					<Route path="projekty" element={<ProjectList />} />
					<Route path="zamowienia" element={<OrderList />} />
					<Route path="*" element={<Navigate to="/konto/ustawienia" replace />} />
				</Routes>
			</main>
			<Footer />
		</>
	);
}
