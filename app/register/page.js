"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { createUserProfile } from "@/lib/users";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await createUserWithEmailAndPassword(getFirebaseAuth(), form.email, form.password);
      await createUserProfile(result.user.uid, {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email
      });
      await sendEmailVerification(result.user);
      router.push("/");
    } catch (err) {
      setError(err.message || "Could not create your account.");
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
        <span className="eyebrow">Create account</span>
        <h1>Join the SavBlogs reader and writer space.</h1>
        <form onSubmit={submit} className="form-card">
          <div className="two-column">
            <label className="field">
              <span>First name</span>
              <input value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} required />
            </label>
            <label className="field">
              <span>Last name</span>
              <input value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} required />
            </label>
          </div>
          <label className="field">
            <span>Username</span>
            <input value={form.username} onChange={(event) => updateField("username", event.target.value)} required />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} required />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} required />
          </label>
          {error && <p className="form-status error-text">{error}</p>}
          <button className="button primary" type="submit" disabled={loading}>
            <UserPlus size={17} />
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <div className="auth-links">
          <Link href="/login">Already have an account?</Link>
        </div>
      </div>
      <div className="auth-art" />
    </section>
  );
}
