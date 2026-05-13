"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/client";
import { ensureUserProfile, getInitials } from "@/lib/users";

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
  const [sessionLoading, setSessionLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const configured = hasSupabaseConfig();

  async function loadProfile(currentUser) {
    if (!currentUser) {
      setProfile(null);
      return null;
    }

    const nextProfile = await ensureUserProfile(currentUser);
    setProfile(nextProfile);
    return nextProfile;
  }

  useEffect(() => {
    if (!configured) {
      setSessionLoading(false);
      return undefined;
    }

    const supabase = getSupabaseClient();
    let mounted = true;

    async function hydrateSession() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (mounted) {
          setUser(data.session?.user || null);
        }
      } catch (err) {
        console.error("Could not load Supabase session", err);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setSessionLoading(false);
        }
      }
    }

    hydrateSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setSessionLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [configured]);

  useEffect(() => {
    let mounted = true;

    async function hydrateProfile() {
      if (!user) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);

      try {
        const nextProfile = await ensureUserProfile(user);

        if (mounted) {
          setProfile(nextProfile);
        }
      } catch (err) {
        console.error("Could not load Supabase profile", err);

        if (mounted) {
          setProfile({
            id: user.id,
            firstName: user.user_metadata?.first_name || "",
            lastName: user.user_metadata?.last_name || "",
            username: user.user_metadata?.username || user.email?.split("@")[0] || "",
            email: user.email || "",
            isAdmin: false
          });
        }
      } finally {
        if (mounted) {
          setProfileLoading(false);
        }
      }
    }

    hydrateProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      profile,
      isAdmin: Boolean(profile?.isAdmin),
      initials: getInitials(profile?.firstName, profile?.lastName),
      loading: sessionLoading || profileLoading,
      configured,
      refreshProfile: () => loadProfile(user),
      signOut: async () => {
        if (!configured) return;
        await getSupabaseClient().auth.signOut();
      }
    }),
    [configured, profile, profileLoading, sessionLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
