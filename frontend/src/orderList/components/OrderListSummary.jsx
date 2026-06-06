import React from "react";

const BuyLaterSummary = ({ checkedCount, totalPrice, paymentMethod, setPaymentMethod, onPay }) => {
	return (
		<div className="bl-white-card bl-shadow bl-summary-box">
			<h3 className="bl-summary-heading">Podsumowanie płatności</h3>

			<div className="bl-summary-row">
				<span>Wybrane produkty:</span>
				<strong>{checkedCount}</strong>
			</div>

			<div className="bl-payment-method-section">
				<h4>Metoda płatności</h4>
				<label className="bl-payment-radio">
					<input
						type="radio"
						name="payment"
						value="electronic"
						checked={paymentMethod === "electronic"}
						onChange={(e) => setPaymentMethod(e.target.value)}
					/>
					<span>Płatność elektroniczna (Blik/Przelew)</span>
				</label>
			</div>

			<div className="bl-summary-divider"></div>

			<div className="bl-summary-row bl-total">
				<span>Do zapłaty:</span>
				<span className="bl-total-price">{totalPrice} zł</span>
			</div>

			<button
				className="bl-btn-etoile bl-gold-btn"
				disabled={checkedCount === 0}
				onClick={onPay}>
				ZAPŁAĆ
			</button>
		</div>
	);
};

export default BuyLaterSummary;
