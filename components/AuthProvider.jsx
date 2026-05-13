"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { getFirebaseAuth, hasFirebaseConfig } from "@/lib/firebase/client";
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
  const [claims, setClaims] = useState({});
  const [loading, setLoading] = useState(true);
  const configured = hasFirebaseConfig();

  async function loadProfile(currentUser) {
    if (!currentUser) {
      setProfile(null);
      setClaims({});
      return;
    }

    const [profileData, token] = await Promise.all([
      fetchUserProfile(currentUser.uid),
      currentUser.getIdTokenResult(true)
    ]);

    setProfile(profileData);
    setClaims(token.claims || {});
  }

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return undefined;
    }

    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      await loadProfile(currentUser);
      setLoading(false);
    });
  }, [configured]);

  const value = useMemo(
    () => ({
      user,
      profile,
      isAdmin: Boolean(claims.admin),
      initials: getInitials(profile?.firstName, profile?.lastName),
      loading,
      configured,
      refreshProfile: () => loadProfile(user),
      signOut: async () => {
        if (!configured) return;
        await firebaseSignOut(getFirebaseAuth());
      }
    }),
    [claims.admin, configured, loading, profile, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
