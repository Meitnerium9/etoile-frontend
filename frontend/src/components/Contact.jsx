export default function Contact() {
	return (
		<dialog id="contact-dialog">
			<div className="close">
				<button commandfor="contact-dialog" command="close">
					&#x2715;
				</button>
			</div>
			<div className="cont">
				<span>E-mail:</span>
				<p>
					Email:
					<a href="mailto:etoile@shop.com"> etoile@shop.com</a>
				</p>
			</div>
			<div className="cont">
				<span>Telefon:</span>
				<p>
					Telefon:
					<a href="tel:+48123456789"> 123456789</a>
				</p>
			</div>
		</dialog>
	);
}
