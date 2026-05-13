"use client";

import { useParams } from "next/navigation";
import PostEditor from "@/components/PostEditor";
import RequireAuth from "@/components/RequireAuth";
import { usePosts } from "@/hooks/usePosts";

export default function EditPostPage() {
  const params = useParams();
  const { posts, loading } = usePosts();
  const post = posts.find((item) => item.blogID === params.id);

  return (
    <RequireAuth admin>
      {loading && <div className="center-state page-section">Loading post...</div>}
      {!loading && !post && <div className="center-state page-section">This post could not be found.</div>}
      {!loading && post && <PostEditor post={post} />}
    </RequireAuth>
  );
}
