"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FeaturedPost from "@/components/FeaturedPost";
import PostCard from "@/components/PostCard";
import { useAuth } from "@/components/AuthProvider";
import { usePosts } from "@/hooks/usePosts";

export default function HomePage() {
  const { user } = useAuth();
  const { posts, loading, error } = usePosts();
  const [feature, ...rest] = posts;

  return (
    <div className="page-stack">
      {!user && <FeaturedPost welcome />}
      {user && feature && <FeaturedPost post={feature} />}

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Latest stories</span>
            <h2>Fresh from SavBlogs</h2>
          </div>
          <Link href="/posts" className="inline-link">
            Browse all <ArrowRight size={16} />
          </Link>
        </div>

        {loading && <div className="center-state">Loading posts...</div>}
        {error && <div className="center-state error-state">{error}</div>}
        {!loading && !posts.length && <div className="center-state">No posts yet. The studio is ready when you are.</div>}

        <div className="post-grid">
          {(user ? rest.slice(0, 6) : posts.slice(0, 6)).map((post) => (
            <PostCard key={post.blogID} post={post} />
          ))}
        </div>
      </section>

      {!user && (
        <section className="cta-band">
          <div>
            <span className="eyebrow">Members</span>
            <h2>Keep your profile close and never miss a new post.</h2>
          </div>
          <Link className="button primary" href="/register">
            Create account <ArrowRight size={17} />
          </Link>
        </section>
      )}
    </div>
  );
}
