"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { home } from "@/data/home";

const items = [
  { href: "/", label: "Home" },
  { href: "/prescribe", label: "Prescribe" },
  { href: "/patients", label: "Patients" },
  { href: "/research", label: "Research Agent" },
];

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="top-nav">
      <div className="top-nav-start">
        <Link className="brand" href="/">
          <img className="brand-mark" src="/brand-mark.svg" alt="" width={40} height={24} />
          <span>ScriptAssist</span>
        </Link>
        <nav className="nav-items" aria-label="Primary">
          {items.map((item) => {
            const current = isCurrent(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                aria-current={current ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="top-nav-end">
        {pathname.startsWith("/prescribe") && (
          <>
            <label className="nav-search">
              <span aria-hidden="true">⌕</span>
              <input type="search" placeholder="Search patients or drugs" aria-label="Search patients or drugs" />
            </label>
            <span className="nav-alerts">3 alerts</span>
          </>
        )}
        <span className="avatar" aria-label="Dr. Rivera">
          {home.initials}
        </span>
      </div>
    </header>
  );
}
