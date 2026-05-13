"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchPosts } from "@/lib/posts";
import { useAuth } from "@/components/AuthProvider";

export function usePosts() {
  const { configured } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!configured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      setPosts(await fetchPosts());
    } catch (err) {
      setError(err.message || "Could not load posts.");
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { posts, loading, error, refresh };
}
