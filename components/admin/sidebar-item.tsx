"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export default function SidebarItem({
  href,
  icon: Icon,
  label,
}: SidebarItemProps) {
  const pathname = usePathname();

  const isActive =
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`
        group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium
        transition-all duration-200
        ${
          isActive
            ? "bg-white/10 text-white shadow-sm"
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        }
      `}
    >
      <Icon
        size={20}
        className={`
          transition-colors duration-200
          ${
            isActive
              ? "text-white"
              : "text-gray-400 group-hover:text-white"
          }
        `}
      />

      <span>{label}</span>
    </Link>
  );
}