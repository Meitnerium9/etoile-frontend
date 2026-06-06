import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Koszyk from "./koszyk/Koszyk.jsx";
import Register from "./register/App.jsx";
import Creator from "./creator/Creator.jsx";
import PostCreator from "./postCreator/PostCreator.jsx";
import Blog from "./blog/Blog.jsx";
import { useEffect } from "react";
import Konto from "./konto/Konto.jsx";
import Favorites from "./favorites/Favorites.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/koszyk" element={<Koszyk />} />
				<Route path="/register" element={<Register />} />
				<Route path="/creator" element={<Creator />} />
				<Route path="/postCreator" element={<PostCreator />} />
				<Route path="/blog/*" element={<Blog />} />
				<Route path="/konto/*" element={<Konto />} />
				<Route path="/ulubione" element={<Favorites />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);

export function useTitle(title) {
	useEffect(() => {
		document.title = title;
	}, [title]);
}
