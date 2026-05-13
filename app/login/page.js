"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { Suspense, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: signInError } = await getSupabaseClient().auth.signInWithPassword({ email, password });

      if (signInError) {
        throw signInError;
      }

      router.push("/");
    } catch (err) {
      setError(err.message || "Could not sign you in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <Link href="/" className="brand auth-brand">
          <span className="brand-mark">S</span>
          <span>SavBlogs</span>
        </Link>
        <span className="eyebrow">Welcome back</span>
        <h1>Sign in to continue writing and reading.</h1>
        <form onSubmit={submit} className="form-card">
          {searchParams.get("registered") && (
            <p className="form-status">Account created. Check your email if confirmation is enabled, then sign in.</p>
          )}
          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error && <p className="form-status error-text">{error}</p>}
          <button className="button primary" type="submit" disabled={loading}>
            <LogIn size={17} />
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="auth-links">
          <Link href="/forgot-password">Forgot password?</Link>
          <Link href="/register">Create account</Link>
        </div>
      </div>
      <div className="auth-art" />
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
