"use client";

import { AlertCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function FirebaseNotice() {
  const { configured } = useAuth();

  if (configured) {
    return null;
  }

  return (
    <section className="config-notice">
      <AlertCircle size={20} />
      <div>
        <strong>Firebase config needed</strong>
        <span>Add the values from `.env.local.example` to `.env.local` to connect Auth, Firestore, and Storage.</span>
      </div>
    </section>
  );
}
