"use client";

import { getSupabaseClient } from "@/lib/supabase/client";

const POST_COVERS_BUCKET = "post-covers";
const POST_IMAGES_BUCKET = "post-images";

function getPublisherName(profile) {
  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim();
  return fullName || profile?.username || "SavBlogs";
}

function toPost(row) {
  const date = row.created_at ? new Date(row.created_at) : null;
  const publisher = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  return {
    id: row.id,
    blogID: row.id,
    blogTitle: row.title || "Untitled post",
    blogHTML: row.html || "",
    blogCoverPhoto: row.cover_image_url || "",
    blogCoverPhotoName: row.cover_image_path || "",
    profileId: row.author_id || "",
    publisherName: getPublisherName(publisher),
    publisherUsername: publisher?.username || "",
    date,
    dateLabel: date
      ? date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "Draft"
  };
}

export async function fetchPosts() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles:author_id(first_name,last_name,username)")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(toPost);
}

export async function uploadPostImage(file, bucket = POST_IMAGES_BUCKET) {
  const supabase = getSupabaseClient();
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const { data, error } = await supabase.storage.from(bucket).upload(safeName, file, {
    cacheControl: "3600",
    upsert: false
  });

  if (error) {
    throw error;
  }

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return {
    url: publicUrl.publicUrl,
    name: data.path
  };
}

export async function createPost({ title, html, coverFile, profileId }) {
  const supabase = getSupabaseClient();
  const cover = await uploadPostImage(coverFile, POST_COVERS_BUCKET);
  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      html,
      cover_image_url: cover.url,
      cover_image_path: cover.name,
      author_id: profileId
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

export async function updatePost(postId, { title, html, coverFile }) {
  const supabase = getSupabaseClient();
  const payload = {
    title,
    html,
    updated_at: new Date().toISOString()
  };

  if (coverFile) {
    const cover = await uploadPostImage(coverFile, POST_COVERS_BUCKET);
    payload.cover_image_url = cover.url;
    payload.cover_image_path = cover.name;
  }

  const { error } = await supabase.from("posts").update(payload).eq("id", postId);

  if (error) {
    throw error;
  }
}

export async function deletePost(postId) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    throw error;
  }
}
