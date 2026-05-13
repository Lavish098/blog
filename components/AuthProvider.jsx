"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/client";
import { fetchUserProfile, getInitials } from "@/lib/users";

const AuthContext = createContext({
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
  configured: false,
  refreshProfile: async () => {},
  signOut: async () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const configured = hasSupabaseConfig();

  async function loadProfile(currentUser) {
    if (!currentUser) {
      setProfile(null);
      return;
    }

    setProfile(await fetchUserProfile(currentUser.id));
  }

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return undefined;
    }

    const supabase = getSupabaseClient();
    let mounted = true;

    async function hydrateSession() {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user || null;

      if (!mounted) return;
      setUser(currentUser);
      await loadProfile(currentUser);
      if (mounted) setLoading(false);
    }

    hydrateSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user || null;
      setLoading(true);
      setUser(currentUser);
      await loadProfile(currentUser);
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [configured]);

  const value = useMemo(
    () => ({
      user,
      profile,
      isAdmin: Boolean(profile?.isAdmin),
      initials: getInitials(profile?.firstName, profile?.lastName),
      loading,
      configured,
      refreshProfile: () => loadProfile(user),
      signOut: async () => {
        if (!configured) return;
        await getSupabaseClient().auth.signOut();
      }
    }),
    [configured, loading, profile, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
