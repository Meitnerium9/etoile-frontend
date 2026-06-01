import "./Footer.css";
import Contact from "./Contact.jsx";
import "./Contact.css";

function Footer() {
	return (
		<>
			<footer className="footer">
				<div className="footerContent">
					<div className="footerBrand">
						<h3>Étoile</h3>
						<p>Sklep internetowy i blog o stylu, inspiracjach oraz modzie.</p>
					</div>

					<div className="footerLinks">
						<a href="../regulamin.pdf" target="_blank" rel="noopener noreferrer">
							Regulamin
						</a>
						<a
							href="../polityka_prywatnosci.pdf"
							className="cookie-link"
							target="_blank"
							rel="noopener noreferrer">
							Polityka Prywatności
						</a>
						<button command="show-modal" commandfor="contact-dialog">
							Kontakt
						</button>
					</div>
				</div>

				<div className="footerBottom">
					<p>&copy; 2026 Étoile. Wszystkie prawa zastrzeżone.</p>
				</div>
			</footer>
			<Contact />
		</>
	);
}

export default Footer;
