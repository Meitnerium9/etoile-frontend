import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterInfo.css";

function RegisterForm() {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: "",
		firstName: "",
		lastName: "",
		password: "",
		repeatPassword: "",
		acceptedRules: false,
	});

	const [error, setError] = useState("");

	function handleChange(event) {
		const { name, value, type, checked } = event.target;

		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});

		setError("");
	}

	function clearForm() {
		setFormData({
			email: "",
			firstName: "",
			lastName: "",
			password: "",
			repeatPassword: "",
			acceptedRules: false,
		});
	}

	async function handleRegister(event) {
		event.preventDefault();

		if (formData.password !== formData.repeatPassword) {
			setError("Hasła nie są identyczne.");
			return;
		}

		if (!formData.acceptedRules) {
			setError("Musisz zaakceptować regulamin.");
			return;
		}

		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/;

		if (!passwordRegex.test(formData.password)) {
			setError(
				"Hasło musi mieć 8-20 znaków, małą literę, dużą literę, cyfrę i znak specjalny."
			);
			return;
		}

		const registerData = {
			username: `${formData.firstName} ${formData.lastName}`,
			email: formData.email,
			password: formData.password,
		};

		try {
			const response = await fetch("http://localhost:8000/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(registerData),
			});

			const result = await response.json();

			if (!response.ok) {
				setError(result.detail || "Nie udało się utworzyć konta.");
				return;
			}

			console.log("Rejestracja udana:", result);

			const loginData = {
				email: formData.email,
				password: formData.password,
			};

			const responseLogin = await fetch("http://localhost:8000/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(loginData),
			});

			const resultLogin = await responseLogin.json();

			localStorage.setItem("token", resultLogin.access_token);

			clearForm();
			navigate("/");
		} catch (error) {
			console.error("Błąd połączenia:", error);
		}
	}

	return (
		<div className="registerFormContainer">
			<h2 className="formTitle">Rejestracja</h2>

			<form onSubmit={handleRegister}>
				<div className="inputGroup">
					<input
						type="email"
						name="email"
						placeholder="Email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="inputGroup">
					<input
						type="text"
						name="firstName"
						placeholder="Imię"
						value={formData.firstName}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="inputGroup">
					<input
						type="text"
						name="lastName"
						placeholder="Nazwisko"
						value={formData.lastName}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="inputGroup">
					<input
						type="password"
						name="password"
						placeholder="Hasło"
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="inputGroup">
					<input
						type="password"
						name="repeatPassword"
						placeholder="Powtórz hasło"
						value={formData.repeatPassword}
						onChange={handleChange}
						required
					/>
				</div>

				<label className="rulesCheckbox">
					<input
						type="checkbox"
						name="acceptedRules"
						checked={formData.acceptedRules}
						onChange={handleChange}
					/>
					Akceptuję i rozumiem regulamin
				</label>

				{error && <p className="formError">{error}</p>}

				<button type="submit" className="registerButton">
					Załóż konto
				</button>
			</form>
		</div>
	);
}

export default RegisterForm;
