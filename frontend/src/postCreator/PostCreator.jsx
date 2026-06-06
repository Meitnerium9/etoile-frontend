import "../App.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./PostCreator.css";

import PostCreatorTitle from "./components/PostCreatorTitle.jsx";
import PostCreatorImageUpload from "./components/PostCreatorImageUpload.jsx";
import PostCreatorDescription from "./components/PostCreatorDescription.jsx";
import PostCreatorActions from "./components/PostCreatorActions.jsx";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer";
import { useTitle } from "../main.jsx";
import { Navigate } from "react-router-dom";

function PostCreator() {
	if (localStorage.getItem("token") == null) return <Navigate to="/" replace />;
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const fileInputRef = useRef(null);
	const navigate = useNavigate();

	useTitle("Etoile - Blog - Stwórz post");

	const handleSave = async () => {
		setError("");
		setSuccess("");

		if (!title.trim()) {
			setError("Tytuł posta jest wymagany.");
			return;
		}

		if (!description.trim()) {
			setError("Opis posta jest wymagany.");
			return;
		}

		const newPost = {
			user_id: 1,
			project_id: null,
			title: title,
			description: description,
			image_path: image ? image.name : null,
		};

		try {
			setLoading(true);

			const response = await fetch("http://localhost:8000/posts/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "",
					"Access-Control-Allow-Methods": "",
					"Access-Control-Allow-Headers": "*",
				},
				body: JSON.stringify(newPost),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`Nie udało się utworzyć posta. Status: ${response.status}. ${errorText}`
				);
			}

			const data = await response.json();

			setSuccess("Post został zapisany.");

			setTitle("");
			setDescription("");
			setImage(null);

			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}

			navigate(`/blog/${data.post_id}`);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="app-container">
			<Navbar />

			<main className="post-creator-page">
				<div className="post-creator-wrapper">
					<PostCreatorTitle title={title} setTitle={setTitle} />

					<div className="post-creator-row">
						<PostCreatorImageUpload
							image={image}
							setImage={setImage}
							fileInputRef={fileInputRef}
						/>

						<PostCreatorDescription
							description={description}
							setDescription={setDescription}
						/>
					</div>

					{error && <p className="post-creator-error">{error}</p>}
					{success && <p className="post-creator-success">{success}</p>}

					<PostCreatorActions onSave={handleSave} disabled={loading} />

					{loading && <p className="post-creator-loading">Zapisywanie posta...</p>}
				</div>
			</main>

			<Footer />
		</div>
	);
}

export default PostCreator;
