"use client";

import { AlertCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function SupabaseNotice() {
  const { configured } = useAuth();

  if (configured) {
    return null;
  }

  return (
    <section className="config-notice">
      <AlertCircle size={20} />
      <div>
        <strong>Supabase config needed</strong>
        <span>Add the Supabase values from `.env.local.example` to `.env.local` to connect Auth, Database, and Storage.</span>
      </div>
    </section>
  );
}
