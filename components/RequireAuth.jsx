"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function RequireAuth({ admin = false, children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="center-state">Checking your session...</div>;
  }

  if (!user || (admin && !isAdmin)) {
    return (
      <section className="gate">
        <ShieldCheck size={28} />
        <h1>{admin ? "Admin access required" : "Sign in required"}</h1>
        <p>{admin ? "This workspace is only available to SavBlog admins." : "Sign in to continue to this area."}</p>
        <Link className="button primary" href="/login">
          Go to login
        </Link>
      </section>
    );
  }

  return children;
}
