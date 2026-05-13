"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function FeaturedPost({ post, welcome = false }) {
  if (welcome) {
    return (
      <section className="feature-panel welcome-panel">
        <div className="feature-copy">
          <span className="eyebrow">Welcome to SavBlogs</span>
          <h1>Fresh gist, thoughtful recaps, and room for your next favorite story.</h1>
          <p>Follow new posts, save your profile, and let the blog feel a little more like a home base.</p>
          <Link href="/register" className="button primary">
            Join SavBlogs <ArrowRight size={17} />
          </Link>
        </div>
        <div className="feature-art">
          <Image src="/hero-library.png" alt="" fill priority sizes="(min-width: 900px) 50vw, 100vw" />
        </div>
      </section>
    );
  }

  return (
    <section className="feature-panel">
      <div className="feature-copy">
        <span className="eyebrow">{post.dateLabel}</span>
        <h1>{post.blogTitle}</h1>
        <p>{stripHtml(post.blogHTML).slice(0, 180) || "Open the post to read the full story."}</p>
        <Link href={`/posts/${post.blogID}`} className="button primary">
          Read feature <ArrowRight size={17} />
        </Link>
      </div>
      <div className="feature-art">
        {post.blogCoverPhoto ? <Image src={post.blogCoverPhoto} alt="" fill priority sizes="(min-width: 900px) 50vw, 100vw" /> : null}
      </div>
    </section>
  );
}
