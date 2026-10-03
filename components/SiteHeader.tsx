import Image from "next/image";
import { Search } from "./Search";
import { ScrollProgress } from "./ScrollProgress";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Compact documentation navbar: identity on the left, search and theme on the
 * right. Everything else (Keploy's site, the repo) lives in the footer, which
 * keeps the header quiet and gives the page one obvious primary control.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[88rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="flex min-w-0 items-center gap-3 rounded-lg"
          aria-label="Back to the top of the tutorial"
        >
          {/*
            Official Keploy logo, transparent PNG (public/keploy-logo.png).
            The asset's 172x62 canvas carries transparent padding: the artwork
            sits at x 34..156, y 13..51 of the canvas. The negative margins
            cancel exactly that padding, so the flex row centres and spaces the
            visible artwork instead of the empty canvas. Nothing is cropped, and
            object-contain means the image is scaled, never stretched.
          */}
          <span className="relative -mb-[6.4px] -ml-[22px] -mr-[9.7px] -mt-[8.4px] block h-10 shrink-0 aspect-[172/62]">
            <Image
              src="/keploy-logo.png"
              alt="Keploy"
              fill
              priority
              sizes="112px"
              className="object-contain"
            />
          </span>
          <span className="truncate text-[0.9rem] font-medium text-muted">Go Quickstart</span>
        </a>

        <div className="ml-auto flex items-center gap-2">
          <Search />
          <ThemeToggle />
        </div>
      </div>
      <ScrollProgress className="absolute inset-x-0 bottom-0" />
    </header>
  );
}
