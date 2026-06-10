import "./ProjectItem.css";
import iconSample from "../../assets/Sample.webp";

export default function ProjectItem({ item, selectedProject, onSelectProject }) {
	async function handleDelete() {
		await fetch("http://localhost:8000/projects/" + item.project_id, {
			method: "DELETE",
			headers: {
				Token: localStorage.getItem("token"),
				"Content-Type": "application/json",
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
			},
			body: JSON.stringify({
				project_id: item.project_id,
				quantity: 1,
				product_id: null,
			}),
		});

		if (request.ok) {
			alert("Przedmiot dodany do koszyka");
		}
	}

	return (
		<div className={selectedProject === item.project_id ? "item item-selected" : "item"}>
			<label className="project-radio">
				<input
					type="radio"
					name="selectedProject"
					value={item.project_id}
					checked={selectedProject === item.project_id}
					onChange={() => onSelectProject(item)}
				/>

				<span>Wybierz</span>
			</label>

			<img src={item.image_path || iconSample} alt={item.name} />

			<p className="title">{item.name}</p>

			<p className="price">{item.total_price} zł</p>
		</div>
	);
}
