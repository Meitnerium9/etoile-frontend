import { Link, useParams } from "react-router-dom";
import { posts } from "../postsData.js";
import "./BlogPostPage.css";

export default function BlogPostPage() {
  const { id } = useParams();

  const post = posts.find((post) => post.id === Number(id));

  if (!post) {
    return (
      <div>
        <h1>Nie znaleziono posta</h1>
        <Link to="/blog">Wróć do bloga</Link>
      </div>
    );
  }

  return (
    <article className="single-post">
      <Link to="/blog" className="single-post-back">
        ← Wróć do bloga
      </Link>

      <h1 className="single-post-title">{post.title}</h1>

      <img src={post.image} alt={post.title} className="single-post-image" />

      <p className="single-post-content">{post.content}</p>
    </article>
  );
}