import { useRef, useState, useEffect } from "react";
import "./Koszyk.css";
import iconSample from "../assets/Sample.png";
import iconProt from "../assets/Elogo.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTitle } from "../main.jsx";
import Platnosc from "./placeholders/Platnosc.jsx";
import Dostawa from "./placeholders/Dostawa.jsx";
import { Navigate } from "react-router-dom";

const CartItem = ({ title, price }) => (
	<div className="item">
		<div className="placeholder-img" />
		<div className="item-info">
			<p>{title}</p>
			<span className="price">{price} zł</span>
		</div>
	</div>
);

const Suggestion = ({ price, name }) => (
	<div className="suggested-item">
		<div className="placeholder-img small" />
		<p className="price">{price} zł</p>
		<p className="small-text">{name}</p>
	</div>
);

const ElementKoszyka = ({ produkt, naPlus, naMinus, onToggleCheck }) => (
	<div className="cart-product">
		<label className="star-checkbox">
			<input type="checkbox" checked={produkt.checked} onChange={onToggleCheck} />
			<span className="star-icon"></span>
		</label>
		<a href="/" className="cart-koszyk">
			<img src={iconSample} alt="koszyk" />
		</a>
		<div className="product-info">
			<p className="product-name">{produkt.nazwa}</p>
			<div className="product-row">
				{/* LICZNIK - Twoja struktura 1:1 */}
				<div className="qty-picker">
					<button onClick={naMinus} type="button">
						-
					</button>
					<input type="text" value={produkt.ilosc} readOnly />
					<button onClick={naPlus} type="button">
						+
					</button>
				</div>
				<span className="price-big">{produkt.cena * produkt.ilosc} zł</span>
			</div>
		</div>
	</div>
);

/* Komponetny polecanych */
const ElementListy = ({ product, onAdd }) => (
	<div className="upsell-box shadow">
		<a href="/" className="upsell-img">
			<img src={iconSample} alt="produkt" />
		</a>
		<p className="price-mid">{product.price} zł</p>
		<p className="upsell-text">{product.title}</p>
		<button className="add-btn" onClick={() => onAdd(product)}>
			DO KOSZYKA
		</button>
	</div>
);

function App() {
	if (localStorage.getItem("token") == null) return <Navigate to="/" replace />;
	// Stan dla licznika sztuk
	const [produktyWKoszyku, setProduktyWKoszyku] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const [kosztDostawy, setKosztDostawy] = useState(12.99);

	useTitle("Etoile - Koszyk");

	useEffect(() => {
		loadCart();
	}, []);

	const loadCart = async () => {
		const token = localStorage.getItem("token");

		if (!token) {
			setError("Musisz być zalogowany");
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError("");

			const res = await fetch("http://localhost:8000/cart/", {
				headers: {
					"Content-Type": "application/json",
					Token: localStorage.getItem("token"),
					"Access-Control-Allow-Origin": "",
					"Access-Control-Allow-Methods": "",
					"Access-Control-Allow-Headers": "*",
				},
			});

			const data = await res.json();

			setProduktyWKoszyku(
				data
					.map((item) => ({
						id: item.cart_item_id,
						product_id: item.product_id,
						ilosc: item.quantity,
						cena: item.price,
						nazwa: item.name,
						zdjecie: item.image,
						checked: false,
					}))
					.sort((a, b) => a.id - b.id)
			);
		} catch (err) {
			setError("Błąd pobierania koszyka");
		} finally {
			setLoading(false);
		}
	};

	// ================= PATCH + =================
	const increment = async (id) => {
		const item = produktyWKoszyku.find((p) => p.id === id);
		if (!item) return;

		await fetch("http://localhost:8000/cart/", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "",
				"Access-Control-Allow-Methods": "",
				"Access-Control-Allow-Headers": "*",
			},
			body: JSON.stringify({
				cart_item_id: id,
				quantity: item.ilosc + 1,
			}),
		});

		loadCart();
	};

	// ================= PATCH - =================
	const decrement = async (id) => {
		const item = produktyWKoszyku.find((p) => p.id === id);
		if (!item || item.ilosc <= 1) return;

		await fetch("http://localhost:8000/cart/", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "",
				"Access-Control-Allow-Methods": "",
				"Access-Control-Allow-Headers": "*",
			},
			body: JSON.stringify({
				cart_item_id: id,
				quantity: item.ilosc - 1,
			}),
		});

		loadCart();
	};

	// ================= DELETE =================
	const removeSelected = async () => {
		const selected = produktyWKoszyku.filter((p) => p.checked);

		await Promise.all(
			selected.map((item) =>
				fetch("http://localhost:8000/cart/", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "",
						"Access-Control-Allow-Methods": "",
						"Access-Control-Allow-Headers": "*",
					},
					body: JSON.stringify({
						cart_item_id: item.id,
					}),
				})
			)
		);

		loadCart();
	};

	const addToCart = async (item) => {
		const token = localStorage.getItem("token");

		const payload = {
			product_id: item.product_id,
			project_id: item.project_id,
			quantity: 1,
		};

		console.log("➡️ ADD ONE ITEM:", payload);

		const res = await fetch("http://localhost:8000/cart/", {
			method: "POST",
			headers: {
				Token: localStorage.getItem("token"),
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "",
				"Access-Control-Allow-Methods": "",
				"Access-Control-Allow-Headers": "*",
			},
			body: JSON.stringify(payload),
		});

		console.log("STATUS:", res.status);
		loadCart();
	};

	// ================= CHECKBOX =================
	const toggleCheck = (id) => {
		setProduktyWKoszyku((prev) =>
			prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p))
		);
	};

	const suggestedProducts = [
		{ id: 1, price: "5000", title: "NASZYJNIK KONICZYNA 40 PLATYNA" },
		{ id: 2, price: "6600", title: "BRANSOLETKA KRZYŻ 20 CM ŻÓŁTE ZŁOTO" },
		{ id: 3, price: "2700", title: "NASZYJNIK GWIAZDKA 30 CM SREBRO" },
		{ id: 4, price: "8000", title: "NASZYJNIK SERCE 45 CM RÓŻOWE ZŁOTO" },
	];

	const sumaProduktow = produktyWKoszyku.reduce(
		(acc, curr) => acc + Number(curr.cena) * curr.ilosc,
		0
	);

	const handleKosztDostawy = (element) => {
		setKosztDostawy(element);
	};

	const handleAddSelectedToCart = async () => {
		try {
			await fetch("http://localhost:8000/orders/", {
				method: "POST",
				headers: {
					Token: localStorage.getItem("token"),
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "",
					"Access-Control-Allow-Methods": "",
					"Access-Control-Allow-Headers": "*",
				},
			});
		} catch (err) {
			console.error("❌ ERROR:", err);
			alert("Nie udało się dodać zaznaczonych do koszyka.");
		}
	};

	useTitle("Etoile - Koszyk");
	return (
		<div className="app-container">
			<Navbar />
			<div className="cart-page-container">
				<div className="cart-layout">
					{/* LEWA STRONA: KOSZYK I PROPOZYCJE */}
					<div className="cart-main">
						<h1 className="cart-heading">Koszyk</h1>
						<div className="white-card shadow">
							<div className="cart-top-bar">
								<label className="star-checkbox">
									<input
										type="checkbox"
										// Checkbox jest zaznaczony tylko wtedy, gdy w koszyku są produkty i WSZYSTKIE mają checked: true
										checked={
											produktyWKoszyku.length > 0 &&
											produktyWKoszyku.every((p) => p.checked)
										}
										// Funkcja zmieniająca stan wszystkich produktów na raz
										onChange={(e) => {
											const isChecked = e.target.checked;
											setProduktyWKoszyku((prev) =>
												prev.map((p) => ({
													...p,
													checked: isChecked,
												}))
											);
										}}
									/>
									<span className="star-icon"></span>
									<div className="star-napis">{"cały koszyk"}</div>
								</label>
								<button className="text-btn" onClick={removeSelected}>
									USUŃ ZAZNACZONE
								</button>
							</div>

							<div className="delivery-section">
								{/* 3. GENEROWANIE PRODUKTÓW Z LICZNIKAMI */}
								{produktyWKoszyku.map((item) => (
									<ElementKoszyka
										key={item.id}
										produkt={item}
										naPlus={() => increment(item.id)}
										naMinus={() => decrement(item.id)}
										onToggleCheck={() => toggleCheck(item.id)}
									/>
								))}
							</div>
						</div>

						<Dostawa outRef={handleKosztDostawy} />

						<h2 className="upsell-heading">Dorzuć do przesyłki!</h2>
						<div className="upsell-grid">
							{/* GENEROWANIE LISTY: Mapujemy tablicę na komponenty */}
							{suggestedProducts.map((item) => (
								<ElementListy key={item.id} product={item} onAdd={addToCart} />
							))}
						</div>
					</div>

					{/* PRAWA STRONA: PODSUMOWANIE */}
					<div className="cart-sidebar">
						<div className="white-card shadow summary-box">
							<div className="summary-line">
								<span>Wartość produktów</span>
								<span>{sumaProduktow} zł</span>
							</div>

							<div className="summary-line">
								<span>Dostawa od</span>
								{/* Wyświetlamy z przecinkiem dla użytkownika jako tekst */}
								<span>
									{produktyWKoszyku.length == 0 ? "0 zł" : `${kosztDostawy} zł`}
								</span>
							</div>

							<hr className="divider-line" />

							<Platnosc />

							<div className="summary-line total-line">
								<span>Do zapłaty</span>
								<span className="final-price">
									{/* Dodajemy sumę produktów i koszt dostawy */}
									{produktyWKoszyku.length == 0
										? "0"
										: (sumaProduktow + kosztDostawy)
												.toFixed(2)
												.replace(".", ",")}{" "}
									zł
								</span>
							</div>

							<button className="btn-etoile blue" onClick={handleAddSelectedToCart}>
								ZAPŁAĆ
							</button>
							<a className="btn-etoile transparent" href="..">
								KONTYNUUJ ZAKUPY
							</a>
						</div>

						<div className="white-card shadow protection-box">
							<a href="/" className="protection-img">
								<img src={iconProt} alt="Ochrona" />
							</a>
							<div className="protection-text">
								<strong>Étoile Ochrona Kupujących</strong>
								<p>Wygodne zwroty, reklamacje online oraz 2 lata ochrony zakupu.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default App;
