import "./Blog.css";

import { Routes, Route } from "react-router-dom";

import BlogHeader from "./component/BlogHeader.jsx";
import AddPostButton from "./component/AddPostButton.jsx";
import BlogPostList from "./component/BlogPostList.jsx";
import BlogPostPage from "./component/BlogPostPage.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function Blog() {
  return (
    <main className="blog-page">
      <div className="blog-container">
        <Routes>
          <Route 
            index 
            element={
              <>
                  <Navbar />
                <BlogHeader />
                <AddPostButton />
                <BlogPostList />
                  <Footer />
              </>
            }
          />
          <Route path=":id" element={<BlogPostPage />} />
        </Routes>
      </div>
    </main>
  );
}