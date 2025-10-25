"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
  { name: "Talk", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
];

export default function PageTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="flex w-full justify-start">
      <ul className="flex gap-2 py-2">
        {tabs.map((t) => {
          const isActive =
            t.href === "/"
              ? pathname === "/"
              : pathname.startsWith(t.href);

          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-zinc-900 text-white shadow"
                    : "text-zinc-600 hover:bg-zinc-100"
                )}
              >
                {t.name.toLowerCase()}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
