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
		let isMounted = true;

		async function loadAll() {
			try {
				setLoading(true);
				setError("");

				// 1. POST
				const response = await fetch(`http://localhost:8000/posts/${id}`, {
					headers: {
						"Content-Type": "application/json",
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

				const postData = await response.json();

				// 2. PROJECT (od razu po poście)
				const projectResponse = await fetch(
					`http://localhost:8000/projects/${postData.project_id}`
				);

				if (!projectResponse.ok) {
					throw new Error("Nie udało się pobrać danych projektu.");
				}

				const project = await projectResponse.json();

				const enrichedPost = {
					...postData,
					author: project.username,
				};

				if (!isMounted) return;

				setPost(enrichedPost);
				setProjectImage(postData.image_path);
				setProjectId(postData.project_id);
				setFavCount(postData.fav);

				// 3. FAVORITES (dopiero gdy mamy projectId)
				const token = localStorage.getItem("token");

				if (token) {
					const favRes = await fetch("http://localhost:8000/favorites", {
						method: "GET",
						headers: {
							token,
							"Content-Type": "application/json",
						},
					});

					if (!favRes.ok) {
						throw new Error("Nie udało się pobrać ulubionych");
					}

					const favData = await favRes.json();

					const fav = favData.find((f) => f.project_id === postData.project_id);

					if (isMounted) {
						setIsFavorite(!!fav);
						setFavoriteId(fav?.favorite_id ?? null);
					}
				}
			} catch (err) {
				if (isMounted) {
					setError(err.message);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		loadAll();

		return () => {
			isMounted = false;
		};
	}, [id]);

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
									? "/src/assets/ulubione-fill.webp"
									: "/src/assets/ulubione.webp"
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
