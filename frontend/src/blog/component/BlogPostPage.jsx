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
	const [projectId, setProjectId] = useState(null);
	const [favCount, setFavCount] = useState(0);
	const [projectImage, setProjectImage] = useState(null);

	useEffect(() => {
		setPost(null);
		setIsFavorite(false);
		setFavoriteId(null);
		setProjectId(null);
		setFavCount(0);
	}, [id]);

	useEffect(() => {
		async function fetchPost() {
			try {
				setLoading(true);
				setError("");

				const response = await fetch(`http://localhost:8000/posts/${id}`, {
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "",
						"Access-Control-Allow-Methods": "",
						"Access-Control-Allow-Headers": "*",
					},
				});

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

				// pobranie projektu
				const projectResponse = await fetch(
					`http://localhost:8000/projects/${data.project_id}`
				);

				if (!projectResponse.ok) {
					throw new Error("Nie udało się pobrać danych projektu.");
				}

				const project = await projectResponse.json();

				// wzbogacenie posta o autora
				const enrichedPost = {
					...data,
					author: project.username,
				};

				setPost(enrichedPost);
				setProjectImage(data.image_path);
				setProjectId(data.project_id);
				setFavCount(data.fav);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		fetchPost();
	}, [id]);

	useEffect(() => {
		async function loadFavorites() {
			try {
				console.log("Ładowanie ulubionych dla projektu:", projectId);
				const response = await fetch("http://localhost:8000/favorites", {
					method: "GET",
					headers: {
						token: localStorage.getItem("token"),
						"Access-Control-Allow-Origin": "",
						"Access-Control-Allow-Methods": "",
						"Access-Control-Allow-Headers": "*",
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error("Nie udało się pobrać ulubionych");
				}

				const data = await response.json();

				console.log(data);

				console.log("Znaleziony ulubiony:", data);
				const fav = data.find((f) => f.project_id === projectId);
				if (fav) {
					setIsFavorite(true);
					setFavoriteId(fav.favorite_id);
				} else {
					setIsFavorite(false);
					setFavoriteId(null);
				}
				console.log("isFavorite ustawione na:", isFavorite);
			} catch (err) {
				console.error(err);
			}
		}

		loadFavorites();
	}, [projectId]);

	const toggleFavorite = async () => {
		try {
			if (isFavorite) {
				const response = await fetch("http://localhost:8000/favorites", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						token: localStorage.getItem("token"),
						"Access-Control-Allow-Origin": "",
						"Access-Control-Allow-Methods": "",
						"Access-Control-Allow-Headers": "*",
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
				setFavCount((prev) => prev - 1);
			} else {
				const response = await fetch("http://localhost:8000/favorites", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						token: localStorage.getItem("token"),
						"Access-Control-Allow-Origin": "",
						"Access-Control-Allow-Methods": "",
						"Access-Control-Allow-Headers": "*",
					},
					body: JSON.stringify({
						product_id: null,
						project_id: projectId,
					}),
				});

				if (!response.ok) {
					throw new Error("Błąd dodawania");
				}

				const data = await response.json();

				setIsFavorite(true);
				setFavoriteId(data.favorite_id);
				setFavCount((prev) => prev + 1);
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
				<Link to={`/blog/user/${post.user_id}`} className="blog-post-author">
					Autor: {post.author}
				</Link>
				{localStorage.getItem("token") && (
					<button className="favorite-btn" onClick={toggleFavorite}>
						{favCount}
						<img
							src={
								isFavorite
									? "/src/assets/ulubione-fill.png"
									: "/src/assets/ulubione.png"
							}
							alt="ulubione"
							className="nav-iconFav-img"></img>
					</button>
				)}
			</div>

			<img
				src={projectImage || defaultPostImage}
				alt={post.title}
				className="single-post-image"
			/>

			<p className="single-post-content">{post.description || "Brak treści posta."}</p>
		</article>
	);
}
