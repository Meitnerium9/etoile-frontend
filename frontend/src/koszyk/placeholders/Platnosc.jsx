import "./Platnosc.css";

export default function Platnosc() {
	return (
		<>
			<div class="payment-container">
				<div class="payment-header">
					<h2>Wybierz metodę płatności</h2>
				</div>

				<form class="payment-form">
					<label class="payment-option active">
						<div class="option-left">
							<input type="radio" name="payment_method" value="blik" defaultChecked />
							<div class="option-info">
								<span class="option-title">BLIK</span>
								<span class="option-desc">
									Szybki przelew kodem z aplikacji bankowej
								</span>
							</div>
						</div>
						<span class="badge badge-blik">BLIK</span>
					</label>

					<label class="payment-option">
						<div class="option-left">
							<input type="radio" name="payment_method" value="pbl" />
							<div class="option-info">
								<span class="option-title">Przelew natychmiastowy</span>
								<span class="option-desc">
									PayU / Przelewy24 / iPKO / mTransfer
								</span>
							</div>
						</div>
						<span class="icon-placeholder">🏦</span>
					</label>

					<label class="payment-option">
						<div class="option-left">
							<input type="radio" name="payment_method" value="card" />
							<div class="option-info">
								<span class="option-title">Karta kredytowa / debetowa</span>
								<span class="option-desc">Visa, Mastercard</span>
							</div>
						</div>
						<div class="card-badges">
							<span class="badge badge-visa">VISA</span>
							<span class="badge badge-mc">MC</span>
						</div>
					</label>

					<label class="payment-option">
						<div class="option-left">
							<input type="radio" name="payment_method" value="cod" />
							<div class="option-info">
								<span class="option-title">Płatność przy odbiorze</span>
								<span class="option-desc">Zapłać kurierowi gotówką lub kartą</span>
							</div>
						</div>
						<span class="icon-placeholder">📦</span>
					</label>
				</form>
			</div>
		</>
	);
}
