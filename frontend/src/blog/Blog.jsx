import "./Blog.css";

import { Routes, Route } from "react-router-dom";

import BlogHeader from "./component/BlogHeader.jsx";
import AddPostButton from "./component/AddPostButton.jsx";
import BlogPostList from "./component/BlogPostList.jsx";
import BlogPostPage from "./component/BlogPostPage.jsx";
import UserPostsView from "./component/UserPostsView.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useTitle } from "../main.jsx";

export default function Blog() {
	useTitle("Etoile - Blog");
	return (
		<>
			<Navbar />
			<main className="blog-page">
				<div className="blog-container">
					<Routes>
						<Route
							index
							element={
								<>
									<BlogHeader />
									{localStorage.getItem("token") != null && <AddPostButton />}
									<BlogPostList />
								</>
							}
						/>
						<Route path=":id" element={<BlogPostPage />} />
						<Route path="user/:userId" element={<UserPostsView />} />
					</Routes>
				</div>
			</main>
			<Footer />
		</>
	);
}
