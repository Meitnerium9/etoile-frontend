import "./BlogPostCard.css";
import { Link } from "react-router-dom";
import defaultImage from "../images/post1.jpg";

function BlogPostCard({ post }) {
	return (
		<article className="blog-post-card">
			<div className="blog-post-content">
				<img
					src={post.image_path || defaultImage}
					alt={post.title || post.name}
					className="blog-post-image"
				/>

				<div className="blog-post-right">
					<div className="blog-post-header">
						<h2 className="blog-post-title">{post.title}</h2>
						<p className="blog-post-author">Autor: {post.author}</p>
					</div>

					<p className="blog-post-excerpt">
						{post.description?.length > 180
							? post.description.slice(0, 180) + "..."
							: post.description}
					</p>
				</div>
			</div>

			<Link to={`/blog/${post.post_id}`} className="blog-post-read-more">
				Czytaj dalej...
			</Link>

			<div className="blog-post-divider" />
		</article>
	);
}

export default BlogPostCard;
