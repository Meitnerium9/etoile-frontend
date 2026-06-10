import { useEffect, useState, useRef } from "react";
import BlogPostCard from "./BlogPostCard";

export default function BlogPostList() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const postsPerPage = 5;

	// cache projektów
	const projectCache = useRef({});

	useEffect(() => {
		async function fetchPosts() {
			try {
				setLoading(true);
				setError("");

				const response = await fetch(
					`http://localhost:8000/posts/?page=${currentPage}&limit=${postsPerPage}`,
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				const data = await response.json();
				const postsArray = data.posts || [];

				const enriched = await Promise.all(
					postsArray.map(async (post) => {
						let project;

						if (projectCache.current[post.project_id]) {
							project = projectCache.current[post.project_id];
						} else {
							const res = await fetch(
								`http://localhost:8000/projects/${post.project_id}`
							);

							project = await res.json();
							projectCache.current[post.project_id] = project;
						}

						return {
							...post,
							author: project.username,
						};
					})
				);

				setPosts(enriched);
				setTotalPages(data.pagination?.total_pages || 1);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		fetchPosts();
	}, [currentPage]);

	if (loading) {
		return <p className="blog-empty-message">Ładowanie postów...</p>;
	}

	if (error) {
		return <p className="blog-empty-message">{error}</p>;
	}

	if (posts.length === 0) {
		return (
			<div className="blog-empty-box">
				<h2>Brak postów</h2>
				<p>W bazie danych nie ma jeszcze żadnych wpisów blogowych.</p>
			</div>
		);
	}

	return (
		<>
			{/* POSTY */}
			{posts.map((post) => (
				<BlogPostCard key={post.post_id} post={post} />
			))}

			{/* PAGINACJA — NIC NIE ZMIENIONE */}
			{totalPages > 1 && (
				<div className="blog-pagination">
					<button
						onClick={() => setCurrentPage((prev) => prev - 1)}
						disabled={currentPage === 1}
						className="blog-pagination-button">
						← Poprzednia
					</button>

					<span className="blog-pagination-info">
						Strona {currentPage} z {totalPages}
					</span>

					<button
						onClick={() => setCurrentPage((prev) => prev + 1)}
						disabled={currentPage === totalPages}
						className="blog-pagination-button">
						Następna →
					</button>
				</div>
			)}
		</>
	);
}
