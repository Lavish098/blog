"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Edit3 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { usePosts } from "@/hooks/usePosts";

export default function ViewPostPage() {
  const params = useParams();
  const { isAdmin } = useAuth();
  const { posts, loading } = usePosts();
  const post = posts.find((item) => item.blogID === params.id);

  if (loading) {
    return <div className="center-state page-section">Loading post...</div>;
  }

  if (!post) {
    return <div className="center-state page-section">This post could not be found.</div>;
  }

  return (
    <article className="article-page">
      <header className="article-hero">
        <span className="eyebrow">{post.dateLabel}</span>
        <h1>{post.blogTitle}</h1>
        {isAdmin && (
          <Link href={`/studio/edit/${post.blogID}`} className="button ghost">
            <Edit3 size={16} />
            Edit post
          </Link>
        )}
      </header>

      <div className="article-cover">
        {post.blogCoverPhoto ? <Image src={post.blogCoverPhoto} alt="" fill priority sizes="100vw" /> : null}
      </div>

      <div className="article-body" dangerouslySetInnerHTML={{ __html: post.blogHTML }} />
    </article>
  );
}
