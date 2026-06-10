import "./ProjectItem.css";
import iconSample from "../../assets/Sample.webp";

export default function ProjectItem({ item }) {
	async function handleDelete() {
		await fetch("http://localhost:8000/projects/" + item.project_id, {
			method: "DELETE",
			headers: {
				Token: localStorage.getItem("token"),
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "",
				"Access-Control-Allow-Methods": "",
				"Access-Control-Allow-Headers": "*",
			},
		});
		location.reload();
	}

	async function addCart() {
		const request = await fetch("http://localhost:8000/cart/", {
			method: "POST",
			headers: {
				Token: localStorage.getItem("token"),
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "",
				"Access-Control-Allow-Methods": "",
				"Access-Control-Allow-Headers": "*",
			},
			body: JSON.stringify({
				project_id: item.project_id,
				image: item.image_path || iconSample,
				quantity: 1,
				product_id: null,
			}),
		});
		if (request.ok) alert("Przedmiot dodany do koszyka");
	}

	return (
		<div className="item">
			<img src={item.image_path || iconSample} />
			<p className="title">{item.name}</p>
			<p className="price">{item.total_price} zł</p>
			<button className="delete" onClick={handleDelete}>
				Usuń
			</button>
			<button className="add" onClick={addCart}>
				Dodaj do koszyka
			</button>
		</div>
	);
}
