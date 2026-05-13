"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function submit(event) {
    event.preventDefault();
    setStatus("Sending reset email...");

    try {
      const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`
      });

      if (error) {
        throw error;
      }

      setStatus("Check your inbox for a reset link.");
    } catch (err) {
      setStatus(err.message || "Could not send reset email.");
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-panel compact">
        <Link href="/" className="brand auth-brand">
          <span className="brand-mark">S</span>
          <span>SavBlogs</span>
        </Link>
        <span className="eyebrow">Password reset</span>
        <h1>Get a reset link sent to your inbox.</h1>
        <form onSubmit={submit} className="form-card">
          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          {status && <p className="form-status">{status}</p>}
          <button className="button primary" type="submit">
            <Mail size={17} />
            Send reset link
          </button>
        </form>
        <div className="auth-links">
          <Link href="/login">Back to login</Link>
        </div>
      </div>
      <div className="auth-art" />
    </section>
  );
}
