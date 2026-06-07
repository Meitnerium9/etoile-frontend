// components/LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	async function handleLogin(event) {
		event.preventDefault();

		const loginData = {
			email: email,
			password: password,
		};

		try {
			const response = await fetch("http://localhost:8000/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(loginData),
			});

			const result = await response.json();

			if (!response.ok) {
				setError(result.detail || "Nie udało się zalogować.");
				return;
			}

			console.log("Odpowiedź z backendu:", result);
			localStorage.setItem("token", result.access_token);
			navigate("/");

			setMessage("Dane zostały wysłane poprawnie.");

			setEmail("");
			setPassword("");
		} catch (error) {
			console.error("Błąd połączenia z backendem:", error);
			setError("Nie można połączyć się z serwerem.");
		}
	}

	return (
		<div className="loginContainer">
			<h2 className="formTitle">Jesteś już użytkownikiem?</h2>

			<form className="loginForm" onSubmit={handleLogin}>
				<div className="inputGroup">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						required
					/>
				</div>

				<div className="inputGroup">
					<input
						type="password"
						placeholder="Hasło"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						required
					/>
				</div>

				{error && <p className="formError">{error}</p>}

				<button type="submit" className="loginButton">
					Zaloguj się
				</button>
			</form>
		</div>
	);
}

export default LoginForm;
