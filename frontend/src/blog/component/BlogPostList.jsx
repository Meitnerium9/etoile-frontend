import BlogPostCard from "./BlogPostCard";
import { posts } from "../postsData";

export default function BlogPostList() {
  return (
    <>
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </>
  );
}