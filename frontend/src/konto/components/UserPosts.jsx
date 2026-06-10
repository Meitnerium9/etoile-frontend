import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./UserPosts.css";

export default function UserPosts() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [userId, setUserId] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [deleteError, setDeleteError] = useState("");
	const [deleteSuccess, setDeleteSuccess] = useState("");

	const postsPerPage = 5;
	const projectCache = useRef({});
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/konto");
			return;
		}

		async function decodeToken() {
			try {
				const parts = token.split(".");
				if (parts.length !== 3) {
					throw new Error("Invalid token");
				}

				const decoded = JSON.parse(atob(parts[1]));
				setUserId(decoded.sub);
			} catch (err) {
				console.error("Error decoding token:", err);
				setError("Nie udało się pobrać danych użytkownika.");
			}
		}

		decodeToken();
	}, [navigate]);

	useEffect(() => {
		if (!userId) return;

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
					throw new Error("Nie udało się pobrać postów");
				}

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

							if (!res.ok) {
								return post;
							}

							project = await res.json();
							projectCache.current[post.project_id] = project;
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
	}, [currentPage, userId]);

	const handleDeletePost = async (postId) => {
		if (!window.confirm("Czy na pewno chcesz usunąć ten post?")) {
			return;
		}

		try {
			setDeleteError("");
			setDeleteSuccess("");

			const response = await fetch(`http://localhost:8000/posts/${postId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					token: localStorage.getItem("token"),
				},
			});

			if (!response.ok) {
				throw new Error("Nie udało się usunąć posta");
			}

			setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== postId));
			setDeleteSuccess("Post został usunięty");

			setTimeout(() => setDeleteSuccess(""), 3000);
		} catch (err) {
			setDeleteError(err.message);
			setTimeout(() => setDeleteError(""), 3000);
		}
	};

	if (loading) {
		return <p className="user-posts-message">Ładowanie postów...</p>;
	}

	if (error) {
		return <p className="user-posts-error">{error}</p>;
	}

	if (posts.length === 0) {
		return (
			<div className="user-posts-empty-box">
				<h2>Brak postów</h2>
				<p>Nie napisałeś jeszcze żadnych postów.</p>
			</div>
		);
	}

	return (
		<div className="user-posts-container">
			{deleteSuccess && <div className="user-posts-success">{deleteSuccess}</div>}
			{deleteError && <div className="user-posts-error">{deleteError}</div>}

			<div className="user-posts-list">
				{posts.map((post) => (
					<div key={post.post_id} className="user-post-item">
						<div className="user-post-content">
							<img
								src={post.image_path || "/src/blog/images/post1.jpg"}
								alt={post.title}
								className="user-post-image"
							/>

							<div className="user-post-info">
								<h3 className="user-post-title">{post.title}</h3>
								<p className="user-post-description">
									{post.description?.length > 150
										? post.description.slice(0, 150) + "..."
										: post.description}
								</p>
								<Link to={`/blog/${post.post_id}`} className="blog-post-read-more">
									Czytaj dalej...
								</Link>
								<p className="user-post-date">
									{new Date(post.created_at).toLocaleDateString("pl-PL")}
								</p>
							</div>
						</div>

						<button
							onClick={() => handleDeletePost(post.post_id)}
							className="user-post-delete-btn">
							Usuń
						</button>
					</div>
				))}
			</div>

			{totalPages > 1 && (
				<div className="user-posts-pagination">
					<button
						onClick={() => setCurrentPage((prev) => prev - 1)}
						disabled={currentPage === 1}
						className="user-posts-pagination-button">
						← Poprzednia
					</button>

					<span className="user-posts-pagination-info">
						Strona {currentPage} z {totalPages}
					</span>

					<button
						onClick={() => setCurrentPage((prev) => prev + 1)}
						disabled={currentPage === totalPages}
						className="user-posts-pagination-button">
						Następna →
					</button>
				</div>
			)}
		</div>
	);
}
