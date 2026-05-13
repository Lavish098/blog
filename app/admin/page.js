"use client";

import { ShieldPlus } from "lucide-react";
import { useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase/client";
import RequireAuth from "@/components/RequireAuth";

function AdminForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function submit(event) {
    event.preventDefault();
    setStatus("Updating admin role...");

    try {
      const token = await getFirebaseAuth().currentUser?.getIdToken();
      const response = await fetch("/api/admin/add-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not add admin.");
      }

      setStatus(data.message);
      setEmail("");
    } catch (err) {
      setStatus(err.message || "Could not add admin.");
    }
  }

  return (
    <section className="settings-page page-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Administration</span>
          <h1>Manage admin access</h1>
        </div>
      </div>

      <form className="settings-card narrow" onSubmit={submit}>
        <label className="field">
          <span>User email</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" required />
        </label>
        {status && <p className="form-status">{status}</p>}
        <button className="button primary" type="submit">
          <ShieldPlus size={17} />
          Make admin
        </button>
      </form>
    </section>
  );
}

export default function AdminPage() {
  return (
    <RequireAuth admin>
      <AdminForm />
    </RequireAuth>
  );
}
