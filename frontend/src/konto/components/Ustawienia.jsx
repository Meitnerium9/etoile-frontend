import "./Ustawienia.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../../main.jsx";

export default function Ustawienia() {
	useTitle("Etoile - Panel użytkownika");

	const navigate = useNavigate();
	if (localStorage.getItem("token") == null) navigate("/", { replace: true });

	const [error, setError] = useState("");
	const [data, setData] = useState("");
	const [newData, setNewData] = useState({
		username: null,
		email: null,
		password: null,
		repeatPassword: null,
	});

	function handleChange(event) {
		const { name, value, type, checked } = event.target;

		setNewData({
			...newData,
			[name]: type === "checkbox" ? checked : value,
		});
	}

	async function handleDelete() {
		await fetch("http://localhost:8000/users/", {
			method: "DELETE",
			headers: {
				Token: localStorage.getItem("token"),
			},
		});
		localStorage.removeItem("token");
		location.reload();
	}

	async function handleSubmit() {
		if (newData.password !== newData.repeatPassword) {
			setError("Hasła nie są identyczne.");
			return;
		}
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/;
		if (!passwordRegex.test(newData.password)) {
			setError(
				"Hasło musi mieć 8-20 znaków, małą literę, dużą literę, cyfrę i znak specjalny."
			);
			return;
		}

		await fetch("http://localhost:8000/users/", {
			method: "PATCH",
			headers: {
				Token: localStorage.getItem("token"),
			},
			body: JSON.stringify(newData),
		});
		location.reload();
	}

	useEffect(() => {
		async function fetchData() {
			const response = await fetch("http://localhost:8000/users/", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Token: localStorage.getItem("token"),
				},
			});
			setData(await response.json());
		}
		fetchData();
	}, []);
	if (!data) return <></>;
	return (
		<>
			<div className="infoContainer">
				<section className="info-edit">
					Username:
					<input
						type="text"
						name="username"
						defaultValue={data.username}
						onChange={handleChange}
					/>
					E-mail:
					<input
						type="email"
						name="email"
						defaultValue={data.email}
						onChange={handleChange}
					/>
					Hasło:
					<input
						type="password"
						name="password"
						defaultValue=""
						onChange={handleChange}
					/>
					Potwórz hasło:
					<input
						type="password"
						name="repeatPassword"
						defaultValue=""
						onChange={handleChange}
					/>
					{error && <p className="formError">{error}</p>}
					<button onClick={handleSubmit}>Zapisz zmiany</button>
				</section>
				<section className="info-edit">
					<button className="buttonDelete" onClick={handleDelete}>
						Usuń konto
					</button>
				</section>
			</div>
		</>
	);
}
