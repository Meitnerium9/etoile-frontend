import "../App.css";
import { useState, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./PostCreator.css";

import PostCreatorTitle from "./components/PostCreatorTitle.jsx";
import PostCreatorImageUpload from "./components/PostCreatorImageUpload.jsx";
import PostCreatorDescription from "./components/PostCreatorDescription.jsx";
import PostCreatorActions from "./components/PostCreatorActions.jsx";
import ProjectList from "./components/ProjectList.jsx";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer";
import { useTitle } from "../main.jsx";

function PostCreator() {
	if (localStorage.getItem("token") == null) {
		return <Navigate to="/" replace />;
	}

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [selectedProject, setSelectedProject] = useState(null);

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

		if (!selectedProject) {
			setError("Musisz wybrać projekt przed utworzeniem posta.");
			return;
		}

		const newPost = {
			project_id: selectedProject.project_id,
			title,
			description,
			image_path: selectedProject.image_path, // 🔥 TO JEST KLUCZ
		};

		try {
			setLoading(true);

			const response = await fetch("http://localhost:8000/posts/", {
				method: "POST",
				headers: {
					token: localStorage.getItem("token"),
					"Content-Type": "application/json",
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
			setSelectedProject(null);

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
						<PostCreatorDescription
							description={description}
							setDescription={setDescription}
						/>
					</div>

					<h2>Wybierz projekt do posta</h2>

					<ProjectList
						selectedProject={selectedProject?.project_id}
						onSelectProject={(project) => setSelectedProject(project)}
					/>

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
