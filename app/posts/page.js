"use client";

import PostCard from "@/components/PostCard";
import { useAuth } from "@/components/AuthProvider";
import { usePosts } from "@/hooks/usePosts";

export default function PostsPage() {
  const { isAdmin } = useAuth();
  const { posts, loading, error, refresh } = usePosts();

  return (
    <section className="section page-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Archive</span>
          <h1>Posts</h1>
        </div>
      </div>

      {loading && <div className="center-state">Loading posts...</div>}
      {error && <div className="center-state error-state">{error}</div>}

      <div className="post-grid">
        {posts.map((post) => (
          <PostCard key={post.blogID} post={post} editable={isAdmin} onDeleted={refresh} />
        ))}
      </div>
    </section>
  );
}
