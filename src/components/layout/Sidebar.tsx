"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import {
  usePathname,
  useSearchParams,
} from "next/navigation";

import { ChevronDown, Headphones } from "lucide-react";

import {
  NAV_SECTIONS,
  type NavItem,
} from "./navigation";

function isActive(
  pathname: string,
  href?: string,
  searchParams?: URLSearchParams,
) {
  if (!href) return false;

  if (href === "/") {
    return pathname === "/";
  }

  const [basePath, query = ""] = href.split("?");

  if (
    pathname !== basePath &&
    !pathname.startsWith(`${basePath}/`)
  ) {
    return false;
  }

  if (!query) return true;

  const expected = new URLSearchParams(query);

  for (const [key, value] of expected.entries()) {
    if (searchParams?.get(key) !== value) {
      return false;
    }
  }

  return true;
}

// Small four-point stars scattered around the logo (position, size, twinkle delay) - as on the website footer
const LOGO_SPARKLES = [
  { x: "8%", y: "6%", size: 9, delay: "0s" },
  { x: "22%", y: "30%", size: 6, delay: "1.1s" },
  { x: "82%", y: "4%", size: 11, delay: "0.5s" },
  { x: "92%", y: "38%", size: 7, delay: "1.7s" },
  { x: "-3%", y: "58%", size: 8, delay: "0.8s" },
  { x: "97%", y: "70%", size: 9, delay: "2.1s" },
  { x: "46%", y: "-4%", size: 7, delay: "1.4s" },
  { x: "70%", y: "88%", size: 6, delay: "0.3s" },
  { x: "14%", y: "92%", size: 7, delay: "1.9s" },
];

function SidebarContent({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Dropdown groups the admin opened/closed by hand; otherwise a group is open while one of its pages is
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;

    if (item.children?.length) {
      const childActive = item.children.some((c) => isActive(pathname, c.href, searchParams));
      const open = openGroups[item.label] ?? childActive;
      return (
        <div key={item.label}>
          <button
            type="button"
            onClick={() => setOpenGroups((g) => ({ ...g, [item.label]: !open }))}
            aria-expanded={open}
            className={`flex h-[31px] w-full items-center gap-[6px] rounded-[7px] px-[9px] text-left text-[12px] font-medium transition-all duration-150 ${childActive ? "text-white" : "text-[#F2F5F7] hover:bg-white/[0.07] hover:text-white"
              }`}
          >
            <span className="grid h-[21px] w-[21px] shrink-0 place-items-center">
              <Icon className="h-[15px] w-[15px]" strokeWidth={1.8} />
            </span>
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            <ChevronDown className={`h-[13px] w-[13px] shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="ml-[19px] mt-[1px] space-y-[1px] border-l border-white/15 pl-[6px]">
              {item.children.map(renderItem)}
            </div>
          )}
        </div>
      );
    }

    const active = isActive(
      pathname,
      item.href,
      searchParams,
    );

    const content = (
      <>
        <span
          className="
            grid
            h-[21px]
            w-[21px]
            shrink-0
            place-items-center
          "
        >
          <Icon
            className="h-[15px] w-[15px]"
            strokeWidth={1.8}
          />
        </span>

        <span className="min-w-0 flex-1 truncate">
          {item.label}
        </span>

        {item.badge &&
          item.badge !== "NEW" && (
            <span
              className="
                flex
                h-[19px]
                min-w-[24px]
                shrink-0
                items-center
                justify-center
                rounded-[4px]
                bg-[#8B2626]
                px-[5px]
                text-[9px]
                font-bold
                leading-none
                text-white
                shadow-[0_2px_5px_rgba(0,0,0,0.25)]
              "
            >
              {item.badge}
            </span>
          )}

        {item.badge === "NEW" && (
          <span
            className="
              flex
              h-[19px]
              shrink-0
              items-center
              justify-center
              rounded-[6px]
              bg-[linear-gradient(180deg,#3AAA63_0%,#25844C_100%)]
              px-[7px]
              text-[8px]
              font-bold
              leading-none
              text-white
              shadow-[0_2px_5px_rgba(0,0,0,0.22)]
            "
          >
            NEW
          </span>
        )}
      </>
    );

    if (
      item.disabled ||
      !item.href
    ) {
      return (
        <div
          key={item.label}
          aria-disabled="true"
          title="This module is not available yet"
          className="
            flex
            h-[29px]
            cursor-not-allowed
            items-center
            gap-[6px]
            rounded-[6px]
            px-[9px]
            text-[12px]
            font-medium
            text-white/35
          "
        >
          {content}
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href}
        onClick={onNavigate}
        className={`
          relative
          flex
          h-[31px]
          items-center
          gap-[6px]
          overflow-hidden
          rounded-[7px]
          px-[9px]
          text-[12px]
          font-medium
          transition-all
          duration-150

          ${active
            ? `
                bg-[linear-gradient(90deg,#fd6e15_0%,#E9902B_100%)]
                text-white
                shadow-[0_3px_10px_rgba(0,0,0,0.32)]
              `
            : `
                text-[#F2F5F7]
                hover:bg-white/[0.07]
                hover:text-white
              `
          }
        `}
      >
        {active && (
          <span
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[linear-gradient(180deg,rgba(255,255,255,0.10),transparent)]
            "
          />
        )}

        <span className="relative z-10 contents">
          {content}
        </span>
      </Link>
    );
  };

  return (
    <aside
      className="
        relative
        flex
        h-full
        w-[240px]
        shrink-0
        flex-col
        overflow-hidden
        border-r
        border-[#0f2d52]
        bg-[linear-gradient(180deg,#0A2B5E_0%,#071d3f_45%,#01182a_100%)]
        text-white
        shadow-[4px_0_18px_rgba(0,0,0,0.20)]
      "
    >
      {/* Soft orange glow in the bottom corner, as on the website's dark sections */}
      <div className="pointer-events-none absolute -bottom-24 -left-24 z-0 h-72 w-72 rounded-full bg-[#fd6e15]/10 blur-3xl" />

      {/* LOGO AREA */}
      <div
        className="
          relative
          z-10
          shrink-0
          px-[14px]
          pt-[14px]
          pb-[12px]
          text-center
        "
      >
        <Link href="/" aria-label="Design House India Pvt. Ltd. Admin home" className="group relative mx-auto block w-[204px]">
          {/* Soft white glow behind the logo so it stands out on the navy */}
          <span aria-hidden="true" className="pointer-events-none absolute left-[2%] top-[52%] h-[34%] w-[62%] rounded-full bg-white/[0.08] blur-xl" />
          <span aria-hidden="true" className="pointer-events-none absolute left-[25%] top-[8%] h-[45%] w-[55%] rounded-full bg-white/[0.025] blur-2xl" />
          {/* Twinkling white sparkles around the logo */}
          {LOGO_SPARKLES.map((sp, i) => (
            <svg
              key={i}
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="pointer-events-none absolute text-white animate-[logo-twinkle_2.8s_ease-in-out_infinite]"
              style={{ left: sp.x, top: sp.y, width: sp.size, height: sp.size, animationDelay: sp.delay, filter: "drop-shadow(0 0 3px rgba(255,255,255,0.9))" }}
            >
              <path fill="currentColor" d="M12 0c.6 5.6 2.4 9.4 12 12-9.6 2.6-11.4 6.4-12 12-.6-5.6-2.4-9.4-12-12C9.6 9.4 11.4 5.6 12 0z" />
            </svg>
          ))}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logoland.png"
            alt="Design House India Pvt. Ltd. Admin"
            width={2115}
            height={576}
            className="relative h-auto w-full transition-transform duration-200 group-hover:scale-[1.03] [filter:drop-shadow(0_0_4px_rgba(255,255,255,0.12))]"
          />
          {/* Shine sweep, masked to the logo's shape */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-[logo-shine_4s_ease-in-out_infinite]"
            style={{
              background: "linear-gradient(110deg, transparent 38%, rgba(255,255,255,0.85) 50%, transparent 62%)",
              backgroundSize: "260% 100%",
              WebkitMaskImage: "url(/logoland.png)",
              maskImage: "url(/logoland.png)",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          />
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav
        className="
          relative
          z-10
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          px-[14px]
          pb-[6px]

          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {NAV_SECTIONS.map(
          (
            section,
            index,
          ) => (
            <section
              key={section.title}
              className={`
                mb-[7px]
                ${index > 0
                  ? "border-t border-white/10 pt-[7px]"
                  : ""
                }
              `}
            >
              <div
                className="
                  mb-[4px]
                  flex
                  items-center
                  gap-[7px]
                  px-[5px]
                "
              >
                <h2
                  className="
                    shrink-0
                    text-[9.5px]
                    font-bold
                    uppercase
                    leading-[13px]
                    tracking-[0.035em]
                    text-[#fd6e15]
                  "
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.4)" }}
                >
                  {section.title}
                </h2>

                <span
                  className="
                    h-px
                    flex-1
                    bg-[#fd6e15]/25
                  "
                />
              </div>

              <div className="space-y-[1px]">
                {section.items.map(
                  renderItem,
                )}
              </div>
            </section>
          ),
        )}
      </nav>

      {/* HELP BOX */}
      <div
        className="
          relative
          z-10
          shrink-0
          px-[15px]
          pb-[13px]
          pt-[4px]
        "
      >
        <a
          href="mailto:info@designhouse.co.in"
          className="
            relative
            flex
            h-[64px]
            items-center
            gap-[10px]
            overflow-hidden
            rounded-[9px]
            border
            border-[#fd6e15]/40
            bg-[linear-gradient(90deg,#E9902B_0%,#fd6e15_100%)]
            px-[13px]
            text-white
            shadow-[0_4px_14px_rgba(0,0,0,0.24)]
            transition
            hover:brightness-110
          "
        >
          <span
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent)]
            "
          />

          <Headphones
            className="
              relative
              z-10
              h-[29px]
              w-[29px]
              shrink-0
              text-white
            "
            strokeWidth={1.45}
          />

          <span className="relative z-10 min-w-0">
            <span
              className="
                block
                text-[11px]
                font-bold
                leading-[15px]
                text-white
              "
            >
              Need Help?
            </span>

            <span
              className="
                mt-[1px]
                block
                text-[9.5px]
                font-semibold
                leading-[13px]
                text-white
              "
            >
              Contact IT Support
            </span>
          </span>
        </a>
      </div>
    </aside>
  );
}

export default function Sidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  return (
    <Suspense fallback={<aside className="flex h-screen w-[240px] shrink-0 flex-col bg-[#0A2B5E]" />}>
      <SidebarContent onNavigate={onNavigate} />
    </Suspense>
  );
}