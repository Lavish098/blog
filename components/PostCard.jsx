"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Edit3, Trash2 } from "lucide-react";
import { deletePost } from "@/lib/posts";

export default function PostCard({ post, editable = false, onDeleted }) {
  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${post.blogTitle}"?`);
    if (!confirmed) return;
    await deletePost(post.blogID);
    onDeleted?.();
  }

  return (
    <article className="post-card">
      {editable && (
        <div className="card-tools">
          <Link href={`/studio/edit/${post.blogID}`} aria-label={`Edit ${post.blogTitle}`}>
            <Edit3 size={16} />
          </Link>
          <button type="button" onClick={handleDelete} aria-label={`Delete ${post.blogTitle}`}>
            <Trash2 size={16} />
          </button>
        </div>
      )}
      <Link href={`/posts/${post.blogID}`} className="post-media">
        {post.blogCoverPhoto ? (
          <Image src={post.blogCoverPhoto} alt="" fill sizes="(min-width: 900px) 33vw, 100vw" />
        ) : (
          <div className="image-fallback">SavBlogs</div>
        )}
      </Link>
      <div className="post-card-body">
        <h3>{post.blogTitle}</h3>
        <span className="post-meta">By {post.publisherName} · {post.dateLabel}</span>
        <Link href={`/posts/${post.blogID}`} className="inline-link">
          Read post <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
