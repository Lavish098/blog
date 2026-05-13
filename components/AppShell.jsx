"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, LogOut, Menu, PenLine, Shield, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" }
];

function NavLink({ href, children, onClick }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link className={active ? "nav-link active" : "nav-link"} href={href} onClick={onClick}>
      {children}
    </Link>
  );
}

export default function AppShell({ children }) {
  const pathname = usePathname();
  const authRoute = ["/login", "/register", "/forgot-password"].includes(pathname);
  const { user, profile, initials, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="site-shell">
      {!authRoute && (
        <header className="site-header">
          <Link href="/" className="brand" aria-label="SavBlog home">
            <Image src="/favicon.png" alt="SavBlog Logo" width={55} height={52} />
            <span>SavBlogs</span>
          </Link>

          <nav className="desktop-nav">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink href="/studio/new">
                <PenLine size={16} />
                Create
              </NavLink>
            )}
          </nav>

          <div className="header-actions">
            {user ? (
              <div className="account-chip">
                <span className="avatar">{initials}</span>
                <span className="account-copy">
                  <strong>{profile?.firstName || "SavBlog"}</strong>
                  <small>{isAdmin ? "Admin" : "Member"}</small>
                </span>
                <div className="account-menu">
                  <Link href="/profile">
                    <UserRound size={16} />
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link href="/admin">
                      <Shield size={16} />
                      Admin
                    </Link>
                  )}
                  <button type="button" onClick={signOut}>
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="button ghost">
                Login
              </Link>
            )}

            <button className="icon-button mobile-menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {open && (
            <nav className="mobile-nav">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink href="/studio/new" onClick={() => setOpen(false)}>
                  Create
                </NavLink>
              )}
              {!user && (
                <NavLink href="/login" onClick={() => setOpen(false)}>
                  Login
                </NavLink>
              )}
            </nav>
          )}
        </header>
      )}

      <main>{children}</main>

      {!authRoute && (
        <footer className="site-footer">
          <span>SavBlogs</span>
          <p>Stories, reviews, and ZeeWorld moments curated with care.</p>
        </footer>
      )}
    </div>
  );
}
