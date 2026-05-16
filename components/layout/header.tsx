"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Wrench } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigationLinks = [
  { href: "/products", label: "Products" },
  { href: "/templates", label: "Templates" },
  { href: "/build-log", label: "Build Log" },
  { href: "/contact", label: "Contact" },
] as const;

type PaletteVariables = CSSProperties & {
  "--header-navy": string;
  "--header-navy-surface": string;
  "--header-warm-white": string;
  "--header-gold": string;
};

// These values read from globals.css custom properties and keep brand fallbacks.
const paletteVariables: PaletteVariables = {
  "--header-navy": "var(--navy, var(--color-navy, #0A0F1E))",
  "--header-navy-surface":
    "color-mix(in srgb, var(--header-navy) 90%, transparent)",
  "--header-warm-white":
    "var(--warm-white, var(--color-warm-white, #F5F0E8))",
  "--header-gold": "var(--accent-gold, var(--color-accent-gold, #C9A84C))",
};

const focusRingClasses =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--header-gold)]";

const logoStyle: CSSProperties = {
  color: "var(--header-warm-white)",
  fontFamily: "var(--font-playfair-display, 'Playfair Display', serif)",
};

const headerSurfaceStyle: CSSProperties = {
  ...paletteVariables,
  backgroundColor: "var(--header-navy-surface)",
  borderColor: "color-mix(in srgb, var(--header-gold) 22%, transparent)",
};

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getNavLinkClassName(isActive: boolean, isMobile = false) {
  const sizeClasses = isMobile
    ? "block px-4 py-3 text-base"
    : "inline-flex px-3 py-2 text-sm";

  return [
    "rounded-md font-medium tracking-wide transition-colors",
    "hover:text-[var(--header-gold)]",
    focusRingClasses,
    sizeClasses,
    isActive
      ? "text-[var(--header-gold)]"
      : "text-[var(--header-warm-white)]",
  ].join(" ");
}

export function Header() {
  const pathname = usePathname() ?? "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-navy focus:text-white focus:rounded focus:bg-[var(--header-navy)] focus:text-[var(--header-warm-white)] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--header-gold)]"
        style={paletteVariables}
      >
        Skip to main content
      </a>

      <header
        className="sticky top-0 z-40 border-b shadow-sm backdrop-blur supports-[backdrop-filter]:backdrop-blur-md"
        style={headerSurfaceStyle}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className={`flex items-center gap-2 rounded-md text-2xl font-semibold tracking-tight ${focusRingClasses}`}
            style={logoStyle}
          >
            <span>Fulatelier</span>
            <Wrench
              aria-hidden="true"
              className="h-4 w-4 text-[var(--header-gold)]"
              strokeWidth={2.2}
            />
          </Link>

          <nav aria-label="Main navigation" className="hidden md:block">
            <ul className="flex items-center gap-2">
              {navigationLinks.map((link) => {
                const isActive = isActivePath(pathname, link.href);

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={getNavLinkClassName(isActive)}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open navigation menu"
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-navigation"
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--header-warm-white)] transition-colors hover:text-[var(--header-gold)] ${focusRingClasses}`}
                >
                  <Menu aria-hidden="true" className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="border-l p-0"
                style={headerSurfaceStyle}
                onEscapeKeyDown={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex h-full flex-col px-6 py-8">
                  <SheetHeader className="text-left">
                    <SheetTitle
                      className="flex items-center gap-2 text-2xl font-semibold tracking-tight"
                      style={logoStyle}
                    >
                      Fulatelier
                      <Wrench
                        aria-hidden="true"
                        className="h-4 w-4 text-[var(--header-gold)]"
                        strokeWidth={2.2}
                      />
                    </SheetTitle>
                  </SheetHeader>

                  <nav
                    id="mobile-navigation"
                    aria-label="Main navigation"
                    className="mt-10"
                  >
                    <ul className="flex flex-col gap-2">
                      {navigationLinks.map((link) => {
                        const isActive = isActivePath(pathname, link.href);

                        return (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              aria-current={isActive ? "page" : undefined}
                              className={getNavLinkClassName(isActive, true)}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {link.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
