import "./ProjectList.css";
import { useEffect, useState } from "react";
import ProjectItem from "./ProjectItem.jsx";

export default function ProjectList({ selectedProjectId, onSelectProject }) {
	const [data, setData] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const response = await fetch("http://localhost:8000/projects/", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Token: localStorage.getItem("token"),
				},
			});

			const result = await response.json();
			setData(result);
		}

		fetchData();
	}, []);

	return (
		<div className="container">
			{data.map((item) => (
				<ProjectItem
					key={item.project_id}
					item={item}
					selectedProjectId={selectedProjectId}
					onSelectProject={onSelectProject}
				/>
			))}
		</div>
	);
}
