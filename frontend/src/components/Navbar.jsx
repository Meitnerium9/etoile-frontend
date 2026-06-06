import iconLogo from "../assets/logo.png";
import iconAcc from "../assets/account.png";
import iconCart from "../assets/cart.png";
import iconFavourite from "../assets/ulubione.png";
import "./Navbar.css";

function Logout() {
	localStorage.removeItem("token");
	location.reload();
}

export default function Navbar() {
	return (
		<nav className="navbar">
			<a href="/" className="nav-logo">
				<img src={iconLogo} alt="Logo" />
			</a>
			<div>
				<a href="/produkty">Sklep</a>
				<a href="/blog">Blog</a>
				{localStorage.getItem("token") != null && (
					<>
						<a href="/creator">Kreator</a>
						<a
							href="/ulubione"
							className="nav-icon"
							onClick={() => console.log("ulubione")}>
							<img src={iconFavourite} alt="ulubione" className="nav-iconFav-img" />
						</a>
						<a
							href="/koszyk"
							className="nav-icon"
							onClick={() => console.log("koszyk")}>
							<img src={iconCart} alt="koszyk" className="nav-iconCart-img" />
						</a>
						<a href="/konto" className="nav-icon" onClick={() => console.log("konto")}>
							<img src={iconAcc} alt="konto" className="nav-iconAcc-img" />
						</a>
						<button onClick={Logout}>Wyloguj się</button>
					</>
				)}
				{localStorage.getItem("token") == null && <a href="/register">Zaloguj się</a>}
			</div>
		</nav>
	);
}
