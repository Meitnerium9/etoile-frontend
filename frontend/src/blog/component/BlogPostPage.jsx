import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import defaultPostImage from "../images/post1.jpg";
import "./BlogPostPage.css";

export default function BlogPostPage() {
	const { id } = useParams();

	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [isFavorite, setIsFavorite] = useState(false);
	const [favoriteId, setFavoriteId] = useState(null);

	useEffect(() => {
		async function fetchPost() {
			try {
				setLoading(true);
				setError("");

				const response = await fetch(`http://localhost:8000/posts/${id}`);

				if (response.status === 404) {
					throw new Error("Nie znaleziono posta.");
				}

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(
						`Nie udało się pobrać posta. Status: ${response.status}. ${errorText}`
					);
				}

				const data = await response.json();
				setPost(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		fetchPost();
	}, [id]);

	useEffect(() => {
		const loadFavorites = async () => {
			try {
				const response = await fetch("http://localhost:8000/favorites", {
					method: "GET",
					headers: {
						token: localStorage.getItem("token"),
					},
				});

				if (!response.ok) {
					throw new Error("Nie udało się pobrać ulubionych");
				}

				const data = await response.json();

				console.log(data);

				console.log("Znaleziony ulubiony:", data);
				if (data.length > 0) {
					console.log("Znaleziony ulubiony:", data);
					setIsFavorite(true);
					setFavoriteId(data[0].favorite_id);
				}
			} catch (err) {
				console.error(err);
			}
		};

		loadFavorites();
	}, [post]);

	const toggleFavorite = async () => {
		try {
			if (isFavorite) {
				const response = await fetch("http://localhost:8000/favorites", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						token: localStorage.getItem("token"),
					},
					body: JSON.stringify({
						favorite_id: favoriteId,
					}),
				});

				if (!response.ok) {
					throw new Error("Błąd usuwania");
				}

				setIsFavorite(false);
				setFavoriteId(null);
			} else {
				const response = await fetch("http://localhost:8000/favorites", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						token: localStorage.getItem("token"),
					},
					body: JSON.stringify({
						product_id: null,
						project_id: id,
					}),
				});

				if (!response.ok) {
					throw new Error("Błąd dodawania");
				}

				const data = await response.json();

				setIsFavorite(true);
				setFavoriteId(data.favorite_id);
			}
		} catch (err) {
			console.error(err);
		}
	};

	if (!post) {
		return (
			<div className="single-post-message">
				<h1>Post nie istnieje.</h1>
				<Link to="/blog">Wróć do bloga</Link>
			</div>
		);
	}

	return (
		<article className="single-post">
			<Link to="/blog" className="single-post-back">
				← Wróć do bloga
			</Link>

			<div className="single-post-header">
				<h1 className="single-post-title">{post.title}</h1>

				<button className="favorite-btn" onClick={toggleFavorite}>
					{isFavorite ? "★" : "☆"}
				</button>
			</div>

			<img src={defaultPostImage} alt={post.title} className="single-post-image" />

			<p className="single-post-content">{post.description || "Brak treści posta."}</p>
		</article>
	);
}
