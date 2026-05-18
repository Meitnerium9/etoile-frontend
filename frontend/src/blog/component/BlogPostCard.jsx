import "./BlogPostCard.css";
import { Link } from "react-router-dom";

function BlogPostCard({ post }) {
  return (
    <article className="blog-post-card">
      <div className="blog-post-content">
        <img src={post.image} className="blog-post-image" />

        <div className="blog-post-right">
          <h2 className="blog-post-title">{post.title}</h2>
          <p className="blog-post-excerpt">{post.excerpt}</p>
        </div>
      </div>

      <Link to={`/blog/${post.id}`} className="blog-post-read-more">
        Czytaj dalej...
      </Link>
      <div className="blog-post-divider" />
    </article>
  );
}

export default BlogPostCard;