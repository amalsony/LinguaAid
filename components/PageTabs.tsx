"use client";

import clsx from "clsx";

const tabs = [
  { label: "Talk", href: "/" },
  { label: "Patient Dashboard", href: "/dashboard" },
];

export default function PageTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="w-full">
      <ul className="flex gap-2">
        {tabs.map((t) => {
          const isActive =
            t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);

          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "inline-flex items-center pt-3 pb-2 font-medium transition-colors px-4",
                  "border-b-2",
                  isActive
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
                )}
              >
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
