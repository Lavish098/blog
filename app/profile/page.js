"use client";

import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import RequireAuth from "@/components/RequireAuth";
import { updateUserProfile } from "@/lib/users";

function ProfileForm() {
  const { user, profile, initials, refreshProfile } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", username: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    setForm({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      username: profile?.username || ""
    });
  }, [profile]);

  console.log(profile)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setStatus("Saving profile...");
    await updateUserProfile(user.uid, form);
    await refreshProfile();
    setStatus("Profile updated.");
  }

  return (
    <section className="settings-page page-section">
      <div className="profile-summary">
        <span className="profile-avatar">{initials}</span>
        <div>
          <span className="eyebrow">Account</span>
          <h1>{profile?.firstName || "Your"} profile</h1>
          <p>{profile?.email}</p>
        </div>
      </div>

      <form className="settings-card" onSubmit={submit}>
        <div className="two-column">
          <label className="field">
            <span>First name</span>
            <input value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} />
          </label>
          <label className="field">
            <span>Last name</span>
            <input value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} />
          </label>
        </div>
        <label className="field">
          <span>Username</span>
          <input value={form.username} onChange={(event) => updateField("username", event.target.value)} />
        </label>
        <label className="field">
          <span>Email</span>
          <input value={profile?.email || ""} disabled />
        </label>
        {status && <p className="form-status">{status}</p>}
        <button className="button primary" type="submit">
          <Save size={17} />
          Save changes
        </button>
      </form>
    </section>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileForm />
    </RequireAuth>
  );
}
