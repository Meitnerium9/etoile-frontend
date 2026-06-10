import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import BlogPostCard from "./BlogPostCard";
import "./UserPostsView.css";

export default function UserPostsView() {
	const { userId } = useParams();
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [userName, setUserName] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const postsPerPage = 5;
	const projectCache = useRef({});

	useEffect(() => {
		async function fetchUserPosts() {
			try {
				setLoading(true);
				setError("");

				const response = await fetch(
					`http://localhost:8000/posts/user/${userId}?page=${currentPage}&limit=${postsPerPage}`,
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (!response.ok) {
					throw new Error("Nie udało się pobrać postów użytkownika");
				}

				const data = await response.json();
				const postsArray = data.posts || [];

				if (postsArray.length === 0 && currentPage === 1) {
					setUserName("Użytkownik");
				}

				const enriched = await Promise.all(
					postsArray.map(async (post) => {
						let project;

						if (projectCache.current[post.project_id]) {
							project = projectCache.current[post.project_id];
						} else {
							const res = await fetch(
								`http://localhost:8000/projects/${post.project_id}`
							);

							if (!res.ok) {
								return post;
							}

							project = await res.json();
							projectCache.current[post.project_id] = project;

							if (!userName && project.username) {
								setUserName(project.username);
							}
						}

						return {
							...post,
							author: project.username || "Brak autora",
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

		fetchUserPosts();
	}, [currentPage, userId, userName]);

	if (loading) {
		return <p className="user-posts-view-message">Ładowanie postów...</p>;
	}

	if (error) {
		return (
			<div className="user-posts-view-error">
				<p>{error}</p>
				<Link to="/blog">Wróć do bloga</Link>
			</div>
		);
	}

	if (posts.length === 0) {
		return (
			<div className="user-posts-view-empty">
				<h2>Brak postów od {userName}</h2>
				<p>Użytkownik {userName} nie napisał jeszcze żadnych postów.</p>
				<Link to="/blog">Wróć do bloga</Link>
			</div>
		);
	}

	return (
		<div className="user-posts-view-container">
			<div className="user-posts-view-header">
				<Link to="/blog" className="user-posts-view-back">
					← Wróć do bloga
				</Link>
				<h1>Posty użytkownika: {userName}</h1>
			</div>

			<div className="user-posts-view-list">
				{posts.map((post) => (
					<BlogPostCard key={post.post_id} post={post} />
				))}
			</div>

			{totalPages > 1 && (
				<div className="user-posts-view-pagination">
					<button
						onClick={() => setCurrentPage((prev) => prev - 1)}
						disabled={currentPage === 1}
						className="user-posts-view-pagination-button">
						← Poprzednia
					</button>

					<span className="user-posts-view-pagination-info">
						Strona {currentPage} z {totalPages}
					</span>

					<button
						onClick={() => setCurrentPage((prev) => prev + 1)}
						disabled={currentPage === totalPages}
						className="user-posts-view-pagination-button">
						Następna →
					</button>
				</div>
			)}
		</div>
	);
}
