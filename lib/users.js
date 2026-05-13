"use client";

import { getSupabaseClient } from "@/lib/supabase/client";

export function getInitials(firstName = "", lastName = "") {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "SB";
}

function fromProfile(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    firstName: row.first_name || "",
    lastName: row.last_name || "",
    username: row.username || "",
    email: row.email || "",
    isAdmin: Boolean(row.is_admin)
  };
}

export async function fetchUserProfile(uid) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();

  if (error) {
    throw error;
  }

  return fromProfile(data);
}

export async function ensureUserProfile(user) {
  const existingProfile = await fetchUserProfile(user.id);

  if (existingProfile) {
    return existingProfile;
  }

  const supabase = getSupabaseClient();
  const metadata = user.user_metadata || {};
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        first_name: metadata.first_name || "",
        last_name: metadata.last_name || "",
        username: metadata.username || user.email?.split("@")[0] || "",
        email: user.email || "",
        is_admin: false
      },
      { onConflict: "id" }
    )
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return fromProfile(data);
}

export async function updateUserProfile(uid, profile) {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: profile.firstName,
      last_name: profile.lastName,
      username: profile.username
    })
    .eq("id", uid);

  if (error) {
    throw error;
  }
}
