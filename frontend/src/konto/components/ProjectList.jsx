import "./ProjectList.css";
import { useEffect, useState } from "react";
import ProjectItem from "./ProjectItem.jsx";

export default function ProjectList() {
	const [data, setData] = useState([]);

	// PAGINACJA
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 6;

	useEffect(() => {
		async function fetchData() {
			const response = await fetch("http://localhost:8000/projects/", {
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

	// pagination logic
	const indexOfLast = currentPage * itemsPerPage;
	const indexOfFirst = indexOfLast - itemsPerPage;
	const currentItems = data.slice(indexOfFirst, indexOfLast);
	const totalPages = Math.ceil(data.length / itemsPerPage);

	return (
		<div className="projects-page">
			<div className="projects-content">
				<h1 className="ol-heading">Lista projektów</h1>

				<div className="projects-list">
					{currentItems.map((item) => (
						<div key={item.project_id} className="projects-card ol-shadow">
							<ProjectItem item={item} />
						</div>
					))}
				</div>
			</div>

			{totalPages > 1 && (
				<div className="projects-pagination">
					<button
						className="projects-pagination-button"
						onClick={() => setCurrentPage((p) => p - 1)}
						disabled={currentPage === 1}>
						← Poprzednia
					</button>

					<span className="projects-pagination-info">
						Strona {currentPage} z {totalPages}
					</span>

					<button
						className="projects-pagination-button"
						onClick={() => setCurrentPage((p) => p + 1)}
						disabled={currentPage === totalPages}>
						Następna →
					</button>
				</div>
			)}
		</div>
	);
}
